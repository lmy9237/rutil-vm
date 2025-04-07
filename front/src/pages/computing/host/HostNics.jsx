import React, { useState, useEffect, useRef, Suspense } from "react";
import { useHost, useNetworkAttachmentsFromHost, useNetworkFromCluster, useNetworkInterfacesFromHost } from "../../../api/RQHook";
import { checkZeroSizeToMbps } from "../../../util";
import { RVI16, rvi16TriangleDown, rvi16TriangleUp, rvi16VirtualMachine, RVI24, rvi24CompareArrows, RVI36, rvi36Edit, status2Icon } from "../../../components/icons/RutilVmIcons";
import Loading from "../../../components/common/Loading";
import HostNetworkEditModal from "../../../components/modal/host/HostNetworkEditModal";
import HostNetworkBondingModal from "../../../components/modal/host/HostNetworkBondingModal";
import LabelCheckbox from "../../../components/label/LabelCheckbox";
import { Tooltip } from "react-tooltip";
import ActionButton from "../../../components/button/ActionButton";
import Localization from "../../../utils/Localization";

const assignmentMethods = [
  { value: "none", label: "없음" },
  { value: "static", label: "정적" },
  { value: "poly_dhcp_autoconf", label: "DHCP 및 상태 비저장 주소 자동 설정" },
  { value: "autoconf", label: "상태 비저장 주소 자동 설정" },
  { value: "dhcp", label: "DHCP" },
];

const HostNics = ({ hostId }) => {
  const { data: host } = useHost(hostId);
  const { data: hostNics = [] } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));
  const { data: networkAttchments = [] } = useNetworkAttachmentsFromHost(hostId, (e) => ({ ...e }));
  const { data: networks = [] } = useNetworkFromCluster(host?.clusterVo?.id, (e) => ({ ...e }));  // 할당되지 않은 논리 네트워크 조회

  // nic 데이터 변환
  const transformedData = hostNics.map((e) => ({
    ...e,
    id: e?.id,
    name: e?.name,
    bondingVo: {
      activeSlave: {
        id: e?.bondingVo?.activeSlave?.id, 
        name: e?.bondingVo?.activeSlave?.name
      },
      slaves: e?.bondingVo?.slaves?.map((slave) => ({
        id: slave.id,
        name: slave.name,
      })),
    },
    bridged: e?.bridged,
    ipv4BootProtocol: e?.bootProtocol,
    ipv4Address: e?.ip?.address,
    ipv4Gateway: e?.ip?.gateway,
    ipv4Netmask: e?.ip?.netmask,
    ipv6BootProtocol: e?.ipv6BootProtocol,
    ipv6Address: e?.ipv6?.address,
    ipv6Gateway: e?.ipv6?.gateway,
    ipv6Netmask: e?.ipv6?.netmask,
    macAddress: e?.macAddress,
    mtu: e?.mtu,
    status: e?.status,
    network: {
      id: e?.networkVo?.id, 
      name: e?.networkVo?.name
    },
    speed: checkZeroSizeToMbps(e?.speed),
    rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
    txSpeed: checkZeroSizeToMbps(e?.txSpeed),
    rxTotalSpeed: e?.rxTotalSpeed?.toLocaleString() || "0",
    txTotalSpeed: e?.txTotalSpeed?.toLocaleString() || "0",
    pkts: `${e?.rxTotalError} Pkts` || "1 Pkts",
  }));

  // transformedData 생성 후 아래 추가
  const expectHostNicData = transformedData.map(nic => {
    if (nic.bondingVo?.slaves?.length > 0) {
      const enrichedSlaves = nic.bondingVo.slaves.map((slave) => {
        const fullSlave = transformedData.find(item => item.id === slave.id);
        return {
          ...slave,
          ...fullSlave, // 기존 slave의 id, name을 유지하면서 상세 속성 덮어쓰기
        };
      });

      return {
        ...nic,
        bondingVo: {
          ...nic.bondingVo,
          slaves: enrichedSlaves,
        },
      };
    }
    return nic;
  });
  // 본딩 슬레이브에 있는 아이디값 출력
  const bondingSlaveIds = expectHostNicData.flatMap(nic => nic.bondingVo?.slaves?.map(slave => slave.id) || []);
  // 본딩 슬레이브에 있는 nic를 전체 nic목록에서 필터링
  const nicDisplayList = expectHostNicData.filter(nic => !bondingSlaveIds.includes(nic.id));

  // 네트워크 결합 데이터 변환
  const transNAData = networkAttchments.map((e) => ({
    id: e?.id,
    inSync: e?.inSync,
    ipAddressAssignments: e?.ipAddressAssignments?.map((ip) => ({
      assignmentMethod: ip?.assignmentMethod,
      ipVo: {
        address: ip?.ipVo?.address,
        gateway: ip?.ipVo?.gateway,
        netmask: ip?.ipVo?.netmask,
        version: ip?.ipVo?.version
      }
    })),
    hostVo: {
      id: e?.hostVo?.id,
      name: e?.hostVo?.name
    },
    hostNicVo: {
      id: e?.hostNicVo?.id,
      name: e?.hostNicVo?.name
    },
    networkVo: {
      id: e?.networkVo?.id,
      name: e?.networkVo?.name
    },
    nameServerList: e?.nameServerList || []
  }));  

  // 호스트가 가지고 있는 전체 네트워크 데이터 변환
  const transNetworkData = networks.map((e) => ({
    id: e?.id,
    name: e?.name,
    status: e?.status,
    vlan: e?.vlan,
    usageVm: e?.usage?.vm, 
  }));
  
  // 결합되지 못한 네트워크 데이터 필터링
  const transUnNetworkData = transNetworkData.filter(
    (net) => !(transNAData.map((na) => na.networkVo?.id)).includes(net.id)
  );

  // nic 툴팁
  const generateNicTooltipHTML = (nic) => {
    return `
      <div style="text-align: left;">
        <strong>MAC:</strong> ${nic.macAddress || "없음"}<br/>
        <strong>Rx 속도:</strong> ${nic.rxSpeed || "0"} Mbps<br/>
        <strong>총 Rx:</strong> ${nic.rxTotalSpeed || "0"} 바이트<br/>
        <strong>Tx 속도:</strong> ${nic.txSpeed || "0"} Mbps<br/>
        <strong>총 Tx:</strong> ${nic.txTotalSpeed || "0"} 바이트<br/>
        <strong>${nic.speed || "0"}Mbps / ${nic.pkts || "0 Pkts"}<br/>
      </div>
    `;
  };  


  // network 툴팁
  const generateNetworkTooltipHTML = (network) => {
    const ipv4 = network?.ipAddressAssignments?.find(ip => ip?.ipVo?.version === "V4")?.ipVo || {};
    const ipv6 = network?.ipAddressAssignments?.find(ip => ip?.ipVo?.version === "V6")?.ipVo || {};
    const ipv4AssignmentMethod = network?.ipAddressAssignments?.find(ip => ip?.ipVo?.version === "V4")?.assignmentMethod || "없음";
    const ipv6AssignmentMethod = network?.ipAddressAssignments?.find(ip => ip?.ipVo?.version === "V6")?.assignmentMethod || "없음";
    const ipv4Method =
      assignmentMethods.find((method) => method.value === ipv4AssignmentMethod)?.label || ipv4AssignmentMethod?.value;
    const ipv6Method =
      assignmentMethods.find((method) => method.value === ipv6AssignmentMethod)?.label || ipv6AssignmentMethod?.value;

    const ipv4Section = ipv4?.gateway
    ? `
      <strong>IPv4:</strong><br/>
      <strong>부트 프로토콜: </strong>${ipv4Method}<br/>
      <strong>주소: </strong>${ipv4.address || "없음"}<br/>
      <strong>서브넷: </strong>${ipv4.netmask || "없음"}<br/>
      <strong>게이트웨이: </strong>${ipv4.gateway}<br/><br/>
    `: `
      <strong>IPv4:</strong><br/>
      <strong>부트 프로토콜: </strong>${ipv4Method}<br/>
    `;

    // IPv6은 그대로 출력
    const ipv6Section = ipv6?.gateway
    ? `
      <strong>IPv6:</strong><br/>
      <strong>부트 프로토콜: </strong>${ipv6Method}<br/>
      <strong>주소: </strong>${ipv6.address || "없음"}<br/>
      <strong>서브넷: </strong>${ipv6.netmask || "없음"}<br/>
      <strong>게이트웨이: </strong>${ipv6.gateway || "없음"}<br/>
    `: `
      <strong>IPv6:</strong><br/>
      <strong>부트 프로토콜: </strong>${ipv6Method}<br/>
    `;

  return `
    <div style="text-align: left;">
      ${ipv4Section}
      ${ipv6Section}
    </div>
  `;
  };

  const [selectedNic, setSelectedNic] = useState(null);
  const [selectedSlave, setSelectedSlave] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const [isBondingPopupOpen, setIsBondingPopupOpen] = useState(false);
  const [isNetworkEditPopupOpen, setIsNetworkEditPopupOpen] = useState(false);


  const dragItem = useRef(); // 드래그할 아이템의 인덱스

  // 드래그 시작할 때 선택된 아이템과 출처 저장.
  // const dragStart = (e, item, source, parentId = null) => { dragItem.current = { item, source, parentId } };
  
  return (
    <>
    <div className="header-right-btns">
        <ActionButton actionType="default" label={Localization.kr.CREATE} 
          // onClick={() => openModal("create")}
        />
      </div>

      <div className="py-3 font-bold underline"></div>
      <div className="host-network-separation f-btw">
        <div className="network-separation-left">
          <div className="f-btw">
            <div>인터페이스</div>
            <div>할당된 논리 네트워크</div>
          </div>

          <div className="single-container-wrapper">
            {nicDisplayList.map((nic) => {
              const matchedNA = transNAData.find(
                (na) => na.networkVo?.id && na.networkVo.id === nic.network?.id
              );
            
              return (
                <div key={nic.id} className="f-btw items-center mb-2">
                  <div className="w-[39%]">
                    {nic.bondingVo?.slaves?.length > 0 ? (
                      <div 
                        className="container flex-col p-2 rounded"                      
                        data-tooltip-id={`nic-tooltip-${nic.id}`}
                        data-tooltip-html={generateNicTooltipHTML(nic)}
                      >
                        <div className="cursor-default select-none">
                          <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
                          {nic.name}
                          <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
                          <RVI36 iconDef={rvi36Edit} className="icon cursor-pointer"
                            onClick={() => {
                              setSelectedNic(nic);
                              setIsBondingPopupOpen(true); 
                            }}
                          />
                     </div>                   
                        <div className="ml-4 mt-1 text-sm">
                          {nic.bondingVo.slaves.map((slave) => {
                            return (
                              <div
                                key={slave.id}
                                className={`container block mb-1 px-2 py-1 rounded transition`}
                                draggable
                                data-tooltip-id={`nic-tooltip-${slave.id}`}
                                data-tooltip-html={generateNicTooltipHTML(slave)}
                                onClick={() => {
                                  setSelectedSlave(slave);
                                  setSelectedNic(null);  // nic는 초기화
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
                                  {slave.name}
                                  <Tooltip id={`nic-tooltip-${slave.id}`} place="top" effect="solid" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="container"
                        draggable
                        data-tooltip-id={`nic-tooltip-${nic.id}`}
                        data-tooltip-html={generateNicTooltipHTML(nic)}
                        onClick={() => {
                          setSelectedNic(nic);      // NIC 클릭 시 선택
                          setSelectedSlave(null);   // slave 선택 초기화
                        }}
                      >
                        <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
                        {nic.name}
                        <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
                      </div>
                    )}
                  </div>

                  {/* 화살표 */}
                  {matchedNA && (
                    <div className="flex items-center justify-center">
                      <RVI24 iconDef={rvi24CompareArrows()} className="icon" />
                    </div>
                  )}

                  {matchedNA ? (
                    <div className="w-[41%]">
                      <div
                        className="container" 
                        draggable
                        data-tooltip-id={`network-tooltip-${matchedNA.networkVo.id}`}
                        data-tooltip-html={generateNetworkTooltipHTML(matchedNA)}
                        onClick={() => {
                          setSelectedNetwork(matchedNA);  // 중요: matchedNA 통째로 전달!
                        }}
                      >
                        <div className="left-section">
                          <RVI16 iconDef={matchedNA.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
                          {matchedNA.networkVo?.name || "이름 없음"}<br />
                          {`(VLAN ${matchedNA.networkVo?.id})`}
                          <Tooltip id={`network-tooltip-${matchedNA.networkVo?.id}`} place="top" effect="solid" />
                        </div>
                        <div className="right-section">
                          <RVI36 
                            iconDef={rvi36Edit} 
                            className="icon cursor-pointer" 
                            onClick={() => {
                              setSelectedNetwork(matchedNA); // 통째로 넘김
                              setIsNetworkEditPopupOpen(true); 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="container w-[41%] text-gray-400">할당된 네트워크 없음</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* <div className="mt-4 p-3 border-t border-gray-300 text-sm">
          <div><strong>선택된 NIC ID:</strong> <span>{selectedNic?.id || "없음"}</span></div>
          <div><strong>선택된 Slave ID:</strong> <span>{selectedSlave?.id || "없음"}</span></div>
          <div><strong>선택된 네트워크 ID:</strong> <span>{selectedNetwork?.id || "없음"}</span></div>
        </div> */}

        <div
          className="network-separation-right"
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="unassigned-network">
            <div>할당되지 않은 논리 네트워크</div>
          </div>
          {transUnNetworkData?.map((net) => (
            <div
              key={net.id}
              className="network-item"
              draggable
            >
              <div className="flex text-left">
                {status2Icon(net?.status)}&nbsp;&nbsp;{net?.name}<br />
                {net?.vlan === 0 ? "" : `(VLAN ${net?.vlan})`}
              </div>
              <RVI16 iconDef={rvi16VirtualMachine} className="icon" />
            </div>
          ))}
        </div>
      </div>

      <LabelCheckbox id="connection" label="호스트와 Engine간의 연결을 확인" 
        checked={true}
        // onChange={(e) => setFormat(e.target.checked)}
      />
      <LabelCheckbox id="networkSetting" label="네트워크 설정 저장" />

      <Suspense fallback={<Loading />}>
        <HostNetworkBondingModal
          isOpen={isBondingPopupOpen}
          // editmode={} // 전제조건 줘야함
          editmode
          hostId={hostId}
          nicId={selectedNic?.id}  // 선택된 NIC 전달
          onClose={() => setIsBondingPopupOpen(false)}
        />
        <HostNetworkEditModal
          isOpen={isNetworkEditPopupOpen}
          networkAttachment={selectedNetwork}
          onClose={() => setIsNetworkEditPopupOpen(false)}
        />
      </Suspense>

    </>
  );
}

export default HostNics;


// const HostNics = ({ hostId }) => {
//   const { data: host } = useHost(hostId);

//   const { data: hostNics = [] } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));
//   const { data: networks = [] } = useNetworkFromCluster(host?.clusterVo?.id, (e) => ({ ...e }));  // 할당되지 않은 논리 네트워크 조회

//   Logger.debug(`hostNics: ${JSON.stringify(hostNics, null, 2)}`);

//   const transformedData = hostNics.map((e) => ({
//     ...e,
//     id: e?.id,
//     name: e?.name,
//     bondingVo: {
//       activeSlave: {
//         id: e?.bondingVo?.activeSlave?.id, 
//         name: e?.bondingVo?.activeSlave?.name
//       },
//       slaves: e?.bondingVo?.slaves?.map((slave) => ({
//         id: slave.id,
//         name: slave.name,
//       })),
//     },
//     bridged: e?.bridged,
//     ipv4BootProtocol: e?.bootProtocol,
//     ipv4Address: e?.ip?.address,
//     ipv4Gateway: e?.ip?.gateway,
//     ipv4Netmask: e?.ip?.netmask,
//     ipv6BootProtocol: e?.ipv6BootProtocol,
//     ipv6Address: e?.ipv6?.address,
//     ipv6Gateway: e?.ipv6?.gateway,
//     ipv6Netmask: e?.ipv6?.netmask,
//     macAddress: e?.macAddress,
//     mtu: e?.mtu,
//     status: e?.status,
//     network: {id: e?.networkVo?.id, name: e?.networkVo?.name},
//     speed: checkZeroSizeToMbps(e?.speed),
//     rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
//     txSpeed: checkZeroSizeToMbps(e?.txSpeed),
//     rxTotalSpeed: e?.rxTotalSpeed?.toLocaleString() || "0",
//     txTotalSpeed: e?.txTotalSpeed?.toLocaleString() || "0",
//     pkts: `${e?.rxTotalError} Pkts` || "1 Pkts",
//   }));
  
//   const transNetworkData = networks.map((e) => ({
//     id: e?.id,
//     name: e?.name,
//     status: e?.status,
//     vlan: e?.vlan,
//     usageVm: e?.usage?.vm, 
//   }));

//   useEffect(() => {
//     Logger.debug(`NIC 데이터 확인 ... ${transformedData}`);
//   }, [transformedData]);

//   const [outer, setOuter] = useState([]);
  
//   const [selectedBonding, setSelectedBonding] = useState(null);
//   const [selectedNetwork, setSelectedNetwork] = useState(null);

//   const [contextMenu, setContextMenu] = useState(null);
//   const [isBondingPopupOpen, setIsBondingPopupOpen] = useState(false);
//   const [isNetworkEditPopupOpen, setIsNetworkEditPopupOpen] = useState(false);
  
//   const openBondingPopup = (bond) => {
//     setSelectedBonding(bond); 
//     setIsBondingPopupOpen(true);
//   }; 
  
//   const openNetworkEditPopup = (network) => {
//     setSelectedNetwork(network);
//     setIsNetworkEditPopupOpen(true);
//   };

//   useEffect(() => {
//     if (hostNics) {
//       setOuter(hostNics.map((nic) => ({
//         id: nic.id,
//         name: nic.bondingVo?.slaves?.length > 1 ? nic?.name : "",
//         children: nic.bondingVo?.slaves?.length > 0 ? nic.bondingVo.slaves : [{ id: nic.id, name: nic.name }],
//         networks: nic.networkVo?.id ? [{ id: nic.networkVo.id, name: nic.networkVo.name }] : [],
//       })));
//     }
//   }, [hostNics]);

//   const assignedNetworkIds = outer.flatMap((outerItem) =>outerItem.networks.map((net) => net.id));
//   const availableNetworks = networks?.filter((net) => !assignedNetworkIds.includes(net.id));
  
//   const dragItem = useRef(null);  

//   const dragStart = (e, item, source, parentId = null) => { dragItem.current = { item, source, parentId } };

//   const drop = (targetId, targetType) => {
//     if (!dragItem.current) return;
//     const { item, source, parentId } = dragItem.current;
  
//     if (source === "container" && targetType === "interface") {
//       if (parentId === targetId) {
//         alert("같은 Interface 내에서는 이동할 수 없습니다.");
//         dragItem.current = null;
//         return;
//       }
  
//       setOuter((prevOuter) => {
//         let validMove = true;
//         let bondRequired = false;
//         const updatedOuter = prevOuter.map((outerItem) => {
//           if (outerItem.id === parentId) {
//             if ( outerItem.networks.length > 0 && outerItem.children.length === 1 ) {
//               alert("Container를 이동할 수 없습니다. 연결된 네트워크가 있고 container가 하나뿐입니다.");
//               validMove = false;
//               return outerItem;
//             }
//             return {
//               ...outerItem,
//               children: outerItem.children.filter((child) => child.id !== item.id),
//             };
//           }
  
//           if (outerItem.id === targetId) {
//             const targetHasBond = outerItem.name.startsWith("bond");
//             const targetHasMultipleChildren = outerItem.children.length > 1;
//             const targetHasNetwork = outerItem.networks.length > 0;
          
//             const sourceOuter = prevOuter.find((oi) => oi.id === parentId);
//             const sourceHasNetwork = sourceOuter?.networks?.length > 0;
          
//             if (targetHasBond && targetHasMultipleChildren) {
//               return {
//                 ...outerItem,
//                 children: [...outerItem.children, item],
//               };
//             } else if (targetHasBond && !targetHasMultipleChildren && targetHasNetwork) {
//               alert("Container를 이동할 수 없습니다. 연결된 네트워크가 있고 container가 하나뿐입니다.");
//               validMove = false;
//               return outerItem;
//             } else {
//               if (sourceHasNetwork || targetHasNetwork) {
//                 bondRequired = true;
//               }
//             }
          
//             return {
//               ...outerItem,
//               children: [...outerItem.children, item],
//             };
//           }
          
          
//           return outerItem;
//         });
  
//         if (bondRequired) {
//           openBondingPopup("create"); 
//         }
  
//         return validMove ? updatedOuter : prevOuter;
//       });
//     } else if (source === "unassigned" && targetType === "networkOuter") {
//       setOuter((prevOuter) =>
//         prevOuter.map((outerItem) => {
//           if (outerItem.id === targetId) {
//             if (outerItem.networks.length > 0) {
//               alert("1개의 네트워크만 걸 수 있습니다.");
//               return outerItem;
//             }
//             return { ...outerItem, networks: [...outerItem.networks, item] };
//           }
//           return outerItem;
//         })
//       );
      
//     } else if (source === "networkOuter" && targetType === "unassigned") {
//       setOuter((prevOuter) => prevOuter.map((outerItem) => {
//         if (outerItem.id === parentId) {
//           return {
//             ...outerItem,
//             networks: outerItem.networks.filter((network) => network.id !== item.id),
//           };
//         }
//         return outerItem;
//       }).filter(
//         (outerItem) => outerItem.children.length > 0 || outerItem.networks.length > 0) 
//       );
      
//     } else if (source === "networkOuter" && targetType === "networkOuter") {
//       setOuter((prevOuter) => prevOuter.map((outerItem) => {
//         if (outerItem.id === parentId) {
//           return {
//             ...outerItem,
//             networks: outerItem.networks.filter( (network) => network.id !== item.id ),
//           };
//         }
//         if (outerItem.id === targetId) {
//           if (outerItem.networks.length > 0) {
//             alert("1개의 네트워크만 걸 수 있습니다.");
//             return outerItem;
//           }
//           return {
//             ...outerItem,
//             networks: [...outerItem.networks, item],
//           };
//         }
//       return outerItem;
//       }));
//     }
//     dragItem.current = null; 
//   };


//   return (
//     <>
//       <div className="py-3 font-bold underline"></div>
//       <div className="host-network-separation f-btw">
//         <div className="network-separation-left">
//           <div className ="f-btw">
//             <div>인터페이스</div>
//             <div>할당된 논리 네트워크</div>
//           </div>

//           {outer
//             .filter(outerItem => outerItem.children.length > 0 || outerItem.networks.length > 0)
//             .map((outerItem) => (
//               <div key={outerItem.id} className="separation-left-content">

//                 {outerItem.children.length === 1 ? (
//                   <div
//                     className="single-container-wrapper"
//                     style={{ width: "39%", margin: "0" }}
//                     onDragOver={(e) => e.preventDefault()}
//                     onDrop={() => drop(outerItem.id, "interface")}
//                   >
//                     <div 
//                       className="container" 
//                       draggable 
//                       onDragStart={(e) => dragStart(e, outerItem.children[0], "container", outerItem.id)}
//                     >
//                       <RVI16 iconDef={rvi16TriangleUp()} className="mr-1.5" />
//                       {outerItem.children[0].name}
//                     </div>
//                   </div>
//                 ) : (
//                   <div 
//                     className="interface" 
//                     onDragOver={(e) => e.preventDefault()} 
//                     onDrop={() => drop(outerItem.id, "interface")}
//                   > 
//                     {outerItem.name && (
//                       <div className="interface-header f-btw">
//                         {outerItem.name} 
//                         {outerItem.name.startsWith("bond") && (
//                           <RVI36 iconDef={rvi36Edit} className="icon" onClick={() => openBondingPopup("edit")} />
//                         )}
//                       </div>
//                     )}
//                     <div className="children">
//                       {outerItem.children.map((child) => (
//                         <div 
//                           key={child.id} 
//                           className="container" 
//                           draggable 
//                           onDragStart={(e) => dragStart(e, child, "container", outerItem.id)}
//                         >
//                           {status2Icon(child?.status)}
//                           <RVI16 iconDef={rvi16TriangleUp()} className="mr-1.5" />
//                           {child.name}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex items-center justify-center">
//                   <RVI24 iconDef={rvi24CompareArrows()} className="icon" />
//                 </div>

//                 {outerItem.networks.length === 0 ? (
//                   <div 
//                     className="outer-networks f-center" 
//                     style={{ width: "41%"}}
//                     onDragOver={(e) => e.preventDefault()} 
//                     onDrop={() => drop(outerItem.id, "networkOuter")}
//                   >
//                     <div className="assigned-network">
//                       <span>할당된 네트워크 없음</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="assigned-network-outer">
//                     <div 
//                       className="outer-networks" 
//                       onDragOver={(e) => e.preventDefault()} 
//                       onDrop={() => drop(outerItem.id, "networkOuter")}
//                     >
//                       {outerItem.networks.map(network => (
//                         <div 
//                           key={network.id} 
//                           className="center" 
//                           draggable 
//                           onDragStart={(e) => dragStart(e, network, "networkOuter", outerItem.id)}
//                         >
//                           <div className="left-section">
//                             {status2Icon(network?.status)}{network.name}
//                           </div>
//                           <div className="right-section">
//                             {network?.role && <FontAwesomeIcon icon={faDesktop} className="icon" />}
//                             <RVI36 iconDef={rvi36Edit} className="icon" onClick={() => openNetworkEditPopup(network)} />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//           ))}
//         </div>

//         <div
//           className="network-separation-right"
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={() => drop(null, "unassigned")}
//         >
//           <div className ="unassigned-network">
//             <div>할당되지 않은 논리 네트워크</div>
//           </div>
        
//           {availableNetworks?.map((net) => (
//             <div
//               key={net.id}
//               className="network-item"
//               draggable
//               onDragStart={(e) => dragStart(e, net, "unassigned")}
//             >
//               <div className="flex text-left">
//                 {status2Icon(net?.status)}{net?.name}<br/>
//                 {net?.vlan === 0 ? "":`(VLAN ${net?.vlan})` }
//               </div>
//               <RVI16 iconDef={rvi16VirtualMachine} className="icon" />
//             </div>
//           ))}
//         </div>
//       </div>
//       <LabelCheckbox
//         id="checkHostEngineConnectivity" 
//         label="호스트와 Engine간의 연결을 확인"
//       />
//       <LabelCheckbox 
//       id="saveNetworkConfiguration"
//       label="네트워크 설정 저장"
//       />
//       <Suspense fallback={<Loading/>}>
//         {isNetworkEditPopupOpen && selectedNetwork && (
//           <HostNetworkEditModal
//             isOpen={isNetworkEditPopupOpen}
//             onClose={() => setIsNetworkEditPopupOpen(false)}
//             network={selectedNetwork}
//           />
//         )}
//         {isBondingPopupOpen && selectedBonding && (
//           <HostNetworkBondingModal
//             isOpen={isBondingPopupOpen}
//             editmode
//             onClose={() => setIsBondingPopupOpen(false)}
//           />
//         )}
//       </Suspense>

//     </>
//   );
// }
// export default HostNics;
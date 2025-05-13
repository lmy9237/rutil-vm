import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { Tooltip } from "react-tooltip";
import { checkZeroSizeToMbps } from "../../../util";
import {
  RVI16,rvi16TriangleDown, rvi16TriangleUp,rvi16VirtualMachine, RVI24, rvi24CompareArrows, RVI36, rvi36Edit, status2Icon
} from "../../../components/icons/RutilVmIcons";
import Loading from "../../../components/common/Loading";
import HostNetworkEditModal from "../../../components/modal/host/HostNetworkEditModal";
import HostBondingModal from "../../../components/modal/host/HostBondingModal";
import LabelCheckbox from "../../../components/label/LabelCheckbox";
import ActionButton from "../../../components/button/ActionButton";
import {
  useHost,
  useNetworkAttachmentsFromHost,
  useNetworkFromCluster,
  useNetworkInterfacesFromHost,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import "./HostNic.css";
import toast from "react-hot-toast";

const HostNics2 = ({ hostId }) => {
  const { data: host } = useHost(hostId);
  const { data: hostNics = [] } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));
  const { data: networkAttchments = [] } = useNetworkAttachmentsFromHost(hostId, (e) => ({ ...e }));
  const { data: networks = [] } = useNetworkFromCluster(host?.clusterVo?.id, (e) => ({ ...e }));  // 할당되지 않은 논리 네트워크 조회

  const [connection, setConnection] = useState(false); // 호스트와 Engine간의 연결을 확인
  const [setting, setSetting] = useState(false); // 네트워크 설정 저장

  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedNic, setSelectedNic] = useState(null);
  const [selectedBond, setSelectedBond] = useState(null);

  // 모달 오픈 관리
  const [isBondingPopup, setIsBondingPopup] = useState(false);
  const [isNetworkEditPopup, setIsNetworkEditPopup] = useState(false);

  
  // 예시: 이름 기준 정렬
  const sortedHostNics = [...hostNics].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  const slaveNicIds = new Set(hostNics.flatMap(nic => nic?.bondingVo?.slaves?.map(slave => slave.id) || []));
  
  // 네트워크 인터페이스 목록
  const transNicData = sortedHostNics
    .filter(nic => !slaveNicIds.has(nic.id)) // slave에 있는 NIC는 제외
    .map((e) => {
    const bonding = e?.bondingVo;
    // const ip = e?.ip;
    // const ipV6 = e?.ipv6;

    return {
        ...e,
      id: e?.id,
      name: e?.name,
      macAddress: e?.macAddress,
      bondingVo: {
        activeSlave: {
          id: bonding.activeSlave?.id,
          name: bonding.activeSlave?.name
        },
        slaves: bonding.slaves?.map((slave) => ({
          id: slave.id,
          name: slave.name,
        })),
      },
      bridged: e?.bridged,
      ipv4BootProtocol: e?.bootProtocol,
      // ip4: {
      //   address: ip?.address,
      //   gateway: ip?.gateway,
      //   netmask: ip?.netmask,
      //   version: ip?.version
      // },
      // ipv6BootProtocol: e?.ipv6BootProtocol,
      // ip6: {
      //   address: ipV6?.address,
      //   gateway: ipV6?.gateway,
      //   netmask: ipV6?.netmask,
      //   version: ipV6?.version
      // },
      mtu: e?.mtu,
      status: e?.status,
      network: {
        id: e?.networkVo?.id,
        name: e?.networkVo?.name,
      },
      speed: checkZeroSizeToMbps(e?.speed),
      rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
      txSpeed: checkZeroSizeToMbps(e?.txSpeed),
      rxTotalSpeed: e?.rxTotalSpeed?.toLocaleString() || "0",
      txTotalSpeed: e?.txTotalSpeed?.toLocaleString() || "0",
      pkts: `${e?.rxTotalError} Pkts` || "1 Pkts",
    }
  });

  // 네트워크 결합 데이터 변환
  const transNAData = [...networkAttchments]?.map((e) => {
    const networkFromCluster = networks.find(net => net.id === e?.networkVo?.id);

    return {
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
        name: e?.networkVo?.name,
        status: networkFromCluster?.status || "UNKNOWN", // ⬅️ 이 줄 추가
        vlan: networkFromCluster?.vlan,
      },
      nameServerList: e?.nameServerList || []
    };
  });
  
  // 할당되지 않은 논리 네트워크
  // filter 할당되어 있는 네트워크는 할당되지 않는 논리 네트워크에서 제외하기 위해 필터링
  const transDetachNetworkData = networks
    .filter(net => !new Set(networkAttchments.map(na => na.networkVo?.id)).has(net.id))
    .map((e) => {
    
      return {
        id: e?.id,
        name: e?.name,
        status: e?.status || "NON_OPERATIONAL",
        vlan: e?.vlan,
        required: e?.required ? "필수" : "필수X",
        usageVm: e?.usage?.vm ? true : false
      };
    }
  );

  // 초기 데이터 정의
  const initialData = useMemo(() => ({
    nic: transNicData,
    networkAttachment: transNAData,
    network: transDetachNetworkData,
  }), [transNicData, transNAData, transDetachNetworkData]);

  const [baseItems, setBaseItems] = useState(initialData);
  const [movedItems, setMovedItems] = useState({
    nic: [],
    networkAttachment: [],
    network: [],
  });
  
  const [dragItemFlag, setDragItemFlag] = useState(false); // 변경항목 있는지 확인
  const [dragItem, setDragItem] = useState(null); // { item, type, list: 'attach', 'detach' }
  const [dragOverTarget, setDragOverTarget] = useState(null); // { type, targetList }

  
  // movedItems 하나라도 항목이 있으면 버튼 활성화
  useEffect(() => {
    const hasDrag = Object.values(movedItems).some(list => list.length > 0);
    setDragItemFlag(hasDrag);
  }, [movedItems]);


  // 드래그
  const handleDragStart = (e, item, type, list) => {
    setDragItem({ item, type, list });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetType, targetDestination) => {
    e.preventDefault();
    if (dragItem && dragItem.type === targetType) {
      e.dataTransfer.dropEffect = 'move';
      setDragOverTarget({ targetList: targetDestination, type: targetType });
    } else {
      e.dataTransfer.dropEffect = 'none';
      setDragOverTarget(null);
    }
  };


  const handleDragLeave = (e) => {
    // 커서가 drop zone을 떠났을 때 highlighting 제거
    // 자식 요소로 들어갈 때도 발생하므로 주의 필요. e.relatedTarget으로 체크 가능.
    // 간단하게는 onDragOver에서 null로 설정하는 것으로 대체 가능
    const currentTarget = e.currentTarget;
    if (e.relatedTarget && currentTarget.contains(e.relatedTarget)) {
        return; // 자식 요소로 이동한 경우는 무시
    }
    setDragOverTarget(null);
  };

  const handleDrop = (e, targetType, targetDestination, nicId = null, nicName = null) => {
    e.preventDefault();
    if (!dragItem) {
      setDragOverTarget(null);
      return;
    }

    const { item: draggedNetworkObject, type: draggedItemType, list: sourceList } = dragItem; // 'item' is the network object itself (or networkVo)

    if (draggedItemType !== targetType) {
      setDragItem(null);
      setDragOverTarget(null);
      return;
    }

    if (draggedItemType === "network") {
      // Case 1: Dragging from UNASSIGNED ("attach" list) to an ASSIGNED slot ("detach" area)
      if (sourceList === "attach" && targetDestination === "detach") {
        if (!nicId) {
          setDragItem(null);
          setDragOverTarget(null);
          return;
        }

        const existingNAList = [...baseItems.networkAttachment, ...movedItems.networkAttachment ].filter(na => na.hostNicVo?.id === nicId);
        const isVlanLess = (vlan) => vlan === undefined || vlan === 0;

        const draggedIsVlanLess = isVlanLess(draggedNetworkObject.vlan);
        const vlanLessAlreadyAttached = existingNAList.some(na => isVlanLess(na.networkVo?.vlan));

        // 조건 적용
        if (draggedIsVlanLess && vlanLessAlreadyAttached) {
          toast.error("이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.");
          setDragItem(null);
          setDragOverTarget(null);
          return;
        }

        // 정상적으로 새로운 attachment 생성
        const newAttachment = {
          id: `temp-na-${draggedNetworkObject.id}-${Date.now()}`,
          inSync: false,
          ipAddressAssignments: [],
          hostVo: {
            id: host?.id,
            name: host?.name,
          },
          hostNicVo: {
            id: nicId,
            name: nicName,
          },
          networkVo: {
            id: draggedNetworkObject.id,
            name: draggedNetworkObject.name,
            status: draggedNetworkObject.status || "UNKNOWN",
            vlan: draggedNetworkObject.vlan,
          },
          nameServerList: [],
        };

        // Remove the network from the source (unassigned list)
        // It could be in baseItems.network (original) or movedItems.network (if previously unassigned in this session)
        setBaseItems(prev => ({
          ...prev,
          network: prev.network.filter(n => n.id !== draggedNetworkObject.id),
        }));
        // Ensure it's also removed if it was in movedItems.network (e.g. unassigned then re-assigned without cancel)
        setMovedItems(prev => ({
          ...prev,
          network: prev.network.filter(n => n.id !== draggedNetworkObject.id),
          networkAttachment: [...prev.networkAttachment, newAttachment], // Add to moved (newly assigned)
        }));
      }
      else if (sourceList === "detach" && targetDestination === "detach") {
        // ✅ VLAN 중복 체크 추가 (sourceList === "detach" && targetDestination === "detach")
        const existingNAList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => na.hostNicVo?.id === nicId);
        const isVlanLess = (vlan) => vlan === undefined || vlan === 0;

        const draggedIsVlanLess = isVlanLess(draggedNetworkObject.vlan);
        const vlanLessAlreadyAttached = existingNAList.some(na => isVlanLess(na.networkVo?.vlan));

        // 조건 적용
        if (draggedIsVlanLess && vlanLessAlreadyAttached) {
          toast.error("이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.");
          setDragItem(null);
          setDragOverTarget(null);
          return;
        }

        if (!nicId) {
          setDragItem(null);
          setDragOverTarget(null);
          return;
        }

        // 현재 드래그 중인 네트워크가 어떤 NIC에 붙어있는지 확인
        const draggedNA = baseItems.networkAttachment.find(na => na.networkVo.id === draggedNetworkObject.id)
          ?? movedItems.networkAttachment.find(na => na.networkVo.id === draggedNetworkObject.id);

        if (!draggedNA) {
          setDragItem(null);
          setDragOverTarget(null);
          return;
        }

        // 드래그한 네트워크의 대상 NIC를 새롭게 설정
        const updatedNA = {
          ...draggedNA,
          hostNicVo: {
            id: nicId,
            name: nicName
          }
        };

        // 기존 항목 제거하고 새롭게 업데이트
        setBaseItems(prev => ({
          ...prev,
          networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetworkObject.id),
        }));
        setMovedItems(prev => ({
          ...prev,
          networkAttachment: [
            ...prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetworkObject.id),
            updatedNA,
          ]
        }));
      } 
      else if (sourceList === "detach" && targetDestination === "attach") {
        const detachedNA = baseItems.networkAttachment.find(na => na.networkVo.id === draggedNetworkObject.id)
          ?? movedItems.networkAttachment.find(na => na.networkVo.id === draggedNetworkObject.id);

        if (!detachedNA) {
          setDragItem(null);
          setDragOverTarget(null);
          return;
        }

        // 원래 클러스터 정보에서 원본 네트워크 정보를 복원
        const originalNetworkData = networks.find(net => net.id === draggedNetworkObject.id) || {};

        const restoredNetwork = {
          id: draggedNetworkObject.id,
          name: draggedNetworkObject.name,
          status: originalNetworkData?.status || "NON_OPERATIONAL",
          vlan: originalNetworkData?.vlan,
          required: originalNetworkData?.required ? "필수" : "필수X",
          usageVm: originalNetworkData?.usage?.vm ? true : false, // ✅ usage 정보 복구
        };

        // baseItems에서 제거
        setBaseItems(prev => ({
          ...prev,
          networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetworkObject.id),
        }));

        // movedItems에서 제거하고 network에 추가
        setMovedItems(prev => ({
          ...prev,
          networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetworkObject.id),
          network: [...prev.network, restoredNetwork],
        }));
      }
    }
    else if (draggedItemType === "nic" && targetDestination === "bond") {
      if (!nicId) return;

      const draggedNic = dragItem.item;
      const targetNic = baseItems.nic.find(n => n.id === nicId);
      const sourceNic = baseItems.nic.find(n => n.id === draggedNic.id);

      if (!targetNic || !sourceNic || sourceNic.id === targetNic.id) {
        setDragItem(null);
        setDragOverTarget(null);
        return;
      }

      // 두 NIC 모두 본딩이 아닌 상태인지 확인
      const isAlreadyBonded = (nic) => nic.name.startsWith("bond") || (nic.bondingVo?.slaves?.length > 0);
      if (isAlreadyBonded(sourceNic) || isAlreadyBonded(targetNic)) {
        toast.error("이미 본딩된 NIC는 다시 본딩할 수 없습니다.");
        setDragItem(null);
        setDragOverTarget(null);
        return;
      }

      // 새로운 bond 이름 생성
      const bondName = `bond${Date.now().toString().slice(-4)}`;

      // bondNic 구성
      const newBondNic = {
        id: bondName,
        name: bondName,
        macAddress: null,
        bondingVo: {
          activeSlave: null,
          slaves: [
            { id: targetNic.id, name: targetNic.name },
            { id: sourceNic.id, name: sourceNic.name },
          ]
        },
        bridged: false,
        ipv4BootProtocol: null,
        mtu: null,
        status: "UNKNOWN",
        network: null,
        speed: null,
        rxSpeed: null,
        txSpeed: null,
        rxTotalSpeed: "0",
        txTotalSpeed: "0",
        pkts: "0 Pkts"
      };

      setBaseItems(prev => ({
        ...prev,
        nic: prev.nic
          .filter(n => n.id !== targetNic.id && n.id !== sourceNic.id)
          .concat(newBondNic),
      }));

      setMovedItems(prev => ({
        ...prev,
        nic: [...prev.nic, newBondNic],
      }));

      setDragItem(null);
      setDragOverTarget(null);
    }

    setDragItem(null);
    setDragOverTarget(null);
  };

  
  // 본딩된 nic (nic 2개 이상: bonding)
  const bondNic = (nic) => {
    
    return (
      <div 
        className="interface-outer container flex-col p-2" 
        data-tooltip-id={`nic-tooltip-${nic.id}`} 
        data-tooltip-html={generateNicTooltipHTML(nic)}
      >
        <div className="interface-content">
          <div className="f-start">{nic.name}</div>
          <RVI36 className="icon cursor-pointer" iconDef={rvi36Edit()} 
            onClick={() => {
              // setSelectedNic(nic);
              // setIsEditMode(true);
              setIsBondingPopup(true);
            }} 
          />
        </div>
        <div 
          className="w-full interface-container-outer2" 
          onDragOver={(e) => e.preventDefault()} 
        >
          {nic.bondingVo?.slaves.map((slave) => (
            <div
              key={slave.id}
              className="interface-container container"
              data-tooltip-id={`nic-tooltip-${slave.id}`}
              data-tooltip-html={generateNicTooltipHTML(slave)}
              draggable
              // onClick={() => {
              //   setSelectedSlave(slave);
              //   setSelectedNic(null);
              // }}
              // onDragStart={(e) => dragStart(e, slave, "nic", nic.id)}
            >
              <div className="flex gap-1">
                <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-0.5" />
                {slave.name}
              </div>
            </div>
          ))}
          </div>
        </div>
    );
  };

  const basdNic = (nic) => {
    
    return (
      <div className="interface-container container"
        key={nic.id}
        data-tooltip-id={`nic-tooltip-${nic.id}`}
        data-tooltip-html={generateNicTooltipHTML(nic)}
        draggable
        onDragStart={(e) => handleDragStart(e, nic, "nic", "nic")}
        onDragOver={(e) => handleDragOver(e, "nic", "bond")}
        onDrop={(e) => handleDrop(e, "nic", "bond", nic.id, nic.name)}
        // onClick={() => {
        //   setSelectedNic(nic);
        //   setSelectedSlave(null);
        // }}
      >
        <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
        {nic.name}
        <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
      </div>
    );
  }

  const matchNetwork = (networkAttach, nicId, nicName) => {

    return (
      <div className="assigned-network-outer">
        <div className="assigned-network-content fs-14"
          data-tooltip-id={`network-tooltip-${networkAttach?.networkVo?.id}`}
          data-tooltip-html={generateNetworkTooltipHTML(networkAttach)}
          draggable
          onDragStart={(e) => handleDragStart(e, networkAttach.networkVo, "network", "detach")}
          onDrop={(e) => handleDrop(e, "network", "detach", nicId, nicName)}
          onDragOver={(e) => handleDragOver(e, "network", "detach")}
        >
          <div className="f-start">
            <RVI16 className="mr-1.5"
              iconDef={networkAttach.networkVo?.status === "OPERATIONAL" ? rvi16TriangleUp() : rvi16TriangleDown()}
            />
            {networkAttach.networkVo?.name || "이름 없음"}
            {networkAttach.networkVo?.vlan === 0 
              ? "" 
              : <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {networkAttach.networkVo.vlan})</span>
            }
          </div>
          <div className="right-section">
            <RVI36 
              iconDef={rvi36Edit()} 
              className="icon cursor-pointer" 
              onClick={() => {
                setSelectedNetwork(networkAttach);
                setIsNetworkEditPopup(true);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // 할당된 네트워크가 없을때
  const noneNetwork = (nicId, nicName) => {
    return (
      <div
        className="assigned-network-outer"
        onDragOver={(e) => handleDragOver(e, "network", "detach")}
        onDrop={(e) => {
          e.preventDefault();
          handleDrop(e, "network", "detach", nicId, nicName);
        }}
      >
        <div className="assigned-network-content fs-14">
          <span className="text-gray-400">할당된 네트워크가 없음</span>
        </div>
      </div>
    );
  };

  const clusterNetworkList = (net) => {

    return (
      <div
        className="network-item f-btw"
        draggable
        onDragStart={(e) => handleDragStart(e, net, "network", "attach")}
      >
        <div className="f-start text-left">
           <RVI16 className="mr-1.5"
              iconDef={net?.status === "OPERATIONAL" ? rvi16TriangleUp() : rvi16TriangleDown()}
            />
            [{net?.required}] {net?.name}
            {net?.vlan === 0 
              ? "" 
              : <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {net.vlan})</span>
            }
        </div>
        {net?.usageVm === true &&
          <RVI16 iconDef={rvi16VirtualMachine()} className="icon" />
        }
      </div>
    )
  }

  
  return (
    <>
    <div className="w-[70%]">
      <div className="header-right-btns">
        {/* 변경항목이 있다면 활성화 */}
        {dragItemFlag && (
          <>
            <ActionButton actionType="default" label={Localization.kr.UPDATE} />
            <ActionButton actionType="default" label={Localization.kr.CANCEL}
              onClick={() => {
                setBaseItems(initialData);              // baseItems 원상복구
                setMovedItems({                         // movedItems 초기화
                  nic: [],
                  networkAttachment: [],
                  network: [],
                });
                setDragItem(null);                      // 드래그 중이던 항목 초기화
                setDragItemFlag(false);                 // 변경 여부 플래그 초기화
                setDragOverTarget(null);                // 드롭 대상 초기화
              }}
            />

          </>
        )}
      </div>
        
      <div className="f-btw w-full" style={{ padding: "inherit", position: "relative" }}>
        <div className="split-layout-group flex w-full">

          {/* 작업 탭 */}
          <div className="split-item-two-thirds">
            <div className="row group-span mb-4 items-center">
              <div className="col-40 fs-18">인터페이스</div>
              <div className="col-20"></div>
              <div className="col-40 fs-18">할당된 논리 네트워크</div>
            </div>
            <br/>

          {transNicData.map((nic) => {
            // 네트워크에 네트워크 인터페이스 id와 같다면 연결
            const matchedNAs = baseItems.networkAttachment.filter((na) => na.hostNicVo?.id === nic.id)
              .concat(movedItems.networkAttachment.filter((na) => na.hostNicVo?.id === nic.id));

            return (
              <div className="row group-span mb-4 items-center" key={nic.id} >
                
                {/* 인터페이스 */}
                {(nic.bondingVo?.slaves?.length > 0 || !nic.name.startsWith('bond')) && (
                  <div 
                    className="col-40 fs-18"
                    onDragOver={(e) => e.preventDefault()} 
                  >
                    {nic.bondingVo?.slaves?.length > 0 ? (
                      bondNic(nic)
                    ) : (
                      basdNic(nic)
                    )}
                  </div>
                )}


                {/* 화살표 */}
                {matchedNAs.length > 0 && (
                  <div className="col-20 flex justify-center items-center">
                    <RVI24 iconDef={rvi24CompareArrows()} className="icon" />
                  </div>
                )}

                {/* 할당된 논리 네트워크 */}
                <div className="network-stack">
                  {matchedNAs.length > 0 ? (
                    matchedNAs.map((na) => (
                      <React.Fragment key={na.networkVo.id}>
                        {matchNetwork(na, nic.id, nic.name)}
                      </React.Fragment>
                    ))
                  ) : (
                    noneNetwork(nic.id, nic.name)
                  )}
                </div>
              </div>
            );
          })}
          </div>

          {/* 할당되지않은 네트워크 */}
          <div
            className="split-item-one-third detachNetworkArea"
            onDragOver={(e) => handleDragOver(e, "network", "attach")}
            onDragLeave={(e) => handleDragLeave(e)}
            onDrop={(e) => handleDrop(e, "network", "attach")}
          >

            <div className="unassigned-network text-center mb-4">
              <span className="fs-18">할당되지 않은 논리 네트워크</span>
            </div>
            <br/>
           {[...baseItems.network, ...movedItems.network].map((net) => 
              clusterNetworkList(net))
            }
          </div>
        </div>
      </div>
      <LabelCheckbox id="connection" label={`${Localization.kr.HOST}와 Engine간의 연결을 확인`}
        value={connection}
        onChange={(e) => setConnection(e.target.checked)}
      />
      <LabelCheckbox id="networkSetting" label={`${Localization.kr.NETWORK} 설정 저장`}
        value={setting}
        onChange={(e) => setSetting(e.target.checked)}
      />

      <Suspense fallback={<Loading />}>
        <HostBondingModal
          // editmode={isEditMode} 
          isOpen={isBondingPopup}
          onClose={() => setIsBondingPopup(false)}
          hostId={hostId}
          // nicId={selectedNic?.id}  // 선택된 NIC 전달
        />
        <HostNetworkEditModal
          isOpen={isNetworkEditPopup}
          networkAttachment={selectedNetwork}
          onClose={() => {
            setIsNetworkEditPopup(false);
            setSelectedNetwork(null);
          }}
        />
      </Suspense>
    </div>
    </>
  );
}

export default HostNics2;


const assignmentMethods = [
  { value: "none", label: "없음" },
  { value: "static", label: "정적" },
  { value: "poly_dhcp_autoconf", label: "DHCP 및 상태 비저장 주소 자동 설정" },
  { value: "autoconf", label: "상태 비저장 주소 자동 설정" },
  { value: "dhcp", label: "DHCP" },
];


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
  const ipv4Method = assignmentMethods.find((method) => method.value === ipv4AssignmentMethod)?.label || ipv4AssignmentMethod?.value;
  const ipv6Method = assignmentMethods.find((method) => method.value === ipv6AssignmentMethod)?.label || ipv6AssignmentMethod?.value;

  const ipv4Section = ipv4?.gateway
    ? `
      <strong>IPv4:</strong><br/>
      <strong>부트 프로토콜: </strong>${ipv4Method}<br/>
      <strong>주소: </strong>${ipv4.address || "없음"}<br/>
      <strong>서브넷: </strong>${ipv4.netmask || "없음"}<br/>
      <strong>게이트웨이: </strong>${ipv4.gateway}<br/><br/>`
    : `
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
      <strong>게이트웨이: </strong>${ipv6.gateway || "없음"}<br/>`
    : `
      <strong>IPv6:</strong><br/>
      <strong>부트 프로토콜: </strong>${ipv6Method}<br/>
    `;

  return `
    <div style="text-align: left;">
      ${ipv4Section}
      ${ipv6Section}
    </div>`;
};



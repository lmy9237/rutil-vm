import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { checkZeroSizeToMbps } from "../../../util";
import {
  RVI16,
  rvi16TriangleDown,
  rvi16TriangleUp,
  RVI24,
  rvi24CompareArrows,
  RVI36,
  rvi36Edit,
} from "../../../components/icons/RutilVmIcons";
import Loading from "../../../components/common/Loading";
import HostNetworkEditModal from "../../../components/modal/host/HostNetworkEditModal";
import HostNetworkBondingModal from "../../../components/modal/host/HostNetworkBondingModal";
import LabelCheckbox from "../../../components/label/LabelCheckbox";
import ActionButton from "../../../components/button/ActionButton";
import {
  useHost,
  useNetworkAttachmentsFromHost,
  useNetworkFromCluster,
  useNetworkInterfacesFromHost,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import "./Host.css";
import Logger from "../../../utils/Logger";
import InterfaceContainer from "./hostNics/InterfaceContainer";
import AssignedNetworkItem from "./hostNics/AssignedNetworkItem";
import UnassignedNetworkItem from "./hostNics/UnassignedNetworkItem";

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

  const [isMoved, setIsMoved] = useState(false);
  const [tempNics, setTempNics] = useState([]);
  const [selectedNic, setSelectedNic] = useState(null);
  const [selectedSlave, setSelectedSlave] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [connection, setConnection] = useState(true);
  const [setting, setSetting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBondingPopupOpen, setIsBondingPopupOpen] = useState(false);
  const [isNetworkEditPopupOpen, setIsNetworkEditPopupOpen] = useState(false);
  
  // 드레그
  const [detachedNetworks, setDetachedNetworks] = useState([]);
  const dragItem = useRef(null);
  const dragStart = (e, item, source, parentId = null) => {
    dragItem.current = { item, source, parentId };
  };
  const [tempAttachments, setTempAttachments] = useState([]);
  
  
  const drop = (targetId, targetType) => {
    if (!dragItem.current) return;
    const { item, source, parentId } = dragItem.current;
   
    // NIC 간 슬레이브 드래그는 생략 (이미 잘 처리 중)
    if (source === "nic" && targetType === "bonding-group") {
      setNics((prevNics) => {
        
        // 복사
        const newNics = JSON.parse(JSON.stringify(prevNics));
        const sourceBonding = newNics.find(nic => nic.bondingVo?.slaves?.some(slave => slave.id === item.id));
        const targetBonding = newNics.find(nic => nic.id === targetId);
    
        if (!sourceBonding || !targetBonding) {
          console.warn("💥 이동 실패: 본딩 그룹 못 찾음");
          return prevNics;
        }
    
        // 원래 본딩에서 제거
        sourceBonding.bondingVo.slaves = sourceBonding.bondingVo.slaves.filter(slave => slave.id !== item.id);
    
        // 새로운 본딩에 추가
        targetBonding.bondingVo.slaves = [...(targetBonding.bondingVo.slaves || []), item];
    
        return newNics;
      });
      setIsMoved(true); 
      dragItem.current = null;
      return;
    }
    if (source === "network" && targetType === "unassigned") {
      Logger.debug("💥 네트워크 할당 해제", item, "from", parentId);
  
      // 💥 detachedNetworks에 추가
      setDetachedNetworks((prev) => Array.from(new Set([...prev, item.id])));
      // 💥 tempAttachments에서도 제거
      setTempAttachments((prev) => prev.filter((na) => na.networkVo.id !== item.id));
  
      dragItem.current = null;
      return;
    }
    if (source === "network" && targetType === "empty") {
      // 1. 기존 네트워크 해제
      setDetachedNetworks((prev) => Array.from(new Set([...prev, item.id])));
    
      // 2. tempAttachments에 새로 연결 추가
      const targetNic = nicDisplayList.find((nic) => nic.id === targetId);
      if (targetNic) {
        const newNA = {
          id: `temp-${item.id}-${targetNic.id}`,
          inSync: true,
          ipAddressAssignments: [],
          hostVo: { id: host?.id, name: host?.name },
          hostNicVo: { id: targetNic.id, name: targetNic.name },
          networkVo: { id: item.id, name: item.name },
          nameServerList: [],
        };
    
        setTempAttachments((prev) => [
          ...prev.filter((na) => na.networkVo.id !== item.id),  // 기존 연결 제거
          newNA,
        ]);
      }
    
      dragItem.current = null;
      return;
    }
    if (source === "unassigned" && targetType === "nic") {
      Logger.debug("💥 NIC에 네트워크 붙이기", item, "to", targetId);
    
      const targetNic = nicDisplayList.find((nic) => nic.id === targetId);
      if (!targetNic) {
        dragItem.current = null;
        return;
      }
    
      const newNA = {
        id: `temp-${item.id}-${targetNic.id}`,
        inSync: true,
        ipAddressAssignments: [],
        hostVo: { id: host?.id, name: host?.name },
        hostNicVo: { id: targetNic.id, name: targetNic.name },
        networkVo: { id: item.id, name: item.name },
        nameServerList: [],
      };
    
      // 💥 1. 기존에 연결되어 있던 networkAttachment 찾기
      const existingNA = filteredNAData.find((na) => na.networkVo.id === item.id);
      if (existingNA) {
        // 기존 연결이 있으면 -> 💥 detachedNetworks에 추가해서 숨기기
        setDetachedNetworks((prev) => Array.from(new Set([...prev, existingNA.networkVo.id])));
      }
    
      // 💥 2. tempAttachments에 새로운 연결 추가
      setTempAttachments((prev) => [
        ...prev.filter((na) => na.networkVo.id !== item.id),
        newNA,
      ]);
    
      
      // 💥 3. (안 해도 되지만) detachedNetworks에서 중복 제거 확실히
      setDetachedNetworks((prev) => prev.filter((id, idx, self) => self.indexOf(id) === idx));
    
      dragItem.current = null;
      return;
    }
    if (source === "unassigned" && targetType === "empty") {
      Logger.debug("💥 할당되지 않은 네트워크를 빈 NIC에 붙임 (초기 연결)", item);
    
      const targetNic = nicDisplayList.find((nic) => nic.id === targetId);
      if (!targetNic) {
        dragItem.current = null;
        return;
      }
    
      const newNA = {
        id: `temp-${item.id}-${targetNic.id}`,
        inSync: true,
        ipAddressAssignments: [],
        hostVo: { id: host?.id, name: host?.name },
        hostNicVo: { id: targetNic.id, name: targetNic.name },
        networkVo: { id: item.id, name: item.name },
        nameServerList: [],
      };
    
      setTempAttachments((prev) => [
        ...prev.filter((na) => na.networkVo.id !== item.id),
        newNA,
      ]);
    
      dragItem.current = null;
      return;
    }
    if (source === "container" && targetType === "nic") {
      const sourceNic = nicDisplayList.find((nic) => nic.id === item.id);
      const targetNic = nics.find((nic) => nic.id === targetId); // nicDisplayList❌ → nics⭕ 고침
      
      if (!sourceNic || !targetNic) {
        dragItem.current = null;
        return;
      }

      const sourceHasNetwork = [...filteredNAData, ...tempAttachments].some(
        (na) => na.hostNicVo?.id === sourceNic.id
      );

      const targetIsBonding = targetNic?.bondingVo?.slaves?.length > 0;
      const targetNicIds = targetIsBonding
        ? targetNic.bondingVo.slaves.map(slave => slave.id)
        : [targetNic.id];

      const targetHasNetwork = [...filteredNAData, ...tempAttachments].some(
        (na) => targetNicIds.includes(na.hostNicVo?.id)
      );

      if (sourceHasNetwork && targetHasNetwork) {
        alert("하나의 인터페이스에 둘 이상의 비-VLAN 네트워크를 사용할 수 없습니다.");
        dragItem.current = null;
        return;
      }

      // ⬇️ 여기부터 정상 모달 띄우기 등 네 흐름
      setSelectedNic(targetNic);
      setIsEditMode(false);
      setSelectedSlave(sourceNic);
      setIsBondingPopupOpen(true);

      dragItem.current = null;
      return;
    }

    if (source === "nic" && targetType === "nic") {
      const sourceSlave = nics.flatMap(nic => nic.bondingVo?.slaves || []).find(slave => slave.id === item.id);
      const sourceBonding = nics.find(nic => nic.bondingVo?.slaves?.some(slave => slave.id === item.id));
      const targetNic = nicDisplayList.find(nic => nic.id === targetId);
    
      if (!sourceSlave || !targetNic) {
        dragItem.current = null;
        return;
      }
    
      // 슬레이브가 하나만 남은 본딩 그룹에서 나가는 경우
      if (sourceBonding && sourceBonding.bondingVo.slaves.length === 1) {
        // 여기서 슬레이브 단독 NIC 취급
        const sourceHasNetwork = [...filteredNAData, ...tempAttachments].some(na => na.hostNicVo?.id === sourceSlave.id);
        const targetHasNetwork = [...filteredNAData, ...tempAttachments].some(na => na.hostNicVo?.id === targetNic.id);
    
        if (sourceHasNetwork && targetHasNetwork) {
          alert("하나의 인터페이스에 둘 이상의 비-VLAN 네트워크를 사용할 수 없습니다.");
          dragItem.current = null;
          return;
        }
    
        // 모달 열기
        setSelectedNic(targetNic);
        setSelectedSlave(sourceSlave);
        setIsEditMode(false);
        setIsBondingPopupOpen(true);
    
        // 원래 bonding NIC에서 슬레이브 제거
        setNics((prevNics) => {
          const newNics = JSON.parse(JSON.stringify(prevNics));
          const bonding = newNics.find(nic => nic.id === sourceBonding.id);
          if (bonding) {
            bonding.bondingVo.slaves = [];
          }
          return newNics;
        });
    
        dragItem.current = null;
        return;
      }
    
      // 나머지 경우 (본딩 그룹 → 본딩 그룹 이동)
      const isTargetBonding = targetNic.bondingVo?.slaves?.length > 0;
      if (!isTargetBonding) {
        alert("하나의 인터페이스에 둘 이상의 비-VLAN 네트워크를 사용할 수 없습니다.");
        dragItem.current = null;
        return;
      }
    
      // 정상 bonding 그룹 이동
      setNics((prevNics) => {
        const newNics = JSON.parse(JSON.stringify(prevNics));
        const sourceBonding = newNics.find(nic => nic.bondingVo?.slaves?.some(slave => slave.id === item.id));
        const targetBonding = newNics.find(nic => nic.id === targetId);
    
        if (!sourceBonding || !targetBonding) return prevNics;
    
        sourceBonding.bondingVo.slaves = sourceBonding.bondingVo.slaves.filter(slave => slave.id !== item.id);
        targetBonding.bondingVo.slaves = [...(targetBonding.bondingVo.slaves || []), item];
    
        return newNics;
      });
      setIsMoved(true);
      dragItem.current = null;
    }
    dragItem.current = null;
  };



  useEffect(() => {
    if (isMoved) {
       return; // 드래그 이동했으면, 리프레시로 덮어쓰지 말기
    }
    const transformedData = [...hostNics]?.map((e) => ({
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
        name: e?.networkVo?.name,
      },
      speed: checkZeroSizeToMbps(e?.speed),
      rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
      txSpeed: checkZeroSizeToMbps(e?.txSpeed),
      rxTotalSpeed: e?.rxTotalSpeed?.toLocaleString() || "0",
      txTotalSpeed: e?.txTotalSpeed?.toLocaleString() || "0",
      pkts: `${e?.rxTotalError} Pkts` || "1 Pkts",
    }));

    const expectHostNicData = [...transformedData]?.map((nic) => {
      if (nic.bondingVo?.slaves?.length > 0) {
        const enrichedSlaves = [...nic?.bondingVo?.slaves]?.map((slave) => {
          const fullSlave = transformedData.find(item => item.id === slave.id);
          return {
            ...slave,
            ...fullSlave,
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

    setNics(expectHostNicData);  
    setTempNics(expectHostNicData);   
  }, [hostNics]);

  // 본딩 슬레이브에 있는 아이디값 출력
  const [nics, setNics] = useState([]);
  const bondingSlaveIds = nics.flatMap(nic => nic.bondingVo?.slaves?.map(slave => slave.id) || []);
  const nicDisplayList = nics.filter(nic => !bondingSlaveIds.includes(nic.id));


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
  const filteredNAData = transNAData.filter(
    na => !detachedNetworks.includes(na.networkVo.id)
  );
  // 호스트가 가지고 있는 전체 네트워크 데이터 변환
  const transNetworkData = networks.map((e) => ({
    id: e?.id,
    name: e?.name,
    status: e?.status,
    vlan: e?.vlan,
    usageVm: e?.usage?.vm, 
  }));
  
  // 결합되지 못한 네트워크 데이터 필터링
  const transUnNetworkData = useMemo(() => {
    const allAttachedNetworkIds = [...filteredNAData, ...tempAttachments].map((na) => na.networkVo?.id);
    return transNetworkData.filter(net => !allAttachedNetworkIds.includes(net.id));
  }, [filteredNAData, tempAttachments, transNetworkData]);

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

  return (
    <>
    <div className="header-right-btns">
        <ActionButton actionType="default" label={Localization.kr.CREATE} />
      </div>

      <div className="py-3 font-bold underline">색깔 임시로 넣어놓았습니다.</div>
      
      <div className="host-network-separation f-btw" style={{ position: "relative" }}>
        <div className="flex separations">
          <div className="network-separation-left">
            <div className="f-btw mb-2">
              <div className="fs-18">인터페이스</div>
              <div>할당된 논리 네트워크</div>
            </div>

            <div className="single-container-wrapper">
              {nicDisplayList.map((nic) => {
                const matchedNA = [...filteredNAData, ...tempAttachments].find(
                  (na) => na.hostNicVo?.id === nic.id
                );
              
                return (
                  <div key={nic.id} className="nic-outer f-btw fs-14 mb-2">
                    {(nic.bondingVo?.slaves?.length > 0 || !nic.name.startsWith('bond')) && (
             <div className="interface-content-outer" onDragOver={(e) => e.preventDefault()} onDrop={() => drop(nic.id, "nic")}>

             {nic.bondingVo?.slaves?.length > 1 ? (
               // 💠 2개 이상: bonding UI
               <div className="interface-outer container flex-col p-2 rounded" data-tooltip-id={`nic-tooltip-${nic.id}`} data-tooltip-html={generateNicTooltipHTML(nic)}>
                 <div className="interface-content">
                   <div className="f-start">
                     <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
                     {nic.name}
                   </div>
                   <RVI36 iconDef={rvi36Edit()} className="icon cursor-pointer" onClick={() => {
                     setSelectedNic(nic);
                     setIsEditMode(true);
                     setIsBondingPopupOpen(true);
                   }} />
                 </div>
                 <div className="w-full interface-container-outer" onDragOver={(e) => e.preventDefault()} onDrop={() => drop(nic.id, "bonding-group")}>
                   {nic.bondingVo.slaves.map((slave) => (
                     <div
                       key={slave.id}
                       className="interface-container container"
                       draggable
                       data-tooltip-id={`nic-tooltip-${slave.id}`}
                       data-tooltip-html={generateNicTooltipHTML(slave)}
                       onClick={() => {
                         setSelectedSlave(slave);
                         setSelectedNic(null);
                       }}
                       onDragStart={(e) => dragStart(e, slave, "nic", nic.id)}
                     >
                       <div className="flex gap-1">
                         <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-0.5" />
                         {slave.name}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             ) : nic.bondingVo?.slaves?.length === 1 ? (
               // 💠 슬레이브 1개만: 일반 NIC UI처럼
               <div
                 className="interface-container container"
                 draggable
                 data-tooltip-id={`nic-tooltip-${nic.bondingVo.slaves[0].id}`}
                 data-tooltip-html={generateNicTooltipHTML(nic.bondingVo.slaves[0])}
                 onClick={() => {
                   setSelectedNic(nic.bondingVo.slaves[0]);
                   setSelectedSlave(null);
                 }}
                 onDragStart={(e) => dragStart(e, nic.bondingVo.slaves[0], "container")}
               >
                 <div className="flex gap-1">
                   <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-0.5" />
                   {nic.bondingVo.slaves[0].name}
                 </div>
               </div>
             ) : (
               // 💠 본딩 아님: 일반 NIC
               <InterfaceContainer
                 nic={nic}
                 onClick={() => {
                   setSelectedNic(nic);
                   setSelectedSlave(null);
                 }}
                 onDragStart={(e) => dragStart(e, nic, "container")}
                 tooltipHTML={generateNicTooltipHTML(nic)}
               />
             )}
           </div>
           
)}

                    {/* 화살표 */}
                    <div className="flex items-center justify-center">
                      <RVI24 iconDef={rvi24CompareArrows()} className="icon" />
                    </div>
                 

                    {matchedNA ? (
                      <AssignedNetworkItem
                        matchedNA={matchedNA}
                        onClick={() => setSelectedNetwork(matchedNA)}
                        onEdit={() => {
                          setSelectedNetwork(matchedNA);
                          setIsEditMode(true);
                          setIsNetworkEditPopupOpen(true);
                        }}
                        onDragStart={(e) => dragStart(e, matchedNA.networkVo, "network", matchedNA.hostNicVo?.id)}
                        tooltipHTML={generateNetworkTooltipHTML(matchedNA)}
                      />
                    ) : (
                      <div className="empty-network-content container w-[41%] text-gray-400"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); 
                        drop(nic.id, "empty");
                      }}
                    >
                        할당된 네트워크 없음
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/*할당되지않은 네트워크 */}
          <div
            className="network-separation-right"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(null, "unassigned")}
          >
            <div className="unassigned-network">
              <span className="fs-18">할당되지 않은 논리 네트워크</span>
            </div>
            {[...transUnNetworkData]?.map((net) => (
              <UnassignedNetworkItem
                key={net.id}
                network={net}
                onDragStart={(e) => dragStart(e, net, "unassigned")}
              />
            ))}
          </div>
        </div>
      </div>

      <LabelCheckbox id="connection" label="호스트와 Engine간의 연결을 확인" 
        value={connection}
        onChange={(e) => setConnection(e.target.checked)}
      />
      <LabelCheckbox id="networkSetting" label="네트워크 설정 저장" 
        value={setting}
        onChange={(e) => setSetting(e.target.checked)}
      />

      <Suspense fallback={<Loading />}>
        <HostNetworkBondingModal
          isOpen={isBondingPopupOpen}
          editmode={isEditMode} 
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

//   const [contextMenu, setContextMenu] = useContextMenu(null);
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
//               <div key={outerItem.id} className="separation-left-content f-btw">

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
//                       <div className="interface-header f-btw fs-18">
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
//               className="network-item f-btw"
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
import React, { useState, useEffect, Suspense, useMemo } from "react";
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
  useSetupNetworksFromHost,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import "./HostNic.css";
import toast from "react-hot-toast";
import Logger from "../../../utils/Logger";

const hostNetworkVo = {
  // bonding 관련
  bonds: [
    { id: "bond0", name: "bond0", bondingVo: { /* ... */ } },
  ],
  bondsToRemove: [
    // 삭제할 본딩(HostNicVo) - id만 있으면 됨
    { id: "bond1" },
  ],

  // 네트워크 어태치먼트 관련
  networkAttachments: [
    {
      id: "na-uuid-1",
      networkVo: { id: "network-id" },
      hostNicVo: { name: "nic0" },
      ipAddressAssignments: [],
    },
  ],
  networkAttachmentsToRemove: [
    // 삭제할 네트워크 어태치먼트(NetworkAttachmentVo) - id만 있으면 됨
    { id: "na-uuid-2" },
  ],
};

const HostNics = ({ hostId }) => {
  const { data: host } = useHost(hostId);
  const { data: hostNics = [] } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));
  const { data: networkAttchments = [] } = useNetworkAttachmentsFromHost(hostId, (e) => ({ ...e }));
  const { data: networks = [] } = useNetworkFromCluster(host?.clusterVo?.id, (e) => ({ ...e }));  // 할당되지 않은 논리 네트워크 조회
  const { mutate: setupNetwork } = useSetupNetworksFromHost()


  const [modifiedBonds, setModifiedBonds] = useState([]); // 생성/수정 본딩
  const [removeBonds, setRemoveBonds] = useState([]); // 삭제 본딩
  const [modifiedNas, setModifiedNas] = useState([]); // 연결 네트워크
  const [removeNas, setRemoveNas] = useState([]); // 삭제 네트워크
  
  // checkbox
  const [connection, setConnection] = useState(false); // 호스트와 Engine간의 연결을 확인
  const [setting, setSetting] = useState(false); // 네트워크 설정 저장

  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedNic, setSelectedNic] = useState(null);
  const [selectedBond, setSelectedBond] = useState(null);

  // 모달 오픈 관리
  const [isBondingPopup, setIsBondingPopup] = useState(false);
  const [editBondingMode, setEditBondingMode] = useState(false); // 본딩 편집모드
  const [isNetworkEditPopup, setIsNetworkEditPopup] = useState(false);

  // hostNics를 id로 빠르게 찾을 수 있는 Map으로 변환
  const nicMap = useMemo(() => {
    return hostNics.reduce((map, nic) => {
      map[nic.id] = nic;
      return map;
    }, {});
  }, [hostNics]);

  // 예시: 이름 기준 정렬
  const sortedHostNics = [...hostNics]?.sort((a, b) => { return a.name.localeCompare(b.name) });

  // 네트워크 인터페이스 목록
  const transNicData = sortedHostNics
    .filter(nic => {
      const isSlave = hostNics.some(parent => parent.bondingVo?.slaves?.some(slave => slave.id === nic.id));
      return !isSlave;
    })
    .map((e) => {

      return {
          ...e,
        id: e?.id,
        name: e?.name,
        macAddress: e?.macAddress,
        status: e?.status,
        mtu: e?.mtu,
        bondingVo: {
          activeSlave: {
            id: e?.bondingVo.activeSlave?.id,
            name: e?.bondingVo.activeSlave?.name
          },
          slaves: e?.bondingVo.slaves?.map((slave) => ({
            id: slave.id,
            name: slave.name,
            status: nicMap[slave.id]?.status 
          })),
        },
        bridged: e?.bridged,
        ipv4BootProtocol: e?.bootProtocol,
        ip4: {
          address: e?.ip?.address,
          gateway: e?.ip?.gateway,
          netmask: e?.ip?.netmask,
          version: e?.ip?.version
        },
        ipv6BootProtocol: e?.ipv6BootProtocol,
        ip6: {
          address: e?.ipv6?.address,
          gateway: e?.ipv6?.gateway,
          netmask: e?.ipv6?.netmask,
          version: e?.ipv6?.version
        },
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

  // 할당된 네트워크
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
        status: networkFromCluster?.status || "UNKNOWN", // networks 에서 값 가져오기
        vlan: networkFromCluster?.vlan, // networks 에서 값 가져오기
      },
      nameServerList: e?.nameServerList || []
    };
  });
  
  // 할당되지 않은 논리 네트워크
  // filter 할당되어 있는 네트워크는 할당되지 않는 논리 네트워크에서 제외하기 위해 필터링
  const transDetachNetworkData = [...networks]
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

  // 초기 데이터
  const initialData = useMemo(() => ({
    nic: transNicData,
    networkAttachment: transNAData,
    network: transDetachNetworkData,
  }), [transNicData, transNAData, transDetachNetworkData]);

  // 초기에 받아온 데이터
  const [baseItems, setBaseItems] = useState(initialData);
  // 변경된 데이터
  const [movedItems, setMovedItems] = useState({
    nic: [],
    networkAttachment: [],
    network: [],
  });

  // 초기 오픈시에만 값 설정
  useEffect(() => {
    setBaseItems({
      nic: transNicData,
      networkAttachment: transNAData,
      network: transDetachNetworkData,
    });
    setMovedItems({
      nic: [],
      networkAttachment: [],
      network: [],
    });
    setDragItem(null);
    setDragItemFlag(false);
    setDragOverTarget(null);
  }, [hostId, hostNics, networkAttchments, networks]);
  

  // 변경항목 있는지 확인
  const [dragItemFlag, setDragItemFlag] = useState(false);
  // 드래그 되는 항목 { item, type, list('attach', 'detach') }
  const [dragItem, setDragItem] = useState(null); 
  // 드래그 되는 대상 { targetType, targetDestination }
  const [dragOverTarget, setDragOverTarget] = useState(null);

  // movedItems 하나라도 항목이 있으면 버튼 활성화
  useEffect(() => {
    const hasDrag = Object.values(movedItems).some(list => list.length > 0);
    setDragItemFlag(hasDrag);
  }, [movedItems]);


  const validateForm = () => {
    // if (!networkVo.id) return `${Localization.kr.NETWORK}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const bonds = [];
    const bondsToRemove = [];
    const networkAttachments = [];
    const networkAttachmentsToRemove = [];

    const hostNetworkVo = {
      bonds,
      bondsToRemove,
      networkAttachments,
      networkAttachmentsToRemove
    };

    Logger.debug(`Form Data: ${JSON.stringify(hostNetworkVo, null, 2)}`);

    setupNetwork({
      hostId: hostId,
      hostNetwork: hostNetworkVo,
    });
  };


  // 항목 드래그 시작 시 호출, 어떤 항목을 드래그하는지 상태(dragItem)에 저장
  // item: 드래그 중인 요소, type: 항목 유형, lis: 출발지 유형('attach', 'detach')
  const handleDragStart = (e, item, type, list, parentBond = null) => {
    setDragItem({ item, type, list, parentBond }); // parentBond: slave의 경우만 전달
    e.dataTransfer.effectAllowed = 'move';
  };

  // 드래그 중인 항목이 특정 위치 위를 지나갈 때 호출. 이때, 드롭 가능한지 체크
  const handleDragOver = (e, targetType, targetDestination) => {
    e.preventDefault();
    // 드래그 대상과 드래그 타입이 같아면 이동가능
    if (dragItem && dragItem.type === targetType) {
      e.dataTransfer.dropEffect = 'move';
      setDragOverTarget({ targetType, targetDestination });
    } else { // 아닐 경우 불가능
      e.dataTransfer.dropEffect = 'none';
      setDragOverTarget(null);
    }
  };

  // 할당되지 않은 네트워크 → NIC에 할당
  const handleDropUnassignedNetworkToAssigned = (draggedNetworkObject, nicId, nicName) => {
    const existingNAList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => na.hostNicVo?.id === nicId);
    const isVlanLess = (vlan) => vlan === undefined || vlan === 0;

    if (isVlanLess(draggedNetworkObject.vlan) && existingNAList.some(na => isVlanLess(na.networkVo?.vlan))) {
      toast.error("이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.");
      return;
    }

    const newAttachment = {
      id: `temp-na-${draggedNetworkObject.id}-${Date.now()}`,
      inSync: false,
      ipAddressAssignments: [],
      hostVo: { id: host?.id, name: host?.name },
      hostNicVo: { id: nicId, name: nicName },
      networkVo: {
        id: draggedNetworkObject.id,
        name: draggedNetworkObject.name,
        status: draggedNetworkObject.status || "UNKNOWN",
        vlan: draggedNetworkObject.vlan,
      },
      nameServerList: [],
    };

    setBaseItems(prev => ({
      ...prev,
      network: prev.network.filter(n => n.id !== draggedNetworkObject.id),
    }));

    setMovedItems(prev => ({
      ...prev,
      network: prev.network.filter(n => n.id !== draggedNetworkObject.id),
      networkAttachment: [...prev.networkAttachment, newAttachment],
    }));
  };

  // NIC 간 할당된 네트워크 이동
  const handleDropNetworkBetweenNICs = (draggedNetworkObject, nicId, nicName) => {
    const existingNAList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => na.hostNicVo?.id === nicId);
    const isVlanLess = (vlan) => vlan === undefined || vlan === 0;

    if (isVlanLess(draggedNetworkObject.vlan) && existingNAList.some(na => isVlanLess(na.networkVo?.vlan))) {
      toast.error("이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.");
      return;
    }

    const draggedNA = baseItems.networkAttachment.find(na => na.networkVo.id === draggedNetworkObject.id)
      ?? movedItems.networkAttachment.find(na => na.networkVo.id === draggedNetworkObject.id);

    if (!draggedNA) return;

    const updatedNA = {
      ...draggedNA,
      hostNicVo: { id: nicId, name: nicName },
    };

    setBaseItems(prev => ({
      ...prev,
      networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetworkObject.id),
    }));

    setMovedItems(prev => ({
      ...prev,
      networkAttachment: [
        ...prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetworkObject.id),
        updatedNA,
      ],
    }));
  };

  // 할당된 네트워크를 해제 (할당되지 않은 상태로 이동)
  const handleDropAssignedNetworkToUnassigned = (draggedNetworkObject) => {
    const detachedNA = baseItems.networkAttachment.find(na => na.networkVo.id === draggedNetworkObject.id)
      ?? movedItems.networkAttachment.find(na => na.networkVo.id === draggedNetworkObject.id);

    if (!detachedNA) return;

    const originalNetworkData = networks.find(net => net.id === draggedNetworkObject.id) || {};

    const restoredNetwork = {
      id: draggedNetworkObject.id,
      name: draggedNetworkObject.name,
      status: originalNetworkData?.status || "NON_OPERATIONAL",
      vlan: originalNetworkData?.vlan,
      required: originalNetworkData?.required ? "필수" : "필수X",
      usageVm: originalNetworkData?.usage?.vm || false,
    };

    setBaseItems(prev => ({
      ...prev,
      networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetworkObject.id),
    }));

    setMovedItems(prev => ({
      ...prev,
      networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetworkObject.id),
      network: [...prev.network, restoredNetwork],
    }));
  };

  // NIC 본딩을 위한 드롭 처리
  // 본딩 생성 시 (baseNic를 다른 baseNic로 드래그)
  const handleDropNicForBonding = (draggedNic, targetNicId) => {
    const sourceNic = baseItems.nic.find(n => n.id === draggedNic.id);
    const targetNic = baseItems.nic.find(n => n.id === targetNicId);


    if (!targetNic || !sourceNic || sourceNic.id === targetNic.id) {
      toast.error("유효하지 않은 본딩 대상입니다.");
      return;
    }

    const isAlreadyBonded = nic => nic.name.startsWith("bond") || (nic.bondingVo?.slaves?.length > 0);
    if (isAlreadyBonded(sourceNic) || isAlreadyBonded(targetNic)) {
      toast.error("이미 본딩된 NIC는 다시 본딩할 수 없습니다.");
      return;
    }

    // VLAN 없는 네트워크 검사
    const findNoVlanNetwork = (nicId) => {
      const naList = [...baseItems.networkAttachment, ...movedItems.networkAttachment]
        .filter(na => na.hostNicVo?.id === nicId);
      return naList.some(na => !na.networkVo?.vlan || na.networkVo.vlan === 0);
    };

    const sourceHasNoVlan = findNoVlanNetwork(sourceNic.id);
    const targetHasNoVlan = findNoVlanNetwork(targetNic.id);

    if (sourceHasNoVlan && targetHasNoVlan) {
      toast.error("하나의 인터페이스에 둘 이상의 비 VLAN 네트워크를 사용할 수 없습니다.");
      return;
    }

    // 해당 nic가 가지고 있는 네트워크 아이디 가져오기
    const getAttachedNetworkIds = (nicId) => {
      return [...baseItems.networkAttachment, ...movedItems.networkAttachment]
        .filter(na => na.hostNicVo?.id === nicId)
        .map(na => na.networkVo?.id);
    };
    const sourceNetworkIds = getAttachedNetworkIds(sourceNic.id);
    const targetNetworkIds = getAttachedNetworkIds(targetNic.id);

    // setSelectedBond({ nic1: sourceNic, nic2: targetNic });
    setSelectedBond({
      nic1: sourceNic,
      nic2: targetNic,
      nic1NetworkIds: sourceNetworkIds,
      nic2NetworkIds: targetNetworkIds,
    });
    setEditBondingMode(false);
    setIsBondingPopup(true);
  };


  // 드래그 중인 항목을 특정 위치에 놓았을 때 호출. 실제로 항목을 옮기는 로직을 수행
  //  항목을 놓으면 현재 드래그 항목(dragItem)과 놓는 위치(dragOverTarget)를 기준으로 상태를 업데이트
  //  기존 배열에서 항목을 제거하고 대상 배열로 이동
  const handleDrop = (e, targetDestination, nicId = null, nicName = null) => {
    e.preventDefault();
    if (!dragItem) return;

    const { item, type, list, parentBond } = dragItem;

    if (type === "nic") {
      if (list === "slave" && targetDestination === "bond") {
        // "본딩 해제" - slave NIC를 baseNic로 이동시키기
        handleUnbondSlaveNic(item, parentBond, nicId, nicName);
      } else if (list === "nic" && targetDestination === "bond") {
        // 기존 baseNic → baseNic으로 본딩
        handleDropNicForBonding(item, nicId);
      }
    }

    if (type === "network") {
      if (list === "attach" && targetDestination === "detach") {
        handleDropUnassignedNetworkToAssigned(item, nicId, nicName);
      } else if (list === "detach" && targetDestination === "detach") {
        handleDropNetworkBetweenNICs(item, nicId, nicName);
      } else if (list === "detach" && targetDestination === "attach") {
        handleDropAssignedNetworkToUnassigned(item);
      }
    }

    if (type === "nic" && targetDestination === "bond") {
      handleDropNicForBonding(item, nicId);
    }

    setDragItem(null);
    setDragOverTarget(null);
  };

// 1. 본딩 해제 함수 (slaves 전체 분리)
// const handleUnbondSlaveNic = (slaveNic, parentBond) => {
//   setModifiedBonds(prevBonds =>
//     prevBonds.filter(bond => bond.name !== parentBond.name) // 본딩 자체 삭제
//   );

//   // bond의 모든 slave를 baseNic으로 만듦
//   const allSlaves = parentBond.bondingVo.slaves || [];
//   setBaseItems(prev => {
//     // 이미 존재하는 NIC id 중복 방지
//     const existingIds = new Set(prev.nic.map(n => n.id));
//     const newNics = allSlaves
//       .filter(s => !existingIds.has(s.id))
//       .map(s => ({
//         id: s.id,
//         name: s.name,
//         status: s.status,
//         macAddress: s.macAddress,
//         bondingVo: { activeSlave: null, slaves: [] }
//       }));
//     return {
//       ...prev,
//       nic: [...prev.nic, ...newNics]
//     };
//   });

//   toast.success("본딩 해제되어 각각의 NIC로 분리되었습니다.");
// };

const handleUnbondSlaveNic = (slaveNic, parentBond) => {
  // 1. 본딩 삭제
  setModifiedBonds(prev =>
    prev.filter(bond => bond.name !== parentBond.name)
  );
  // 2. 모든 슬레이브를 baseNic으로 추가
  const allSlaves = parentBond.bondingVo.slaves || [];
  setBaseItems(prev => {
    // 중복 방지
    const existIds = new Set(prev.nic.map(n => n.id));
    const newBaseNics = allSlaves
      .filter(s => !existIds.has(s.id))
      .map(s => ({
        id: s.id,
        name: s.name,
        status: s.status,
        macAddress: s.macAddress,
        bondingVo: { activeSlave: null, slaves: [] }
      }));
    return {
      ...prev,
      nic: [...prev.nic, ...newBaseNics]
    };
  });
  toast.success("본딩 해제되어 각각의 NIC로 분리되었습니다.");
};

  
  // 본딩된 nic (nic 2개 이상: bonding)
  const bondNic = (nic) => {
    
    return (
      <div className="interface-outer container flex-col p-2" 
        data-tooltip-id={`nic-tooltip-${nic.id}`} 
        // data-tooltip-html={generateNicTooltipHTML(nic)}
      >
        <div className="interface-content">
          {/* <div className="f-start">{nic.name}/ {nic.id}</div> */}
          {/* 
          <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-0.5" />
          */}
          <div className="f-start">{nic.name}</div> 
          <RVI36 className="icon cursor-pointer" iconDef={rvi36Edit()} 
            onClick={() => {
              setSelectedNic(nic);
              setEditBondingMode(true);
              setIsBondingPopup(true);
            }} 
          />
        </div>
        <div className="w-full interface-container-outer2" 
          onDragOver={(e) => e.preventDefault()} 
        >
          {nic.bondingVo?.slaves.map((slave) => (
            <div className="interface-container container"
              key={slave.id}              
              data-tooltip-id={`nic-tooltip-${slave.id}`}
              data-tooltip-html={generateNicTooltipHTML(slave)}
              draggable
              onDragStart={e =>
                handleDragStart(e, slave, "nic", "slave", nic) // nic = parentBond
              }
            >
              <div className="flex gap-1">
                <RVI16 iconDef={slave.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-0.5" />
                {slave.name}/ {slave.id}
                {/* {slave.name} */}
              </div>
            </div>
          ))}
          </div>
        </div>
    );
  };


  const baseNic = (nic) => {

    return (
      <div className="interface-container container"
        key={nic.id}
        data-tooltip-id={`nic-tooltip-${nic.id}`}
        data-tooltip-html={generateNicTooltipHTML(nic)}
        draggable
        onDragStart={(e) => handleDragStart(e, nic, "nic", "nic")}
        onDrop={(e) => { handleDrop(e, "bond", nic.id, nic.name)}}
        onDragOver={(e) => handleDragOver(e, "nic", "bond")}
        // onDragOver={(e) => handleDragOver(e, "nic", "bond")}
        // onDrop={(e) => handleDrop(e, "bond", nic.id, nic.name)}
      >
        <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
        {nic.name}/ {nic.id}
        {/* {nic.name} */}
        <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
      </div>
    );
  };


  const matchNetwork = (networkAttach, nicId, nicName) => {

    return (
      <div className="assigned-network-outer">
        <div className="assigned-network-content fs-14"
          data-tooltip-id={`network-tooltip-${networkAttach?.networkVo?.id}`}
          data-tooltip-html={generateNetworkTooltipHTML(networkAttach)}
          draggable
          onDragStart={(e) => handleDragStart(e, networkAttach.networkVo, "network", "detach")}
          onDrop={(e) => handleDrop(e, "detach", nicId, nicName)}
          // onDrop={(e) => handleDrop(e, "network", "detach", nicId, nicName)}
          onDragOver={(e) => handleDragOver(e, "network", "detach")}
        >
          <div className="f-start">
            <RVI16 className="mr-1.5"
              iconDef={networkAttach.networkVo?.status === "OPERATIONAL" ? rvi16TriangleUp() : rvi16TriangleDown()}
            />
            {networkAttach.networkVo?.name} / {networkAttach.networkVo?.id}
            {networkAttach.networkVo?.vlan === 0 ? "" : <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {networkAttach.networkVo.vlan})</span>}
          </div>
          <div className="right-section">
            <RVI36 className="icon cursor-pointer" 
              iconDef={rvi36Edit()}               
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
          // handleDrop(e, "network", "detach", nicId, nicName);
          handleDrop(e, "detach", nicId, nicName);
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
            {net?.vlan === 0 ? "" : <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {net.vlan})</span>}
        </div>
        {net?.usageVm === true &&
          <RVI16 iconDef={rvi16VirtualMachine()} className="icon" />
        }
      </div>
    )
  }

  
  return (
    <>
    <div className="w-[90%]">
      <div className="header-right-btns">
        {/* 변경항목이 있다면 활성화 */}
        {dragItemFlag && (
          <>
            <ActionButton actionType="default" label={Localization.kr.UPDATE} 
              // onClick={handleFormSubmit} // 버튼 클릭시 네트워크 업데이트

            />
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
          <div className="split-item-two-thirds"
            onDragOver={e => {
              if (dragItem && dragItem.type === "nic" && dragItem.list === "slave") {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }
            }}
            onDrop={e => {
              if (dragItem && dragItem.type === "nic" && dragItem.list === "slave") {
                handleUnbondSlaveNic(dragItem.item, dragItem.parentBond);
                setDragItem(null);
                setDragOverTarget(null);
              }
            }}
          >
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
            // const matchedNAs = displayedNetworkAttachments.filter(na => na.hostNicVo?.id === nic.id);

            return (
              <div className="row group-span mb-4 items-center" key={nic.id} >
                
                {/* 인터페이스 */}
                <div className="col-40 fs-18" 
                  onDragOver={(e) => e.preventDefault()}
                >
                  {nic.bondingVo?.slaves?.length > 0 
                    ? bondNic(nic) 
                    : baseNic(nic)
                  }
                </div>

                {/* 화살표 */}
                <div className="col-20 flex justify-center items-center">
                  {matchedNAs.length > 0 && (
                    <RVI24 iconDef={rvi24CompareArrows()} className="icon" />
                  )}
                </div>

                {/* 할당된 논리 네트워크 */}
                <div className="col-40 fs-18 network-stack">
                  {matchedNAs.length > 0 ? (
                    matchedNAs.map((na) => (
                      <React.Fragment key={`${nic.id}-${na.networkVo?.id}`}>
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
            onDrop={(e) => handleDrop(e, "attach")}
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

      <span>h {modifiedBonds.map((e) => e.name)}</span>

      <Suspense fallback={<Loading />}>
        <HostBondingModal
          editmode={editBondingMode}
          isOpen={isBondingPopup}
          onClose={() => {
            setIsBondingPopup(false);
            setEditBondingMode(false);
            setSelectedNic(null);
            setSelectedBond(null);
          }}
          nicIds={
            editBondingMode
              ? selectedNic ? [selectedNic.id] : []
              : selectedBond ? [selectedBond.nic1, selectedBond.nic2] : []
          }
          onBondingCreated={newBonding => {
            setModifiedBonds(prev => [...prev, newBonding]);
            toast.success("본딩이 추가되었습니다.");
          }}
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

export default HostNics;


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



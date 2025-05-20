import React, { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import { checkZeroSizeToMbps } from "../../../util";
import {
  RVI16, rvi16TriangleDown, rvi16TriangleUp, rvi16VirtualMachine,
  RVI24, rvi24CompareArrows,
  RVI36, rvi36Edit,
  status2Icon
} from "../../../components/icons/RutilVmIcons";
import useGlobal from "../../../hooks/useGlobal";
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

const idView = (data) => {
  return(<span style={{ marginLeft: "4px", color: "#888", fontSize: "6px"}}>{data.id}</span>);
};

const HostNics = ({ hostId }) => {
  const { hostsSelected } = useGlobal();

  const { data: host } = useHost(hostId);
  const { data: hostNics = [] } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));
  const { data: networkAttchments = [] } = useNetworkAttachmentsFromHost(hostId, (e) => ({ ...e }));
  const { data: networks = [] } = useNetworkFromCluster(host?.clusterVo?.id, (e) => ({ ...e }));  // 할당되지 않은 논리 네트워크 조회
  const { mutate: setupNetwork } = useSetupNetworksFromHost();

  // 모달 오픈 관리
  const [isBondingPopup, setIsBondingPopup] = useState(false);
  const [editBondingMode, setEditBondingMode] = useState(false); // 본딩 편집모드
  const [isNetworkEditPopup, setIsNetworkEditPopup] = useState(false);

  const [modifiedBonds, setModifiedBonds] = useState([]); // 생성/수정 본딩
  const [removeBonds, setRemoveBonds] = useState([]);     // 삭제 본딩
  const [modifiedNAs, setModifiedNAs] = useState([]);     // 연결 네트워크
  const [removeNAs, setRemoveNAs] = useState([]);         // 삭제 네트워크

  
  // checkbox
  const [connection, setConnection] = useState(false); // 호스트와 Engine간의 연결을 확인
  const [setting, setSetting] = useState(false); // 네트워크 설정 저장

  const [selectedNic, setSelectedNic] = useState(null);
  const [selectedBond, setSelectedBond] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  // hostNics를 id로 빠르게 찾을 수 있는 Map으로 변환
  const nicMap = useMemo(() => {
    return hostNics.reduce((map, nic) => {
      map[nic.id] = nic;
      return map;
    }, {});
  }, [hostNics]);

  const nullData = {
    nic: [],
    networkAttachment: [],
    network: [],
  };

  const [baseItems, setBaseItems] = useState({
    nic: [...hostNics], // 초기값은 hostNics 등 원본
    networkAttachment: [...networkAttchments],
    network: [...networks],
  });
  const [movedItems, setMovedItems] = useState(nullData);


  // 네트워크 인터페이스 목록
  const transNicData =  [...baseItems.nic]
    .sort((a, b) => { return a.name.localeCompare(b.name) }) //이름 기준 정렬
    .filter(nic => { 
      const isSlave = baseItems.nic.some(parent =>parent.bondingVo?.slaves?.some(slave => slave.id === nic.id));
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
  const transNAData = [...networkAttchments]
    .map((e) => {
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
  
  // const currentNAIds = [...baseItems.networkAttachment, ...movedItems.networkAttachment ].map(na => na.networkVo?.id);
  
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

  const [dragItemFlag, setDragItemFlag] = useState(false);   // 변경항목 있는지 확인
  const [dragItem, setDragItem] = useState(null);            // 드래그 되는 항목 { item, type, list('attach', 'detach'), parentBond }
  const [dragOverTarget, setDragOverTarget] = useState(null);// 드래그 되는 대상 { targetType, targetDestination }

  useEffect(() => {
  if (
    !dragItemFlag && // 편집중이 아닐 때만!
    hostNics.length > 0 &&
    networkAttchments.length >= 0 &&
    networks.length >= 0
  ) {
    setBaseItems({
      nic: [...hostNics],
      networkAttachment: transNAData,
      network: transDetachNetworkData,
    });
    setMovedItems(nullData);
    setDragItem(null);
    setDragItemFlag(false);
    setDragOverTarget(null);
    setModifiedBonds([]);
    setRemoveBonds([]);
    setModifiedNAs([]);
    setRemoveNAs([]);
  }
  // eslint-disable-next-line
}, [hostId, hostNics, networkAttchments, networks]);

  
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

    const hostNetworkVo = {
      bonds: modifiedBonds,
      bondsToRemove: removeBonds,
      networkAttachments: modifiedNAs,
      networkAttachmentsToRemove: removeNAs
    };

    Logger.debug(`hostSetup handleFormSubmit ... dataToSubmit: `, hostNetworkVo); // 데이터 출력

    setupNetwork({ hostId: hostId, hostNetworkVo: hostNetworkVo });
  };

  // 항목 드래그 시작 시 호출, 어떤 항목을 드래그하는지 상태(dragItem)에 저장
  // item: 드래그 중인 요소, type: 항목 유형, list: 출발지 유형('attach', 'detach')
  const handleDragStart = (e, item, type, list, parentBond = null) => {
    setDragItem({ item, type, list, parentBond }); // parentBond: slave의 경우만 전달
    e.dataTransfer.effectAllowed = 'move';
  };

  // 드래그 중인 항목이 특정 위치 위를 지나갈 때 호출. 이때, 드롭 가능한지 체크
  const handleDragOver = (e, targetType, targetDestination) => {
    e.preventDefault();
    if (dragItem && dragItem.type === targetType) { // 드래그 대상과 드래그 타입이 같아면 이동가능
      e.dataTransfer.dropEffect = 'move';
      setDragOverTarget({ targetType, targetDestination });
    } else { // 아닐 경우 불가능
      e.dataTransfer.dropEffect = 'none';
      setDragOverTarget(null);
    }
  };

  // 할당되지 않은 네트워크 → NIC에 할당
  const handleDropUnassignedNetworkToNic = (draggedNetwork, nicId, nicName) => {
    const existingNAList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => na.hostNicVo?.id === nicId);
    const isVlanLess = (vlan) => vlan === undefined || vlan === 0;

    if (isVlanLess(draggedNetwork.vlan) && existingNAList.some(na => isVlanLess(na.networkVo?.vlan))) {
      return toast.error("이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.");
    }

    const newAttachment = {
      // ipAddressAssignments: [],
      hostNicVo: { id: nicId, name: nicName },
      networkVo: {
        id: draggedNetwork.id,
        name: draggedNetwork.name,
        status: draggedNetwork.status || "UNKNOWN",
        vlan: draggedNetwork.vlan,
      },
    };

    // 기존 항목에서 드래그된 항목 표시 제거
    setBaseItems(prev => ({ ...prev, network: prev.network.filter(n => n.id !== draggedNetwork.id) })); 
    // 변경된 항목에 드래그된 항목 표시 추가
    setMovedItems(prev => ({
      ...prev,
      network: prev.network.filter(n => n.id !== draggedNetwork.id),
      networkAttachment: [...prev.networkAttachment, newAttachment], 
    }));

    // 변경될 네트워크 목록에 값 추가
    setModifiedNAs(prev => [...prev, newAttachment]);
  };


  // 할당된 네트워크 간 이동
  const handleDropBetweenNetworkToNic = (draggedNetwork, nicId, nicName) => {
    const existingNAList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => na.hostNicVo?.id === nicId);
    const isVlanLess = (vlan) => vlan === undefined || vlan === 0;

    if (isVlanLess(draggedNetwork.vlan) && existingNAList.some(na => isVlanLess(na.networkVo?.vlan))) {
      return toast.error("이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.");
    }

    const draggedNA = baseItems.networkAttachment.find(na => na.networkVo.id === draggedNetwork.id)
      ?? movedItems.networkAttachment.find(na => na.networkVo.id === draggedNetwork.id);

    if (!draggedNA) return;

    const updatedNA = {
      ...draggedNA,
      hostNicVo: { id: nicId, name: nicName },
    };

    setBaseItems(prev => ({...prev, networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetwork.id),}));

    setMovedItems(prev => ({
      ...prev,
      networkAttachment: [
        ...prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetwork.id),
        updatedNA,
      ],
    }));

    // 변경될 네트워크 목록에 값 추가
    setModifiedNAs(prev => [...prev, updatedNA]);
  };
  const getActualModifiedNAs = () => {
  const allNAs = [
    ...baseItems.networkAttachment,
    ...movedItems.networkAttachment
  ];
  return modifiedNAs.filter(na =>
    allNAs.some(attached => 
      attached.hostNicVo?.id === na.hostNicVo?.id &&
      attached.networkVo?.id === na.networkVo?.id
    )
  );
};

  // 할당된 네트워크를 해제 (할당되지 않은 상태로 이동)
  const handleDropAssignedNetworkToUnassigned = (draggedNetwork) => {
    const detachedNA = baseItems.networkAttachment.find(na => na.networkVo.id === draggedNetwork.id)
      ?? movedItems.networkAttachment.find(na => na.networkVo.id === draggedNetwork.id);

    if (!detachedNA) return;

    const originalNetworkData = networks.find(net => net.id === draggedNetwork.id) || {};

    const restoredNetwork = {
      id: draggedNetwork.id,
      name: draggedNetwork.name,
      status: originalNetworkData?.status || "NON_OPERATIONAL",
      vlan: originalNetworkData?.vlan,
      required: originalNetworkData?.required ? "필수" : "필수X",
      usageVm: originalNetworkData?.usage?.vm || false,
    };

    setBaseItems(prev => ({...prev, networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetwork.id)}));

    setMovedItems(prev => ({
      ...prev,
      networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetwork.id),
      network: [...prev.network, restoredNetwork],
    }));

    if (detachedNA && detachedNA.id) {
      setRemoveNAs(prev => [...prev, restoredNetwork]);
    }
  };

  // NIC 본딩을 위한 드롭 처리 본딩 생성 시 (baseNic를 다른 baseNic로 드래그)
  const handleDropNicForBonding = (draggedNic, targetNicId) => {
    const sourceNic = baseItems.nic.find(n => n.id === draggedNic.id);
    const targetNic = baseItems.nic.find(n => n.id === targetNicId);

    if (!targetNic || !sourceNic || sourceNic.id === targetNic.id) {
      return toast.error("유효하지 않은 본딩 대상입니다.");
    }

    const isAlreadyBonded = nic => nic.name.startsWith("bond") || (nic.bondingVo?.slaves?.length > 0);
    if (isAlreadyBonded(sourceNic) || isAlreadyBonded(targetNic)) {
      return toast.error("이미 본딩된 NIC는 다시 본딩할 수 없습니다.");
    }

    // VLAN 없는 네트워크 검사
    const findNoVlanNetwork = (nicId) => {
      const naList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => na.hostNicVo?.id === nicId);
      return naList.some(na => !na.networkVo?.vlan || na.networkVo.vlan === 0);
    };

    const sourceHasNoVlan = findNoVlanNetwork(sourceNic.id);
    const targetHasNoVlan = findNoVlanNetwork(targetNic.id);

    if (sourceHasNoVlan && targetHasNoVlan) {
      return toast.error("하나의 인터페이스에 둘 이상의 비 VLAN 네트워크를 사용할 수 없습니다.");      
    }

    // 해당 nic가 가지고 있는 네트워크 아이디 가져오기
    const getAttachedNetworkIds = (nicId) => {
      return [...baseItems.networkAttachment, ...movedItems.networkAttachment]
        .filter(na => na.hostNicVo?.id === nicId)
        .map(na => na.networkVo?.id);
    };
    const sourceNetworkIds = getAttachedNetworkIds(sourceNic.id);
    const targetNetworkIds = getAttachedNetworkIds(targetNic.id);

    setSelectedBond({
      nic1: sourceNic,
      nic2: targetNic,
      nic1NetworkIds: sourceNetworkIds,
      nic2NetworkIds: targetNetworkIds,
    });
    setEditBondingMode(false);
    setIsBondingPopup(true);
  };
  // baseNic를 기존 bondNic(bond)로 추가
const handleAddBaseNicToBond = (baseNic, targetBond) => {
  // 이미 bond인 NIC면 추가하지 않음
  if (baseNic.name.startsWith("bond") || (baseNic.bondingVo?.slaves?.length > 0)) {
    toast.error("이미 본딩된 NIC는 추가할 수 없습니다.");
    return;
  }

  setBaseItems(prev => {
    // bondNic 찾기
    const bondIndex = prev.nic.findIndex(n => n.name === targetBond.name);
    if (bondIndex === -1) return prev;

    // 기존 slaves 복제 및 baseNic 추가
    const oldBond = prev.nic[bondIndex];
    const updatedSlaves = [
      ...(oldBond.bondingVo?.slaves || []),
      {
        id: baseNic.id,
        name: baseNic.name,
        status: baseNic.status,
        macAddress: baseNic.macAddress,
      }
    ];

    // bondNic 업데이트
    const updatedBond = {
      ...oldBond,
      bondingVo: {
        ...oldBond.bondingVo,
        slaves: updatedSlaves,
      }
    };

    // 기존 NIC 리스트에서 baseNic 빼고, bondNic 업데이트
    const newNics = prev.nic
      .filter(n => n.id !== baseNic.id)
      .map(n => n.name === targetBond.name ? updatedBond : n);

    return {
      ...prev,
      nic: newNics
    };
  });

  // 수정된 본딩 목록도 업데이트
  setModifiedBonds(prev => {
    // 이미 수정 중인 bond가 있으면 교체, 없으면 추가
    const existIdx = prev.findIndex(bond => bond.name === targetBond.name);
    let updatedBond = prev[existIdx] || targetBond;
    updatedBond = {
      ...updatedBond,
      bondingVo: {
        ...updatedBond.bondingVo,
        slaves: [
          ...(updatedBond.bondingVo?.slaves || []),
          {
            id: baseNic.id,
            name: baseNic.name,
            status: baseNic.status,
            macAddress: baseNic.macAddress,
          }
        ]
      }
    };
    if (existIdx >= 0) {
      return [
        ...prev.slice(0, existIdx),
        updatedBond,
        ...prev.slice(existIdx + 1)
      ];
    } else {
      return [...prev, updatedBond];
    }
  });

  setDragItemFlag(true);
  toast.success(`${baseNic.name}을(를) ${targetBond.name} 본딩에 추가했습니다.`);
};



  // 드래그 중인 항목을 특정 위치에 놓았을 때 호출. 실제로 항목을 옮기는 로직을 수행
  // 항목을 놓으면 현재 드래그 항목(dragItem)과 놓는 위치(dragOverTarget)를 기준으로 상태를 업데이트
  // 기존 배열에서 항목을 제거하고 대상 배열로 이동
  const handleDrop = (e, targetDestination, nicId = null, nicName = null) => {
    e.preventDefault();
    if (!dragItem) return;

    const { item, type, list, parentBond } = dragItem;

    if (type === "nic") {
      if (list === "slave" && targetDestination === "bond") {
        // "본딩 해제" - slave NIC를 baseNic로 이동시키기
        handleDropBond(item, parentBond, nicId, nicName);
      } else if (list === "nic" && targetDestination === "bond") {
        // 기존 baseNic → baseNic으로 본딩
        handleDropNicForBonding(item, nicId);
      }
    }

    // 네트워크
    if (type === "network") {
      if (list === "attach" && targetDestination === "detach") {
        handleDropUnassignedNetworkToNic(item, nicId, nicName);
      } else if (list === "detach" && targetDestination === "detach") {
        handleDropBetweenNetworkToNic(item, nicId, nicName);
      } else if (list === "detach" && targetDestination === "attach") {
        handleDropAssignedNetworkToUnassigned(item);
      }
    }

    // 인터페이스
    if (type === "nic" && targetDestination === "bond") {
      handleDropNicForBonding(item, nicId);
    }

    setDragItem(null);
    setDragOverTarget(null);
  };

  const handleCreateBond = useCallback((newBond) => {
    // 1. 본딩에 들어갈 NIC id 배열
    const slaveIds = newBond.bondingVo.slaves.map(s => s.id);

    // 2. 기존 NIC에서 id가 일치하는 슬레이브 정보 추출
    const slavesDetail = baseItems.nic.filter(nic => slaveIds.includes(nic.id))
      .map(nic => ({
        id: nic.id,
        name: nic.name,
        status: nic.status,
        macAddress: nic.macAddress,
      }));

    // 3. 본딩 NIC 객체 생성
    const bondNic = {
      // id: newBond.name,
      name: newBond.name,    // HostBondingModal에서 입력
      bondingVo: {
        slaves: slavesDetail,
      },
      status: "UP",          // 필요시 수정
      macAddress: "",        // 필요시 수정
      // 기타 필요 필드
    };

    // 4. baseItems에서 기존 NIC(ens192, ens224) 제거, bondNic 추가
    setBaseItems(prev => ({
      ...prev,
      nic: [
        ...prev.nic.filter(nic => !slaveIds.includes(nic.id)),
        bondNic,
      ]
    }));

    // 5. 수정된 본딩 목록도 업데이트
    setModifiedBonds(prev => [...prev, bondNic]);
    setDragItemFlag(true);
    setIsBondingPopup(false);
  }, [baseItems.nic]);


  const handleDropBond = (slaveNic, parentBond) => {
    const allSlaves = parentBond.bondingVo.slaves || [];
    if (allSlaves.length <= 2) {
      // 본딩에 2개만 있으면 본딩 자체를 해제(=모두 base NIC로)
      // setModifiedBonds(prev => prev.filter(bond => bond.name !== parentBond.name));
      setRemoveBonds(prev => [...prev, { id: parentBond.id, name: parentBond.name }]);
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
        const bondNetworks = [...prev.networkAttachment, ...movedItems.networkAttachment]
        .filter(na => na.hostNicVo?.id === parentBond.name || na.hostNicVo?.name === parentBond.name);

        let newNetworkAttachment = [];
        if (newBaseNics.length > 0 && bondNetworks.length > 0) {
          newNetworkAttachment = bondNetworks.map(na => ({
            ...na,
            hostNicVo: { id: newBaseNics[0].id, name: newBaseNics[0].name }
          }));
        }

        return {
          ...prev,
          nic: [
            ...prev.nic.filter(nic => nic.name !== parentBond.name), // bond NIC 제거
            ...newBaseNics
          ],
          networkAttachment: [
            ...prev.networkAttachment.filter(na =>
              na.hostNicVo?.id !== parentBond.name && na.hostNicVo?.name !== parentBond.name
            ),
            ...newNetworkAttachment
          ]
        };
      });
      setDragItemFlag(true);
      toast.success("본딩 해제되어 각각의 NIC로 분리되었습니다.");
    } else {
      // 3개 이상이면 해당 NIC만 본딩에서 분리하고 bond는 남김
      // 1. parentBond.bondingVo.slaves에서 분리
      const remainSlaves = allSlaves.filter(s => s.id !== slaveNic.id);

      // 2. base NIC에 해당 NIC 추가
      setBaseItems(prev => {
        // 중복 방지
        const existIds = new Set(prev.nic.map(n => n.id));
        const newBaseNics = !existIds.has(slaveNic.id) ? [{
          id: slaveNic.id,
          name: slaveNic.name,
          status: slaveNic.status,
          macAddress: slaveNic.macAddress,
          bondingVo: { activeSlave: null, slaves: [] }
        }] : [];
        // bond는 remainSlaves로 갱신
        const newNics = prev.nic.map(nic =>
          nic.name === parentBond.name
            ? { ...nic, bondingVo: { ...nic.bondingVo, slaves: remainSlaves } }
            : nic
        );
        return {
          ...prev,
          nic: [...newNics, ...newBaseNics]
        };
      });
      // 본딩 정보는 수정된 상태로 유지
      setModifiedBonds(prev => prev.map(bond =>
        bond.name === parentBond.name
          ? { ...bond, bondingVo: { ...bond.bondingVo, slaves: allSlaves.filter(s => s.id !== slaveNic.id) } }
          : bond
      ));
      setDragItemFlag(true);
      toast.success("선택한 NIC만 본딩에서 해제되었습니다.");
    }
  };


  
  // 본딩된 nic (nic 2개 이상: bonding)
const bondNic = (nic) => {
  return (
    <div
      className="interface-outer container flex-col p-2"
      data-tooltip-id={`nic-tooltip-${nic.id}`}
      // 기존
      onDragOver={e => {
        // base NIC만 드롭 허용
        if (dragItem && dragItem.type === "nic" && dragItem.list === "nic") {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }
      }}
      onDrop={e => {
        // base NIC만 드롭 허용
        if (dragItem && dragItem.type === "nic" && dragItem.list === "nic") {
          handleAddBaseNicToBond(dragItem.item, nic);
          setDragItem(null);
          setDragOverTarget(null);
        }
      }}
    >
      <div className="interface-content">
        <div className="f-start">{nic.name}</div>
        <RVI36
          className="icon cursor-pointer"
          iconDef={rvi36Edit()}
          onClick={() => {
            setSelectedNic(nic);
            setEditBondingMode(true);
            setIsBondingPopup(true);
          }}
        />
      </div>
      <div className="w-full interface-container-outer2" onDragOver={e => e.preventDefault()}>
        {nic.bondingVo?.slaves.map((slave) => (
          <div
            className="interface-container container"
            key={slave.id}
            data-tooltip-id={`nic-tooltip-${slave.id}`}
            data-tooltip-html={generateNicTooltipHTML(slave)}
            draggable
            onDragStart={e => handleDragStart(e, slave, "nic", "slave", nic)}
          >
            <div className="flex gap-1">
              <RVI16 iconDef={slave.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-0.5" />
              {slave.name}
              {idView(slave)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  // 단순 nic
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
      >
        <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
        {nic.name}{idView(nic)}
        <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
      </div>
    );
  };

  // 할당된 네트워크
  const matchNetwork = (networkAttach, nicId, nicName) => {

    return (
      <div className="assigned-network-outer">
        <div className="assigned-network-content fs-14"
          data-tooltip-id={`network-tooltip-${networkAttach?.networkVo?.id}`}
          data-tooltip-html={generateNetworkTooltipHTML(networkAttach)}
          draggable
          onDragStart={(e) => handleDragStart(e, networkAttach.networkVo, "network", "detach")}
          onDrop={(e) => handleDrop(e, "detach", nicId, nicName)}
          onDragOver={(e) => handleDragOver(e, "network", "detach")}
        >
          <div className="f-start">
            <RVI16 className="mr-1.5"
              iconDef={networkAttach.networkVo?.status === "OPERATIONAL" ? rvi16TriangleUp() : rvi16TriangleDown()}
            />
            {networkAttach.networkVo?.name}{idView(networkAttach.networkVo)}
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

  // 할당되지 않은 네트워크
  const noneNetwork = (nicId, nicName) => {

    return (
      <div className="assigned-network-outer"
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
      <div className="network-item f-btw"
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
              onClick={handleFormSubmit} // 버튼 클릭시 네트워크 업데이트
            />
            <ActionButton actionType="default" label={Localization.kr.CANCEL}
              onClick={() => {
                setBaseItems({
                  nic: [...hostNics], // 초기값은 hostNics 등 원본
                  networkAttachment: transNAData,
                  network: transDetachNetworkData,
                });              // baseItems 원상복구
                setMovedItems(nullData);
                setDragItem(null);                      // 드래그 중이던 항목 초기화
                setDragItemFlag(false);                 // 변경 여부 플래그 초기화
                setDragOverTarget(null);                // 드롭 대상 초기화
                setModifiedBonds([]);
                setRemoveBonds([]);
                setModifiedNAs([]);
                setRemoveNAs([]);
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
                handleDropBond(dragItem.item, dragItem.parentBond);
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
            const matchedNAs = baseItems.networkAttachment.filter(
              (na) => 
                (na.hostNicVo?.id && na.hostNicVo.id === nic.id) || (!na.hostNicVo?.id && na.hostNicVo?.name === nic.name)
            ).concat(
              movedItems.networkAttachment.filter(
                (na) => 
                  (na.hostNicVo?.id && na.hostNicVo.id === nic.id)|| (!na.hostNicVo?.id && na.hostNicVo?.name === nic.name)
              )
            );

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
          <div className="split-item-one-third detachNetworkArea"
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
      <br/>
      <LabelCheckbox id="connection" label={`${Localization.kr.HOST}와 Engine간의 연결을 확인`}
        value={connection}
        onChange={(e) => setConnection(e.target.checked)}
      />
      <LabelCheckbox id="networkSetting" label={`${Localization.kr.NETWORK} 설정 저장`}
        value={setting}
        onChange={(e) => setSetting(e.target.checked)}
      />

      <br/>
      <span>modifiedBonds: {modifiedBonds.map((e) => `[${e.name}: ${e.bondingVo.slaves.map((s) => s?.id)}]`)}</span><br/>
      <span>removeBonds: {removeBonds.map((e) => `${e.name}, `)}</span><br/>
      <span>modifiedNAs: {getActualModifiedNAs().map((e) => `[${e.hostNicVo?.name}: ${e.networkVo?.name}]`)}</span><br/>

      {/* <span>modifiedNAs: {modifiedNAs.map((e) => `[${e.hostNicVo?.name}: ${e.networkVo?.name}]`)}</span><br/> */}
      <span>removeNAs: {removeNAs.map((e) => `${e.name}, `)}</span><br/>
      
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
          onBondingCreated={handleCreateBond}// toast.success("본딩이 추가되었습니다.");
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
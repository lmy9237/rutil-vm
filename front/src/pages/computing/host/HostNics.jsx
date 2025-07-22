import React, { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useToast }                     from "@/hooks/use-toast";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import {
  RVI24, rvi24CompareArrows,
} from "@/components/icons/RutilVmIcons";
import Loading                          from "@/components/common/Loading";
import HostNetworkEditModal             from "@/components/modal/host/HostNetworkEditModal";
import HostBondingModal                 from "@/components/modal/host/HostBondingModal";
import { ActionButton }                 from "@/components/button/ActionButtons";
import {
  useHost,
  useNetworkAttachmentsFromHost,
  useNetworkFromCluster,
  useNetworkInterfacesFromHost,
  useSetupNetworksFromHost,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "./HostNic.css";
import BondNic from "./hostNics/BondNic";
import BaseNic from "./hostNics/BaseNic";
import MatchNetwork from "./hostNics/MatchNetwork";
import NoneNetwork from "./hostNics/NoneNetwork";
import ClusterNetworkList from "./hostNics/ClusterNetworkList";
import { 
  getBondModalStateForCreate, 
  getBondModalStateForEdit, 
  getNetworkAttachmentModalState, 
  transDetachNA, 
  transNA, 
  transNic 
} from "./hostNics/TransHostNicData";
import FilterButtons from "@/components/button/FilterButtons";
import SnapshotHostBackground from "@/components/common/SnapshotHostBackground";
import { emptyIdNameVo } from "@/util";

const HostNics = ({
  hostId
}) => {
  const { toast } = useToast();
  const { validationToast } = useValidationToast();
  
  const { data: host } = useHost(hostId);
  const { data: hostNics = [] } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));
  const { data: networkAttachments = [] } = useNetworkAttachmentsFromHost(hostId, (e) => ({ ...e }));
  const { data: networks = [] } = useNetworkFromCluster(host?.clusterVo?.id, (e) => ({ ...e }));  // 할당되지 않은 논리 네트워크 조회
  const { mutate: setupNetwork } = useSetupNetworksFromHost();

  // 변경 정보
  const [modifiedBonds, setModifiedBonds] = useState([]); // 생성/수정 본딩
  const [removeBonds, setRemoveBonds] = useState([]);     // 삭제 본딩
  const [modifiedNAs, setModifiedNAs] = useState([]);     // 연결 네트워크
  const [removeNAs, setRemoveNAs] = useState([]);         // 삭제 네트워크

  // networkattachment 해제될 때 정보를 별도 보관
  const [recentlyUnassignedNAs, setRecentlyUnassignedNAs] = useState({}); 

  // 선택된 항목
  const [selectedNic, setSelectedNic] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  
  // 드래그
  const [dragItemFlag, setDragItemFlag] = useState(false);    // 변경항목 있는지 확인
  const [cancelFlag, setCancelFlag] = useState(false);        // 취소 버튼만
  const [dragItem, setDragItem] = useState(null);             // 드래그 되는 항목 { item, type, list('attach', 'detach'), parentBond }

  // 초기 값
  const [baseItems, setBaseItems] = useState({
    nic: [...hostNics],
    networkAttachment: [...networkAttachments],
    network: [...networks]
  });

  // 이동 값
  const [movedItems, setMovedItems] = useState({
    nic: [], 
    networkAttachment: [], 
    network: [] 
  });

  // hostNics를 name로 빠르게 찾을 수 있는 Map으로 변환
  const nicMap = useMemo(() => 
    hostNics.reduce((map, nic) => { map[nic.name] = nic; return map; }, {}
  ), [hostNics]);

  // 네트워크 인터페이스 목록
  const transNicData = transNic(baseItems.nic, nicMap);
  const transNAData = transNA(networkAttachments, networks);
  const transDetachNetworkData = transDetachNA(networks, networkAttachments);

  // 초기화
  const resetState = useCallback(() => {
    setBaseItems({
      nic: [...hostNics],
      networkAttachment: transNAData,
      network: transDetachNetworkData,
    });
    setMovedItems({ 
      nic: [], 
      networkAttachment: [], 
      network: [] 
    });
    setDragItem(null);
    setDragItemFlag(false);
    setCancelFlag(false);
    setModifiedBonds([]);
    setRemoveBonds([]);
    setModifiedNAs([]);
    setRemoveNAs([]);
    setRecentlyUnassignedNAs([]);
  }, [hostNics, transNAData, transDetachNetworkData]);

  // 초기화면
  useEffect(() => {
    if (
      !dragItemFlag &&                    // 최초 1회만
      hostNics.length > 0 && 
      networkAttachments.length >= 0 &&
      networks.length >= 0
    ) {
      resetState();
    }
  }, [hostId, hostNics, networkAttachments, networks]);
  
  // 드래그 항목에 대한 cancelFlag 처리
  // 원래 있던 할당된 네트워크 목록 && 변경된 네트워크 목록의 값이 === 0 이면, 취소버튼만
  useEffect(() => {
    setCancelFlag(baseItems.networkAttachment.length === 0 && movedItems.networkAttachment.length === 0);
  }, [baseItems, movedItems]);
  

  // 네트워크 필수,필요하지않음 분리버튼
  const [networkFilter, setNetworkFilter] = useState('all');
  const filterOptions = [
    { key: 'all', label: '전체' },
    { key: 'required', label: '필수' },
    { key: 'optional', label: '필요하지 않음' }
  ];
  // 본딩 모달 관리
  const [isBondingPopup, setIsBondingPopup] = useState(false);       // 본딩 모달 오픈
  const [isBondingEditMode, setIsEditBondingMode] = useState(false); // 본딩 편집 모드
  const [bondModalState, setBondModalState] = useState({
    name: "", 
    optionMode: "1", 
    userMode: "", 
    editTarget: null
  }); // 본딩 모달에 넘길 정보

  // 네트워크 모달 관리
  const [isNetworkEditPopup, setIsNetworkEditPopup] = useState(false);  // 네트워크 편집 모달 오픈
  const [networkAttachmentModalState, setNetworkAttachmentModalState] = useState({
    id: "",
    inSync: false,
    // hostNicVo: emptyIdNameVo(),
    networkVo: emptyIdNameVo(),
    ipv4Values: { protocol: "none", address: "", gateway: "", netmask: "" },
    ipv6Values: { protocol: "none", address: "", gateway: "", netmask: "" },
    // dnsServers: []
  });

  // 본딩되어 있는지 검사
  const isAlreadyBonded = (nic) => {
    return nic.name.startsWith("bond") || (nic.bondingVo?.slaveVos?.length > 1)
  };

  // 본딩 생성 값
  const tossCreateBondingData = (nic1, nic2) => {
    setSelectedNic(null);
    setBondModalState(
      getBondModalStateForCreate(
        nic1, nic2, 
        baseItems.networkAttachment, movedItems.networkAttachment
      )
    );
    setIsEditBondingMode(false);
    setIsBondingPopup(true);
  };

  // 본딩 편집 값
  const tossEditBondingData = (bond) => {
    setSelectedNic(bond);
    setBondModalState(getBondModalStateForEdit(bond));
    setIsEditBondingMode(true);
    setIsBondingPopup(true);
  };

  // 네트워크 편집 값
  const tossEditNetworkAttachmentData = (networkAttachment) => {
    setNetworkAttachmentModalState(
      getNetworkAttachmentModalState(
        networkAttachment,
        baseItems.networkAttachment, 
        movedItems.networkAttachment,
        modifiedNAs,
        recentlyUnassignedNAs
      )
    );
    setIsNetworkEditPopup(true);
  };

  // 전송
  const handleFormSubmit = () => {
    // 본딩되는 slave NIC의 이름/ID 추출
    const bondedSlaveNames = modifiedBonds
      .flatMap(bond => bond.bondingVo.slaveVos.map(s => s.name));

    // "networkAttachments"에 slave NIC에 붙어있던 네트워크 제거
    const filteredModifiedNAs = modifiedNAs.filter(na =>
      // slave NIC에 네트워크가 남아있는 경우 제거(=bond NIC로만 옮긴다)
      !(bondedSlaveNames.includes(na.hostNicVo.name) && !na.hostNicVo.name.startsWith("bond"))
    );

    const filteredRemoveNAs = removeNAs.filter(na => !modifiedNAs.some(mod => mod.id === na.id));
    
    const hostNetworkVo = {
      bonds: modifiedBonds.map(bond => ({
        name: bond.name,
        bondingVo: {
          slaveVos: bond.bondingVo.slaveVos.map(slave => ({ name: slave.name })),
          optionVos: bond.bondingVo.optionVos.map(option => ({ name: option.name, value: option.value  }))
        }
      })),
      bondsToRemove: removeBonds.map(bond => ({ name: bond.name })),
      networkAttachments: filteredModifiedNAs.map(na => ({
        hostNicVo: na.hostNicVo, // id, name 모두 보낼 수 있음
        networkVo: na.networkVo, // id, name
        inSync: na.inSync ?? true,
        ipAddressAssignments: na.ipAddressAssignments || [],
        nameServerList: na.dnsServers || [], // HostNetworkEditModal에서 dnsServers로 관리하고 있으면 nameServerList로 이름 맞춰주기
      })),
      networkAttachmentsToRemove: filteredRemoveNAs.map(na => ({ id: na.id }))
    };

    Logger.debug(`HostNics > handleFormSubmit ... dataToSubmit: `, hostNetworkVo); // 데이터 출력
    setupNetwork({ hostId: hostId, hostNetworkVo: hostNetworkVo });

    resetState(); // 초기화
  };

  // 변경 감지를 위한 유틸리티 함수들
  const compareAndExtractChanges = useCallback(() => {
    Logger.debug(`HostNics > compareAndExtractChanges ... `);
    // 초기 데이터
    const initialNics = hostNics; // transNicData 대신 원본 hostNics 사용
    const initialNAs = transNAData;
    const initialNetworks = transDetachNetworkData;
    
    // 현재 데이터
    const currentNics = [...baseItems.nic];
    const currentNAs = [...baseItems.networkAttachment, ...movedItems.networkAttachment];
    
    // 본딩 변경사항 감지
    const newModifiedBonds = [];
    const newRemoveBonds = [];

    // 네트워크 할당 변경사항 감지
    const newModifiedNAs = [];
    const newRemoveNAs = [];
    
    // 현재 본딩된 NIC들 찾기
    const currentBonds = currentNics.filter(nic => isAlreadyBonded(nic));
    
    // 초기 본딩된 NIC들 찾기
    const initialBonds = initialNics.filter(nic => isAlreadyBonded(nic));
    

    // 본딩 변경 검사 (slave 변경과 option 변경 모두 검사)
    currentBonds.forEach(currentBond => {
      const initialBond = initialBonds.find(nic => nic.name === currentBond.name);

      if (!initialBond) {
        // 새로 생성
        newModifiedBonds.push(currentBond);
      } else {
        // 기존 slave 비교
        const initialSlaveNames = new Set(initialBond.bondingVo?.slaveVos?.map(s => s.name) || []);
        const currentSlaveNames = new Set(currentBond.bondingVo?.slaveVos?.map(s => s.name) || []);
        const hasSlaveChanges = initialSlaveNames.size !== currentSlaveNames.size ||
          [...initialSlaveNames].some(name => !currentSlaveNames.has(name)) ||
          [...currentSlaveNames].some(name => !initialSlaveNames.has(name));

        // 옵션(optionVos) 비교 (여기서만 true일 때만 추가)
        const initialOption = initialBond.bondingVo?.optionVos?.find(opt => opt.name === "mode")?.value;
        const currentOption =
          (currentBond.bondingVo?.optionVos?.find(opt => opt.name === "mode")?.value)
          ?? (initialBond.bondingVo?.optionVos?.find(opt => opt.name === "mode")?.value);
        const hasOptionChange = initialOption !== currentOption;

        if (hasSlaveChanges || hasOptionChange) {
          newModifiedBonds.push(currentBond);
        }
      }
    });

    // 삭제된 본딩 찾기
    initialBonds.forEach(initialBond => {
      const currentBond = currentBonds.find(bond => bond.name === initialBond.name);
      if (!currentBond) {
        newRemoveBonds.push({ id: initialBond.id, name: initialBond.name });
      }
    });
    
    // 네트워크 할당 변경 검사
    currentNAs.forEach(currentNA => {
      const initialNA = initialNAs.find(na => 
        na.networkVo.id === currentNA.networkVo.id && 
        na.hostNicVo?.name === currentNA.hostNicVo?.name
      );
      
      if (!initialNA) {
        // 새로 할당된 네트워크 (할당되지 않은 네트워크에서 이동 또는 다른 NIC에서 이동)
        const wasUnassigned = initialNetworks.some(net => net.id === currentNA.networkVo.id);
        const wasOnDifferentNic = initialNAs.some(na => 
          na.networkVo.id === currentNA.networkVo.id && 
          na.hostNicVo?.name !== currentNA.hostNicVo?.name
        );
        
        if (wasUnassigned || wasOnDifferentNic) {
          newModifiedNAs.push({ ...currentNA });
        }
      }else {
        const isIpChanged = JSON.stringify(initialNA.ipAddressAssignments || []) !== JSON.stringify(currentNA.ipAddressAssignments || []);
        const isDnsChanged = JSON.stringify(initialNA.dnsServers || []) !== JSON.stringify(currentNA.dnsServers || []);
        if (isIpChanged || isDnsChanged) {
          newModifiedNAs.push(currentNA);
        }
      }
    });
  
    // 삭제된 할당된 네트워크 찾기
    initialNAs.forEach(initialNA => {
      const naInCurrent = currentNAs.find(na =>
        na.networkVo.id === initialNA.networkVo.id && 
        na.hostNicVo?.name === initialNA.hostNicVo?.name
      );
      // 완전 삭제(할당 해제)된 경우만 removeNAs에 추가
      const stillExistsSomewhere = currentNAs.some(na =>
        na.networkVo.id === initialNA.networkVo.id
      );
      if (!naInCurrent && !stillExistsSomewhere) {
        // 네트워크가 현재 어디에도 연결 안됨
        if (initialNA.id) {
          newRemoveNAs.push({ id: initialNA.id });
        }
      }
    });

    return {
      modifiedBonds: newModifiedBonds,
      removeBonds: newRemoveBonds,
      modifiedNAs: newModifiedNAs,
      removeNAs: newRemoveNAs
    };
  }, [baseItems, movedItems]);


  // 상태가 변경될 때마다 변경사항을 계산하여 업데이트
  useEffect(() => {
    if (dragItemFlag) {
      const changes = compareAndExtractChanges();

      setModifiedBonds(changes.modifiedBonds);
      setRemoveBonds(changes.removeBonds);
      setModifiedNAs(changes.modifiedNAs);
      setRemoveNAs(changes.removeNAs);

      // 변경 사항이 없으면 dragItemFlag을 false로
      if (
        (!changes.modifiedBonds || changes.modifiedBonds.length === 0) &&
        (!changes.removeBonds || changes.removeBonds.length === 0) &&
        (!changes.modifiedNAs || changes.modifiedNAs.length === 0) &&
        (!changes.removeNAs || changes.removeNAs.length === 0)
      ) {
        setDragItemFlag(false);
      }
    }
  }, [baseItems, movedItems, dragItemFlag]);

  /**
   * 항목 드래그 시작 시 호출, 어떤 항목을 드래그하는지 상태(dragItem)에 저장
   * @param {*} e 
   * @param {*} item 드래그 중인 요소
   * @param {*} type 항목 유형
   * @param {*} list 출발지 유형('attach', 'detach')
   * @param {*} parentBond slave의 경우만 전달
   */
  const handleDragStart = (e, item, type, list, parentBond = null) => {
    setDragItem({ item, type, list, parentBond });
    e.dataTransfer.effectAllowed = 'move';
  };

  /**
   * @name handleDragOver
   * 
   * 드래그 중인 항목이 특정 위치 위를 지나갈 때 호출. 이때, 드롭 가능한지 체크
   * @param {*} e 
   * @param {*} targetType 
   * @param {*} targetDestination 
   */
  const handleDragOver = (e, targetType) => {
    e.preventDefault();
    if (dragItem && dragItem.type === targetType) { // 드래그 대상과 드래그 타입이 같아면 이동가능
      e.dataTransfer.dropEffect = 'move';
    } else { // 아닐 경우 불가능
      e.dataTransfer.dropEffect = 'none';
    }
  };

  // network vlan 검사 함수
  const isVlanLess = (vlan) => vlan === undefined || vlan === 0;

  // vlan 충돌 검사
  const hasVlanConflict = (networkVlan, nic) => {
    const existingNAList = 
      [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(
        na => na.hostNicVo?.name === nic.name
      );
    return isVlanLess(networkVlan) && existingNAList.some(na => isVlanLess(na.networkVo?.vlan));
  };

  // networkAttachment 안의 networkVo 찾는 함수
  const findNetworkVoFromNetworkAttachment = (networkId) => {
    return (
      baseItems.networkAttachment.find(na => na?.networkVo?.id === networkId)
      ?? movedItems.networkAttachment.find(na => na?.networkVo?.id === networkId)
    );
  };


  /**
   * 할당되지 않은 네트워크 → NIC에 할당
   * @param {*} draggedNetwork 
   * @param {*} targetNic
   * @returns 
   */
  const handleDropUnassignedNetworkToNic = (draggedNetwork, targetNic) => {  
    // 드래그 한 네트워크 vlan여부 판단해서 toast  
    if (hasVlanConflict(draggedNetwork.vlan, targetNic)) {
      validationToast.fail("이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.");
      return;
    }
    const networkId = draggedNetwork.networkVo?.id || draggedNetwork.id;

    const originalNetwork = networks.find(net => net.id === networkId) || {};

    // 최근 해제된 정보에서 논리 네트워크 id로 찾기
    const prevNA = recentlyUnassignedNAs[networkId];
    const newAttachment = prevNA
      ? {
          ...prevNA,
          hostNicVo: { ...targetNic },
          ipAddressAssignments: Array.isArray(prevNA.ipAddressAssignments) 
            ? prevNA.ipAddressAssignments.map(ip => 
              ({ 
                ...ip, 
                ipVo: { ...ip.ipVo } 
              })
            ) 
            : [],
          dnsServers: Array.isArray(prevNA.dnsServers)
            ? [...prevNA.dnsServers]
            : [],
        }
      : {
          hostNicVo: { ...targetNic },
          networkVo: {
            id: originalNetwork.id,
            name: originalNetwork.name,
            status: originalNetwork.status || "UNKNOWN",
            vlan: originalNetwork.vlan,
          },
          ipAddressAssignments: [],
          dnsServers: [],
        };

    setRecentlyUnassignedNAs(prev => {
      const newObj = { ...prev };
      delete newObj[networkId];
      return newObj;
    });
    
    // 기존 아이템의 network 드래그한 네트워크 제외
    setBaseItems(prev => ({ 
      ...prev, 
      network: prev.network.filter(n => n.id !== draggedNetwork.id)
    })); 

    // 변동 아이템의 networkAttachment 드래그한 네트워크 추가 / networks 드래그한 네트워크 제외
    setMovedItems(prev => ({
      ...prev,
      networkAttachment: [ 
        // ...prev.networkAttachment, 
        ...prev.networkAttachment.filter(na => na.networkVo.id !== newAttachment.networkVo.id),
        newAttachment 
      ], 
      network: prev.network.filter(n => n.id !== draggedNetwork.id),
    }));

    // 변동된 네트워크 할당 값들
    setModifiedNAs(prev => [ 
      ...prev.filter(na => na.networkVo.id !== newAttachment.networkVo.id), 
      newAttachment 
    ]);

    setDragItemFlag(true);
    // toast({ 
    //   variant: "success",
    //   description: `handleDropUnassignedNetworkToNic  ${newAttachment.networkVo?.name}을(를) ${newAttachment.hostNicVo?.name} 본딩에 추가했습니다.`, 
    // });
  };

  /**
   * 할당된 네트워크 간 이동
   * @param {*} draggedNetwork 
   * @param {*} targetNic
   * @returns 
   */
  const handleDropBetweenNetworkToNic = (draggedNetwork, targetNic) => {
    // 기존 NA 찾기
    const draggedNetworkId = draggedNetwork?.networkVo?.id || draggedNetwork?.id;
    const draggedNA = findNetworkVoFromNetworkAttachment(draggedNetworkId);
    Logger.debug("HostNics > handleDropBetweenNetworkToNic ... draggedNA", draggedNA);

    if (!draggedNA) return;

    // 이미 같은 NIC에 붙어있으면 무시
    if (draggedNA?.name === targetNic?.name) return;
    

    // vlan 충돌 검사
    if (hasVlanConflict(draggedNA?.networkVo?.vlan, targetNic)) {
      validationToast.fail("이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.");
      return;
    }
    // if(!draggedNA.inSync){
    //   validationToast.fail(`${draggedNA.networkVo?.name}은 비동기 네트워크입니다`);
    //   return;
    // }

    // 네트워크 값에서 이동한 hostnic 값 수정
    const updatedNA = {
      ...draggedNA,
      hostNicVo: { name: targetNic?.name },
    };

    const preNA = (na) => {
      return !(na?.networkVo?.id === draggedNA?.networkVo?.id && na?.hostNicVo?.name === draggedNA?.hostNicVo?.name)
    }

    // baseItems 기존 NA 제거
    setBaseItems(prev => ({
      ...prev,
      networkAttachment: prev.networkAttachment.filter(na => preNA(na))
    }));

    // movedItems networkAttachment 기존 NA 제거, networkAttachment 수정 NA 추가
    setMovedItems(prev => ({
      ...prev,
      networkAttachment: [ 
        ...prev.networkAttachment.filter(na => preNA(na)), 
        updatedNA 
      ]}
    ));

    // 변동된 네트워크 할당 값들
    setModifiedNAs(prev => [ 
      ...prev.filter(na => na?.id !== draggedNA?.id), 
      updatedNA 
    ]);

    setDragItemFlag(true);
    // toast({ description: "NIC간 네트워크 이동!" });
  };


  /**
   * 할당된 네트워크를 해제 (할당되지 않은 상태로 이동)
   * @param {*} draggedNetwork 
   * @returns 
   */
  const handleDropAssignedNetworkToUnassigned = (draggedNetwork) => {
    const draggedNA = findNetworkVoFromNetworkAttachment(draggedNetwork.id);
    if (!draggedNA) {
      validationToast.fail("삭제할 네트워크 연결 정보를 찾을 수 없습니다.");
      return;
    }
    Logger.debug("HostNics > handleDropAssignedNetworkToUnassigned ... draggedNA", draggedNA);

    const originalNetworkData = networks.find(net => net.id === draggedNA.networkVo.id) || {};

    // 할당되지 않은 네트워크로 들어갈 값
    const restoredNetwork = {
      id: draggedNA.networkVo?.id,
      name: draggedNA.networkVo?.name,
      status: originalNetworkData?.status || "NON_OPERATIONAL",
      vlan: originalNetworkData?.vlan,
      required: originalNetworkData?.required,
      usageVm: originalNetworkData?.usage?.vm || false,
    };
    Logger.debug("HostNics > handleDropAssignedNetworkToUnassigned ... restoredNetwork", restoredNetwork);

    setRecentlyUnassignedNAs(prev => ({
      ...prev,
      [draggedNA.networkVo.id]: draggedNA
    }));

    // baseItems 드래그 NA 제거
    setBaseItems(prev => ({
      ...prev,
      // hostNicVo.name, networkVo.id 둘 다 매칭되는 NA만 제거
      networkAttachment: prev.networkAttachment.filter(
        na => !(na.networkVo?.id === draggedNA.networkVo?.id && na.hostNicVo?.name === draggedNA.hostNicVo?.name)
      )
    }));

    // movedItems networkAttachment 기존 NA 제거, network 드래그 항목 추가
    setMovedItems(prev => ({
      ...prev,
      networkAttachment: prev.networkAttachment.filter(
        na => !(na.networkVo?.id === draggedNA.networkVo?.id && na.hostNicVo?.name === draggedNA.hostNicVo?.name)
      ),
      network: [...prev.network, restoredNetwork], 
    }));

    // 지울 네트워크 목록에는 Network Attachment ID 추가
    setRemoveNAs(prev => [...prev, { id: draggedNA.id }]);

    setDragItemFlag(true);
    if(originalNetworkData?.required){
      validationToast.fail(`네트워크 ${draggedNA.networkVo.name}는 필수 네트워크로, 분리시 호스트 장애가 일어날 수 있습니다.`);
      return;
    }
  };

  // TODO: hostnic를 가지고 있느 가상머신이 활성화 상태라면 handlesubmit막기

  /**
   * 네트워크 편집 데이터
  */
  const editNetworkData = useCallback((networkEditData) => {
    setBaseItems(prev => ({
      ...prev,
      networkAttachment: prev.networkAttachment.map(na =>
        na.id === networkEditData.id ? { ...na, ...networkEditData } : na
      ),
    }));

    setModifiedNAs(prev => [
      ...prev.filter(na => 
        !(
          na.networkVo?.id === networkEditData.networkVo?.id &&
          na.hostNicVo?.name === networkEditData.hostNicVo?.name
        )
      ),
      networkEditData
    ]);
    setDragItemFlag(true);
  }, []);


  /**
   * NIC 본딩 생성을 위한 드롭(baseNic를 다른 baseNic로 드래그)
   * @param {*} dragged 
   * @param {*} targetId 
   * @returns 
   */
  const handleAddBonding = (dragged, target) => {
    const sourceNic = baseItems.nic.find(n => n.name === dragged.name); // 드래그 대상
    const targetNic = baseItems.nic.find(n => n.name === target.name);  // 타겟 대상

    // 드래그항목이나 타겟항목이 없고 드래그항목과 타겟항목의 아이디가 같다면 에러
    if (!targetNic || !sourceNic || sourceNic.name === targetNic.name) {
      validationToast.fail("유효하지 않은 본딩 대상입니다.");
      return;
    }

    // 이미 본딩된 상태라면 
    if (isAlreadyBonded(sourceNic) || isAlreadyBonded(targetNic)) {
      validationToast.fail("이미 본딩된 NIC는 다시 본딩할 수 없습니다.");
      return;
    }

    // 해당 nic가 vlan 네트워크를 가지고 있는지 검사
    const findNoVlanNetwork = (nic) => {
      const naList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(
        na => na.hostNicVo?.name === nic.name
      );
      return naList.some(na => !na.networkVo?.vlan || na.networkVo.vlan === 0);
    };

    if (findNoVlanNetwork(sourceNic) && findNoVlanNetwork(targetNic)) {
      validationToast.fail("하나의 인터페이스에 둘 이상의 비 VLAN 네트워크를 사용할 수 없습니다.");
      return;
    }
    const addNetwork = (nic) => {
      return baseItems.networkAttachment.filter(na => na.hostNicVo?.name === nic.name)
    }

    setSelectedNic({
      nic1: { ...sourceNic, networks: addNetwork(sourceNic) },
      nic2: { ...targetNic, networks: addNetwork(targetNic) }
    });

    tossCreateBondingData(sourceNic, targetNic);
    // toast({ description: "handleDropNicForBonding" });
  };


  /**
   * 본딩된 항목에 basenic 추가
   * @param {*} dragged 
   * @param {*} targetBond 
   * @returns 
   */
  const handleAddBaseNicToBond = (draggedNic, targetBond) => {
    // baseNic가 보유한 네트워크 attachment 추출
    const allNetworkAttachments = [...baseItems.networkAttachment, ...movedItems.networkAttachment];
    const baseNicNetworks = allNetworkAttachments.filter(
      na => na.hostNicVo?.name === draggedNic.name
    );

    // VLAN 없는 네트워크 중복 방지 검사
    const hasNoVlanNetwork = (nic) => allNetworkAttachments
      .filter(na => na.hostNicVo?.name === nic.name)
      .some(na => na.networkVo?.vlan === undefined || na.networkVo?.vlan === 0);

    if (hasNoVlanNetwork(draggedNic) && hasNoVlanNetwork(targetBond)) {
      validationToast.fail("하나의 인터페이스에 둘 이상의 비 VLAN 네트워크를 사용할 수 없습니다.");
      return;
    }

    // bondNic로 옮길 네트워크(ens193 → bondNic)
    const transferredAttachments = baseNicNetworks.map(na => ({
      ...na,
      hostNicVo: { name: targetBond.name }
    }));

    // baseItems 변경
    setBaseItems(prev => {
      const bondIndex = prev.nic.findIndex(n => n.name === targetBond.name);
      if (bondIndex === -1) return prev;

      // 기존 slaves 복제 및 baseNic 추가
      const oldBond = prev.nic[bondIndex];

      // 변경된 본딩값
      const updatedBond = {
        ...oldBond,
        bondingVo: {
          ...oldBond.bondingVo,
          slaveVos: [
            ...(oldBond.bondingVo?.slaveVos || []),
            {
              id: draggedNic.id,
              name: draggedNic.name,
              status: draggedNic.status,
              macAddress: draggedNic.macAddress,
            }
          ],
        }
      };

      // 기존 NIC 리스트에서 baseNic 빼고, bondNic 업데이트
        return {
        ...prev,
        nic: prev.nic
          .filter(n => n.name !== draggedNic.name)
          .map(n => n.name === targetBond.name ? updatedBond : n),
        networkAttachment: [
          ...prev.networkAttachment.filter(na => na.hostNicVo?.name !== draggedNic.name),
          ...transferredAttachments
        ]
      };
    });

    // 수정된 본딩 목록도 업데이트
    setModifiedBonds(prev => {
      const existIdx = prev.findIndex(bond => bond.name === targetBond.name);

      let updatedBond = prev[existIdx] || targetBond;
      updatedBond = {
        ...updatedBond,
        bondingVo: {
          ...updatedBond.bondingVo,
          slaveVos: [
            ...(updatedBond.bondingVo?.slaveVos || []),
            {
              id: draggedNic.id,
              name: draggedNic.name,
              status: draggedNic.status,
              macAddress: draggedNic.macAddress,
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
    
    setModifiedNAs(prev => [
      ...prev.filter(na =>
        !baseNicNetworks.some(
          bna => bna.networkVo?.id === na.networkVo?.id && bna.hostNicVo?.name === na.hostNicVo?.name
        )
      ),
      ...transferredAttachments
    ]);
    setDragItemFlag(true);
    // toast({ 
    //   description: `handleAddBaseNicToBond ${draggedNic.name}을(를) ${targetBond.name} 본딩에 추가했습니다.` 
    // });
  };


  /**
   * 본딩 해제 
   * @param {*} draggedNic
   * @param {*} parentBond 
   */
  const handleDropBond = (draggedNic, targetBond) => {
    const allSlaves = targetBond.bondingVo.slaveVos || [];

    // 본딩에 연결된 Network Attachments 찾기
    const bondNetworks = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => 
      na.hostNicVo?.name === targetBond.name
    );

    const restoredNetworks = bondNetworks.map(na => {
      const originalNet = networks.find(net => net.id === na.networkVo.id);

      return {
        id: originalNet.id,
        name: originalNet.name,
        status: originalNet.status || "NON_OPERATIONAL",
        vlan: originalNet.vlan,
        required: originalNet.required ? "필수" : "필수X",
        usageVm: originalNet.usage?.vm || false,
      };
    });

    // 본딩에 2개만 있으면 본딩 해제(= 모두 base NIC로)
    if (allSlaves.length <= 2) {
      setBaseItems(prev => {
        const newBaseNics = allSlaves
          .filter(s => !new Set(prev.nic.map(n => n.name)).has(s.name))
          .map(s => ({
            id: s.id,
            name: s.name,
            status: s.status,
            macAddress: s.macAddress,
            bondingVo: { 
              activeSlaveVo: null, 
              slaveVos: [], 
              optionVos: [] 
            }
          }));

        return {
          ...prev,
          nic: [
            ...prev.nic.filter(nic => nic.name !== targetBond.name),
            ...newBaseNics
          ],
          networkAttachment: prev.networkAttachment.filter(na =>
            na.hostNicVo?.name !== targetBond.name
          ),
          network: [...prev.network, ...restoredNetworks]
        };
      });

      setMovedItems(prev => ({
        ...prev,
        networkAttachment: prev.networkAttachment.filter(na => na.id === ""),
      }));

      setRemoveBonds(prev => [
        ...prev, 
        { name: targetBond.name }
      ]);

      // 본딩에 연결되어 있던 Network Attachment들도 삭제 목록(`removeNAs`)에 추가
      setRemoveNAs(prev => [ ...prev, bondNetworks.map(na => ({ id: na.id })) ]);

      setDragItemFlag(true);
      // toast({ description: `본딩 ${targetBond.name} 해제되어 각각의 NIC로 분리되었습니다.`});
    } else { 
      // 3개 이상이면 해당 NIC만 본딩에서 분리하고 bond는 남김
      const remainSlaves = allSlaves.filter(s => s.name !== draggedNic.name);
      setBaseItems(prev => {
        // NIC 배열에서 본딩 업데이트, 분리된 base NIC 추가
        const removeBaseNic = !new Set(prev.nic.map(n => n.name)).has(draggedNic.name) ? [{
          // id: slaveNic.id,
          name: draggedNic.name,
          status: draggedNic.status,
          macAddress: draggedNic.macAddress,
          bondingVo: { 
            activeSlaveVo: null, 
            slaveVos: [], 
            optionVos: [] 
          }
        }] : [];

        const newNics = prev.nic.map(nic => nic.name === targetBond.name
          ? { 
            ...nic, 
            bondingVo: { 
              ...nic.bondingVo, 
              slaveVos: remainSlaves,
              optionVos: []
            } 
          }
          : nic
        );

        return {
          ...prev,
          nic: [...newNics, ...removeBaseNic],
        // 해제되는 slaveNic의 networkAttachment는 모두 제거
          networkAttachment: prev.networkAttachment.filter(
            na => na.hostNicVo?.name !== draggedNic.name
          ),
          network: prev.network
        };
      });


      // movedItems에도 basenic 관련 networkAttachment가 있으면 모두 제거!
      setMovedItems(prev => ({
        ...prev,
        networkAttachment: prev.networkAttachment.filter(
          na => na.hostNicVo?.name !== draggedNic.name
        ),
      }));

      setModifiedBonds(prev => prev.map(bond =>
        bond.name === targetBond.name
          ? { ...bond, 
            bondingVo: { 
              ...bond.bondingVo, 
              slaveVos: remainSlaves,
              optionVos: []
            } 
          }
          : bond
      ));
      setDragItemFlag(true);
      // toast({ description: `선택한 NIC(${draggedNic.name})만 본딩에서 해제되었습니다.`}); 
    }
  };
  
  /**
   * 본딩 시도시 열릴 모달에 들어갈 값
   */
  const createBondingData = useCallback((newBond, nicData) => {
    // 본딩이 편집 되었다면
    if (isBondingEditMode && selectedNic) {
      setBaseItems(prev => {
        const nicsWithoutSelected = prev.nic.filter(nic => nic.name !== selectedNic.name);        
        return {
          ...prev,
          nic: [
            ...nicsWithoutSelected,
            { 
              ...selectedNic, 
              bondingVo: { 
                ...selectedNic.bondingVo, 
                optionVos: newBond.bondingVo.optionVos 
              } 
            }
          ]
        };
      });
      setModifiedBonds(prev => [
        ...prev.filter(bond => bond.name !== newBond.name),
        {
          ...selectedNic, 
          bondingVo: { 
            ...selectedNic.bondingVo, 
            optionVos: newBond.bondingVo.optionVos 
          } 
        }
      ]);
      setDragItemFlag(true);
      setIsBondingPopup(false);
      toast({ description: "본딩 모드가 변경되었습니다." });
      return;
    }

    if (!nicData) {
      validationToast.fail("본딩할 NIC 데이터가 없습니다.");
      return;
    }

    const optionVoDetails = newBond.bondingVo.optionVos.map(option => ({
      name : option.name,
      value: option.value
    }));
    const slaveNames = newBond.bondingVo.slaveVos.map(s => s.name);
    const slavesDetail = baseItems.nic.filter(nic => slaveNames.includes(nic.name)).map(nic => ({
      id: nic.id,
      name: nic.name,
      status: nic.status,
      macAddress: nic.macAddress,
    }));

    const bondNic = {
      name: newBond?.name,  // 본딩 이름
      bondingVo: { 
        optionVos: optionVoDetails,
        slaveVos: slavesDetail
      },
    };

    // 기존 NIC의 네트워크 목록을 본딩 NIC에 연결하기 위한 처리
    const transferredNetworks = nicData.flatMap(nic => {
      return nic.networks?.map(network => {
        // network가 이미 networkAttachment 형식이면 그대로 복사
        let originalAttachment = ([...baseItems.networkAttachment, ...movedItems.networkAttachment].find(na =>
          na.networkVo?.id === (network.id || network.networkVo?.id) &&
          na.hostNicVo?.name === nic.name
        ) || {});

        return {
          ...originalAttachment,
          ...network, // 혹시 추가 정보가 있으면 덮어씀
          hostNicVo: { id: bondNic.id, name: bondNic.name },
          networkVo: {
            ...(network.networkVo || {}),
            id: network.networkVo?.id,
            name: network.networkVo?.name,
          },
        };
      }) || []
    });

    setBaseItems(prev => {
      const filtered = prev.nic.filter(nic => nic.name !== bondNic.name && !slaveNames.includes(nic.name));
      const updatedNetworkAttachments = prev.networkAttachment
        .filter(na => !slaveNames.includes(na.hostNicVo?.name))  // 기존 NIC에 연결된 네트워크 제외
        .concat(transferredNetworks);  // 새 본딩 NIC으로 네트워크 옮김

      return {
        ...prev,
        nic: [...filtered, bondNic],
        networkAttachment: updatedNetworkAttachments
      };
    });

    // 변경된 본딩 목록 업데이트
    setModifiedBonds(prev => [...prev, bondNic]);

    // 변경된 네트워크 목록 업데이트
    setModifiedNAs(prev => [
      ...prev.filter(na => !slaveNames.includes(na.hostNicVo.name)),
      ...transferredNetworks  
    ]);

    
    setDragItemFlag(true);
    setIsBondingPopup(false);
    toast({ description: "본딩과 함께 네트워크가 이동되었습니다." });
  }, [baseItems.nic, baseItems.networkAttachment]);


  /**
   * 드래그 중인 항목을 특정 위치에 놓았을 때 호출. 실제로 항목을 옮기는 로직을 수행
   * 항목을 놓으면 현재 드래그 항목(dragItem)과 놓는 위치(dragOverTarget)를 기준으로 상태를 업데이트
   * 기존 배열에서 항목을 제거하고 대상 배열로 이동
   * @param {*} e 
   * @param {*} targetDestination 
   * @param {*} nicId 
   * @param {*} nicName 
   * @returns 
   */
  const handleDrop = (e, targetDestination, nic) => {
    e.preventDefault();
    if (!dragItem) return;

    const { item, type, list, parentBond } = dragItem;

    // 인터페이스
    if (type === "nic") {
      if (list === "slave" && targetDestination === "bond") {
        handleDropBond(item, parentBond); // "본딩 해제" - slave NIC를 baseNic로 이동시키기
      } else if (list === "nic" && targetDestination === "bond") {
        handleAddBonding(item, nic); // 본딩 생성
      }
    }

    // 네트워크
    if (type === "network") {
      if (list === "attach" && targetDestination === "detach") {
        handleDropUnassignedNetworkToNic(item, nic); // nic에 할당되지 않은 네트워크를 할당
      } else if (list === "detach" && targetDestination === "detach") {
        handleDropBetweenNetworkToNic(item, nic);    // 할당되어 있는 네트워크 간 이동
      } else if (list === "detach" && targetDestination === "attach") {
        handleDropAssignedNetworkToUnassigned(item);            // 할당되어 있는 네트워크를 해제
      }
    }

    setDragItem(null);
  };
  
  return (
    <>
    <div className="w-full">
      <SnapshotHostBackground className="split-outer f-btw w-full">
        {/* 작업 탭 */}
        <div className="split-item split-item-two-thirds"
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
            }
          }}
        >
          <div className="row group-span mb-4 items-center">
            <div className="col-40 fs-16">인터페이스</div>
            <div className="col-20"></div>
            <div className="col-40 fs-16">할당된 논리 네트워크</div>
          </div>
          <br/>

          {transNicData.map((nic) => {
            const matchedNAs = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(
              (na) => na.hostNicVo?.name === nic.name
            );
            return (
              <div className="row group-span mb-4 items-center" key={nic.id} >
                {/* 인터페이스 */}
                <div className="col-40" onDragOver={(e) => e.preventDefault()}>
                  {nic.bondingVo?.slaveVos?.length > 0 
                    ? <BondNic
                        nic={nic}
                        dragItem={dragItem}
                        handleDragStart={handleDragStart}
                        handleAddBaseNicToBond={handleAddBaseNicToBond}
                        setSelectedNic={setSelectedNic}
                        editBondingData={tossEditBondingData}
                      />
                    : <BaseNic
                        nic={nic}
                        handleDragStart={handleDragStart}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                      />
                  }
                </div>

                {/* 화살표 */}
                <div className="col-20 flex justify-center items-center">
                  {matchedNAs.length > 0 && ( <RVI24 iconDef={rvi24CompareArrows()} className="icon" />)}
                </div>

                {/* 할당된 논리 네트워크 */}
                <div className="col-40 fs-18 network-stack">
                  {matchedNAs.length > 0 ? (
                    matchedNAs.map((na) => (
                      <React.Fragment key={`${nic.id}-${na.networkVo?.id}`}>
                        <MatchNetwork
                          networkAttach={na}
                          nic={nic}
                          handleDrop={handleDrop}
                          handleDragOver={handleDragOver}
                          handleDragStart={handleDragStart}
                          setSelectedNetwork={setSelectedNetwork}
                          editNetworkAttachmentData={tossEditNetworkAttachmentData}
                        />
                      </React.Fragment>
                    ))
                  ) : (
                    <NoneNetwork
                      nic={nic}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                    />
                  )}
                </div>
              </div>
              
            );
          })}
          <div className="header-right-btns">
          {/* 변경항목이 있다면 활성화 */}
          {!cancelFlag && dragItemFlag && (
            <>
              <ActionButton actionType="default"  
                label={Localization.kr.OK} 
                className="custom-ok-button mr-3"
                onClick={handleFormSubmit} // 버튼 클릭시 네트워크 업데이트
              />
              <ActionButton actionType="default"
                label={Localization.kr.CANCEL}
                className="custom-ok-button"
                onClick={() => resetState()}
              />
            </>
          )}
          {cancelFlag && (
            <ActionButton actionType="default"
              label={Localization.kr.CANCEL}
              onClick={() => resetState()}
            />
          )}

        {/* <span>{networkAttachmentModalState.inSync === true ?"T":"F"}</span>           */}
          </div>
        </div>

        {/* 할당되지않은 네트워크 */}
        <div className="split-item split-item-one-third detachNetworkArea"
          onDragOver={(e) => handleDragOver(e, "network", "attach")}
          onDrop={(e) => handleDrop(e, "attach")}
        >
          <div className="unassigned-network text-center mb-4">
            <span className="fs-16">할당되지 않은 논리 네트워크</span>
          </div>
          <FilterButtons
            options={filterOptions}
            activeOption={networkFilter}
            onClick={setNetworkFilter}
          />
          <br/>
          {[...baseItems.network, ...movedItems.network]
            .filter(network => {
              if (networkFilter === 'required') return network.required;
              if (networkFilter === 'optional') return !network.required;
              return true;
            })
            .map(network => (
              <ClusterNetworkList
                key={network.id}
                network={network}
                handleDragStart={handleDragStart}
              />
          ))}
        </div>
      </SnapshotHostBackground>
      {/* <LabelCheckbox id="connection" label={`${Localization.kr.HOST}와 Engine간의 연결을 확인`}
        value={connection}
        onChange={(e) => setConnection(e.target.checked)}
      />
      <LabelCheckbox id="networkSetting" label={`${Localization.kr.NETWORK} 설정 저장`}
        value={setting}
        onChange={(e) => setSetting(e.target.checked)}
      /> */}
      
    <br/>
      
    </div>
      <Suspense fallback={<Loading />}>
        <HostBondingModal
          editMode={isBondingEditMode}
          isOpen={isBondingPopup}
          onClose={() => {setIsBondingPopup(false)}}
          bondModalState={bondModalState}
          setBondModalState={setBondModalState}
          onBondingCreated={createBondingData}
          existingBondNames={
            [...baseItems.nic, ...movedItems.nic].map(nic => nic.name)
          }
        />
        <HostNetworkEditModal
          isOpen={isNetworkEditPopup}
          onClose={() => setIsNetworkEditPopup(false)}
          networkModalState={networkAttachmentModalState}
          setNetworkModalState={setNetworkAttachmentModalState}
          onNetworkEdit={editNetworkData}
        />
      </Suspense>
    </>
  );
}

export default HostNics;
import React, { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import { useToast }            from "@/hooks/use-toast";
import useGlobal               from "@/hooks/useGlobal";
import {
  RVI16, rvi16TriangleDown, rvi16TriangleUp, rvi16VirtualMachine,
  RVI24, rvi24CompareArrows,
  RVI36, rvi36Edit,
  status2Icon
} from "@/components/icons/RutilVmIcons";
import Loading                 from "@/components/common/Loading";
import HostNetworkEditModal    from "@/components/modal/host/HostNetworkEditModal";
import HostBondingModal        from "@/components/modal/host/HostBondingModal";
import LabelCheckbox           from "@/components/label/LabelCheckbox";
import { ActionButton }        from "@/components/button/ActionButtons";
import {
  useHost,
  useNetworkAttachmentsFromHost,
  useNetworkFromCluster,
  useNetworkInterfacesFromHost,
  useSetupNetworksFromHost,
} from "@/api/RQHook";
import { checkZeroSizeToMbps } from "@/util";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";
import "./HostNic.css";
import BondNic from "./hostNics/BondNic";
import BaseNic from "./hostNics/BaseNic";
import MatchNetwork from "./hostNics/MatchNetwork";
import NoneNetwork from "./hostNics/NoneNetwork";
import ClusterNetworkList from "./hostNics/ClusterNetworkList";

const HostNics = ({
  hostId
}) => {
  const { toast } = useToast()
  const { hostsSelected } = useGlobal();

  const { data: host } = useHost(hostId);
  const { data: hostNics = [] } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));
  const { data: networkAttachments = [] } = useNetworkAttachmentsFromHost(hostId, (e) => ({ ...e }));
  const { data: networks = [] } = useNetworkFromCluster(host?.clusterVo?.id, (e) => ({ ...e }));  // 할당되지 않은 논리 네트워크 조회
  const { mutate: setupNetwork } = useSetupNetworksFromHost();

  // 모달 오픈 관리
  const [isBondingPopup, setIsBondingPopup] = useState(false);   // 본딩 모달 오픈
  const [editBondingMode, setEditBondingMode] = useState(false); // 본딩 편집모드
  const [isNetworkEditPopup, setIsNetworkEditPopup] = useState(false);  // 네트워크 편집 모달 오픈

  // 변경 정보
  const [modifiedBonds, setModifiedBonds] = useState([]); // 생성/수정 본딩
  const [removeBonds, setRemoveBonds] = useState([]);     // 삭제 본딩
  const [modifiedNAs, setModifiedNAs] = useState([]);     // 연결 네트워크
  const [removeNAs, setRemoveNAs] = useState([]);         // 삭제 네트워크

  // checkbox
  const [connection, setConnection] = useState(false); // 호스트와 Engine간의 연결을 확인
  const [setting, setSetting] = useState(false); // 네트워크 설정 저장

  // 선택된 항목
  const [selectedNic, setSelectedNic] = useState(null);
  const [selectedBond, setSelectedBond] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  
  // 드래그
  const [dragItemFlag, setDragItemFlag] = useState(false);    // 변경항목 있는지 확인
  const [cancelFlag, setCancelFlag] = useState(false);        // 취소 버튼만
  const [dragItem, setDragItem] = useState(null);             // 드래그 되는 항목 { item, type, list('attach', 'detach'), parentBond }
  const [dragOverTarget, setDragOverTarget] = useState(null); // 드래그 되는 대상 { targetType, targetDestination }


  // 초기 값
  const [baseItems, setBaseItems] = useState({
    nic: [...hostNics],
    networkAttachment: [...networkAttachments],
    network: [...networks]
  });
  // 변경 값
  const [movedItems, setMovedItems] = useState({ 
    nic: [], 
    networkAttachment: [], 
    network: [] 
  });

  // hostNics를 id로 빠르게 찾을 수 있는 Map으로 변환
  const nicMap = useMemo(() => {
    return hostNics.reduce((map, nic) => {
      map[nic.id] = nic;
      return map;
    }, {});
  }, [hostNics]);


  // 네트워크 인터페이스 목록
  const transNicData =  [...baseItems.nic]
    .sort((a, b) => { return a.name.localeCompare(b.name) }) //이름 기준 정렬
    .filter(nic => {
      // slave에 항목이 있으면 basicNic에서 필터링
      return !(baseItems.nic.some(parent =>
        parent.bondingVo?.slaves?.some(slave => slave.id === nic.id)
      ));
    })
    .map((e) => ({
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
    })
  );
  
  // 할당된 네트워크
  const transNAData = [...networkAttachments]
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
  
  // 할당되지 않은 논리 네트워크 (할당되어 있는 네트워크는 할당되지 않는 논리 네트워크에서 제외)
  const transDetachNetworkData = [...networks]
    .filter(net => !new Set(networkAttachments.map(na => na.networkVo?.id)).has(net.id))
    .map((e) => ({
      id: e?.id,
      name: e?.name,
      status: e?.status || "NON_OPERATIONAL",
      vlan: e?.vlan,
      required: e?.required ? "필수" : "필수X",
      usageVm: e?.usage?.vm ? true : false
    })
  );

  // 편집중이 아닐 때만!
  useEffect(() => {
    if (!dragItemFlag && hostNics.length > 0 && networkAttachments.length >= 0 && networks.length >= 0) {
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
      setDragOverTarget(null);
      setModifiedBonds([]);
      setRemoveBonds([]);
      setModifiedNAs([]);
      setRemoveNAs([]);
    }
    // eslint-disable-next-line
  }, [hostId, hostNics, networkAttachments, networks]);
  
  // movedItems 하나라도 항목이 있으면 버튼 활성화
  useEffect(() => {
    setDragItemFlag(Object.values(movedItems).some(list => list.length > 0));
    // if(baseItems.networkAttachment.length === 0 && movedItems.networkAttachment.length === 0){
    //   setDragItemFlag(false);
    //   setCancelFlag(true);
    // }
  }, [movedItems]);

  const validateForm = () => {
    
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }

    const hostNetworkVo = {
      bonds: modifiedBonds.map(bond => ({
        name: bond.name,
        bondingVo: {
          slaves: bond.bondingVo.slaves.map(slave => ({ name: slave.name }))
        }
      })),
      bondsToRemove: removeBonds.map(bond => ({
        name: bond.name
      })),
      networkAttachments: modifiedNAs.map(na => ({
        networkVo: { id: na.networkVo.id },
        hostNicVo: { name: na.hostNicVo.name },
        ipAddressAssignments: []
      })),
      networkAttachmentsToRemove: removeNAs.map(na => ({
        id: na.id,
      }))

    };

    Logger.debug(`hostSetup handleFormSubmit ... dataToSubmit: `, hostNetworkVo); // 데이터 출력
    setupNetwork({ hostId: hostId, hostNetworkVo: hostNetworkVo });

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
  };

  // 네트워크를 추가하거나 이동시킬 때 호출되는 함수
  const updateModifiedNAs = (hostNicVo, networkVo) => {
    setModifiedNAs(prev => {
      const existingEntry = prev.find(entry => entry.hostNicVo.name === hostNicVo.name);
        if (existingEntry) {
          // 이미 존재하는 경우, 네트워크 이름 추가
          return prev.map(entry =>
            entry.hostNicVo.name === hostNicVo.name
              ? {
                  ...entry,
                  networkVo: Array.isArray(entry.networkVo)
                    ? [...entry.networkVo, networkVo]
                    : [entry.networkVo, networkVo]
                }
              : entry
          );
        } else {
          // 신규 항목인 경우, 배열로 초기화
          return [...prev, { hostNicVo, networkVo }];
        }
      });
    };


  /**
   * 
   * @param {*} e 
   * @param {*} item 
   * @param {*} type 
   * @param {*} list 
   * @param {*} parentBond 
   */
  // 항목 드래그 시작 시 호출, 어떤 항목을 드래그하는지 상태(dragItem)에 저장
  // item: 드래그 중인 요소, type: 항목 유형, list: 출발지 유형('attach', 'detach')
  const handleDragStart = (e, item, type, list, parentBond = null) => {
    setDragItem({ item, type, list, parentBond }); // parentBond: slave의 경우만 전달
    e.dataTransfer.effectAllowed = 'move';
  };

  /**
   * 
   * @param {*} e 
   * @param {*} targetType 
   * @param {*} targetDestination 
   */
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

  // vlan 검사 함수
  const isVlanLess = (vlan) => vlan === undefined || vlan === 0;
  const hasVlanConflict = (networkVlan, nicId) => {
    const existingNAList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => na.hostNicVo?.id === nicId);
    return isVlanLess(networkVlan) && existingNAList.some(na => isVlanLess(na.networkVo?.vlan));
  };
  
  // networkAttachment 찾는 함수
  const findNetworkAttachment = (networkId) => {
    return baseItems.networkAttachment.find(na => na.networkVo.id === networkId)
      ?? movedItems.networkAttachment.find(na => na.networkVo.id === networkId);
  };

  /**
   * 
   * @param {*} draggedNetwork 
   * @param {*} nicId 
   * @param {*} nicName 
   * @returns 
   */
  // 할당되지 않은 네트워크 → NIC에 할당
  const handleDropUnassignedNetworkToNic = (draggedNetwork, nicId, nicName) => {    
    if (hasVlanConflict(draggedNetwork.vlan, nicId)) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: "이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.",
      });
      return
    }

    // 드래그 되며 표시될 정보 지정
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
    setBaseItems(prev => ({ 
      ...prev, 
      network: prev.network.filter(n => n.id !== draggedNetwork.id) 
    })); 

    // 변경된 항목에 드래그된 항목 표시 추가
    setMovedItems(prev => ({
      ...prev,
      networkAttachment: [...prev.networkAttachment, newAttachment], 
      network: prev.network.filter(n => n.id !== draggedNetwork.id),
    }));

    // 변경될 네트워크 목록에 값 추가
    updateModifiedNAs(newAttachment.hostNicVo, newAttachment.networkVo);
    setDragItemFlag(true);
  };


  /**
   * 할당된 네트워크 간 이동
   * @param {*} draggedNetwork 
   * @param {*} nicId 
   * @param {*} nicName 
   * @returns 
   */
  const handleDropBetweenNetworkToNic = (draggedNetwork, nicId, nicName) => {
    // 드래그 된 네트워크
    const draggedNA = findNetworkAttachment(draggedNetwork.id);
    if (!draggedNA) return;

    // 같은 NIC에 연결된 상태라면 드롭 무시
    if (draggedNA.hostNicVo.id === nicId) {
      return;
    }

    if (hasVlanConflict(draggedNetwork.vlan, nicId)) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: "이미 VLAN이 없는 네트워크가 이 인터페이스에 연결되어 있습니다.",
      });
      return;
    }

    const updatedNA = {
      ...draggedNA,
      hostNicVo: { id: nicId, name: nicName },
    };

    // 기존 할당된 네트워크에서 제외된 항목 필터링
    setBaseItems(prev => ({
      ...prev, 
      networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetwork.id)
    }));

    // 새로 할당된 네트워크 항목 추가
    setMovedItems(prev => ({
      ...prev,
      networkAttachment: [...prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetwork.id), updatedNA],
    }));

    // 변경될 네트워크 목록에 값 추가
    setModifiedNAs(prev => [...prev, updatedNA]);
    toast({ description: "handleDropBetweenNetworkToNic" });
  };


  /**
   * 할당된 네트워크를 해제 (할당되지 않은 상태로 이동)
   * @param {*} draggedNetwork 
   * @returns 
   */
  const handleDropAssignedNetworkToUnassigned = (draggedNetwork) => {
    // 드래그 된 네트워크. draggedNetwork.id는 networkVo.id를 의미함
    const draggedNA = findNetworkAttachment(draggedNetwork.id);
    if (!draggedNA) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: "삭제할 네트워크 연결 정보를 찾을 수 없습니다.",
      });
      return;
    }

    const originalNetworkData = networks.find(net => net.id === draggedNetwork.id) || {};

    // 할당되지 않은 네트워크로 들어갈 값
    const restoredNetwork = {
      id: draggedNetwork.id,
      name: draggedNetwork.name,
      status: originalNetworkData?.status || "NON_OPERATIONAL",
      vlan: originalNetworkData?.vlan,
      required: originalNetworkData?.required ? "필수" : "필수X",
      usageVm: originalNetworkData?.usage?.vm || false,
    };

    // --- 상태 업데이트 로직 ---
    // 지정된 할당된 네트워크에서 드래그 항목 제외
    setBaseItems(prev => ({
      ...prev,
      // networkVo.id 기준으로 필터링하는 것이 맞음
      networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetwork.id)
    }));

    // 변경된 목록에 값 추가
    setMovedItems(prev => ({
      ...prev,
      // networkVo.id 기준으로 필터링하는 것이 맞음
      networkAttachment: prev.networkAttachment.filter(na => na.networkVo.id !== draggedNetwork.id),
      network: [...prev.network, restoredNetwork], // UI 표시용 restoredNetwork 추가
    }));

    // *** 여기가 핵심 수정 ***
    // 지워질 네트워크 할당 목록에는 실제 Network Attachment의 ID를 가진 객체를 추가
    // setRemoveNAs(prev => [...prev, restoredNetwork]); // 이전 코드 (문제 발생)
    setRemoveNAs(prev => [...prev, { id: draggedNA.id }]); // 수정된 코드: draggedNA.id 사용!

    setDragItemFlag(true);
    // 디버깅을 위해 draggedNA.id를 로깅
    toast({ description: `Network Attachment ID to remove: ${draggedNA.id}`});
    toast({ description: "handleDropAssignedNetworkToUnassigned" });
  };


  /**
   * NIC 본딩 생성을 위한 드롭(baseNic를 다른 baseNic로 드래그)
   * @param {*} dragged 
   * @param {*} targetId 
   * @returns 
   */
  const handleAddBonding = (dragged, targetId) => {
    const sourceNic = baseItems.nic.find(n => n.id === dragged.id); // 드래그 대상
    const targetNic = baseItems.nic.find(n => n.id === targetId);  // 타겟 대상

    if (!targetNic || !sourceNic || sourceNic.id === targetNic.id) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: "유효하지 않은 본딩 대상입니다.",
      });
      return;
    }

    const isAlreadyBonded = nic => nic.name.startsWith("bond") || (nic.bondingVo?.slaves?.length > 0);
    if (isAlreadyBonded(sourceNic) || isAlreadyBonded(targetNic)) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: "이미 본딩된 NIC는 다시 본딩할 수 없습니다.",
      });
      return;
    }

    // VLAN 없는 네트워크 검사
    const findNoVlanNetwork = (nicId) => {
      const naList = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(na => na.hostNicVo?.id === nicId);
      return naList.some(na => !na.networkVo?.vlan || na.networkVo.vlan === 0);
    };

    // 해당 nic가 vlan 네트워크를 가지고 있는지 검사
    const sourceHasNoVlan = findNoVlanNetwork(sourceNic.id);
    const targetHasNoVlan = findNoVlanNetwork(targetNic.id);

    if (sourceHasNoVlan && targetHasNoVlan) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: "하나의 인터페이스에 둘 이상의 비 VLAN 네트워크를 사용할 수 없습니다.",
      });
      return;
    }    
    setSelectedBond({
      nic1: {
        ...sourceNic,
        networks: baseItems.networkAttachment.filter(na => na.hostNicVo?.id === sourceNic.id),
      },
      nic2: {
        ...targetNic,
        networks: baseItems.networkAttachment.filter(na => na.hostNicVo?.id === targetNic.id),
      }
    });

    setEditBondingMode(false); // 본딩 생성 모드
    setIsBondingPopup(true);   // 본딩 모달 오픈
    toast({ description: "handleDropNicForBonding" });
  };


  /**
   * 본딩된 항목에 basenic 추가
   * @param {*} dragged 
   * @param {*} targetBond 
   * @returns 
   */
  const handleAddBaseNicToBond = (dragged, targetBond) => {
    if (dragged.name.startsWith("bond") || (dragged.bondingVo?.slaves?.length > 0)) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: "이미 본딩된 NIC는 추가할 수 없습니다.",
      });
      return;
    }

    setBaseItems(prev => {
      const bondIndex = prev.nic.findIndex(n => n.name === targetBond.name);
      if (bondIndex === -1) return prev;

      // 기존 slaves 복제 및 baseNic 추가
      const oldBond = prev.nic[bondIndex];
      const updatedSlaves = [
        ...(oldBond.bondingVo?.slaves || []),
        {
          id: dragged.id,
          name: dragged.name,
          status: dragged.status,
          macAddress: dragged.macAddress,
        }
      ];

      const updatedBond = {
        ...oldBond,
        bondingVo: {
          ...oldBond.bondingVo,
          slaves: updatedSlaves,
        }
      };

      // 기존 NIC 리스트에서 baseNic 빼고, bondNic 업데이트
      const newNics = prev.nic
        .filter(n => n.id !== dragged.id)
        .map(n => n.name === targetBond.name ? updatedBond : n);

      return { 
        ...prev, 
        nic: newNics, 
        // networkAttachment: // 이미 할당되어 있는 네트워크가 있다면 같이 연결
        // networks:
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
          slaves: [
            ...(updatedBond.bondingVo?.slaves || []),
            {
              id: dragged.id,
              name: dragged.name,
              status: dragged.status,
              macAddress: dragged.macAddress,
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
    //  여기도 네트워크 항목이 들어가야함
    setDragItemFlag(true);
    toast({ description: `${dragged.name}을(를) ${targetBond.name} 본딩에 추가했습니다.` });
    toast({ description: 'handleAddBaseNicToBond' });
  };

  /**
   * 본딩 해제 
   * @param {*} slaveNic 
   * @param {*} parentBond 
   */
  const handleDropBond = (slaveNic, parentBond) => {
    const allSlaves = parentBond.bondingVo.slaves || [];

    // 1. 본딩에 연결된 Network Attachments 찾기
    const bondNetworks = [...baseItems.networkAttachment, ...movedItems.networkAttachment]
      .filter(na => na.hostNicVo?.id === parentBond.name || na.hostNicVo?.name === parentBond.name);

    // 본딩에 2개만 있으면 본딩 자체를 해제(=모두 base NIC로)
    if (allSlaves.length <= 2) {
      setBaseItems(prev => {
        const newBaseNics = allSlaves
          .filter(s => !new Set(prev.nic.map(n => n.id)).has(s.id))
          .map(s => ({
            id: s.id,
            name: s.name,
            status: s.status,
            macAddress: s.macAddress,
            bondingVo: { activeSlave: null, slaves: [] }
          }));

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

        return {
          ...prev,
          nic: [
            ...prev.nic.filter(nic => nic.name !== parentBond.name),
            ...newBaseNics
          ],
          networkAttachment: prev.networkAttachment.filter(na =>
            na.hostNicVo?.id !== parentBond.name && na.hostNicVo?.name !== parentBond.name
          ),
          network: [...prev.network, ...restoredNetworks]
        };
      });

      setRemoveBonds(prev => [...prev, { id: parentBond.id, name: parentBond.name }]);

      // *** 여기가 질문하신 내용의 핵심 구현부 ***
      // 본딩에 연결되어 있던 Network Attachment들도 삭제 목록(`removeNAs`)에 추가
      const naIdsToRemove = bondNetworks.map(na => ({ id: na.id })); // 각 NA의 고유 ID를 사용
      setRemoveNAs(prev => [...prev, ...naIdsToRemove]);
      toast({ description: `Following NAs will be removed: ${naIdsToRemove.map(n=>n.id).join(', ')}` }); // 디버깅용


      setDragItemFlag(true);
      toast({ description: "본딩 해제되어 각각의 NIC로 분리되었습니다. 할당된 네트워크는 해제되었습니다." });
    } else { // 3개 이상이면 해당 NIC만 본딩에서 분리하고 bond는 남김
      const remainSlaves = allSlaves.filter(s => s.id !== slaveNic.id);

      setBaseItems(prev => {
        const newBaseNics = !new Set(prev.nic.map(n => n.id)).has(slaveNic.id) ? [{
          id: slaveNic.id,
          name: slaveNic.name,
          status: slaveNic.status,
          macAddress: slaveNic.macAddress,
          bondingVo: { activeSlave: null, slaves: [] }
        }] : [];

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

      setModifiedBonds(prev => prev.map(bond =>
        bond.name === parentBond.name
          ? { ...bond, bondingVo: { ...bond.bondingVo, slaves: remainSlaves } }
          : bond
      ));
      setDragItemFlag(true);
      toast({ description: "선택한 NIC만 본딩에서 해제되었습니다."}); 
    }
  };

  

  /**
   * 본딩 시도시 열릴 모달에 들어갈 값
   */
  const createBondingData = useCallback((newBond, nicData) => {
    const slaveIds = newBond.bondingVo.slaves.map(s => s.id);
    const slavesDetail = baseItems.nic.filter(nic => slaveIds.includes(nic.id)).map(nic => ({
      id: nic.id,
      name: nic.name,
      status: nic.status,
      macAddress: nic.macAddress,
    }));

    const bondNic = {
      name: newBond.name,  // 본딩 이름 (예: bond1)
      bondingVo: { slaves: slavesDetail },
    };

    // 기존 NIC의 네트워크 목록을 본딩 NIC에 연결하기 위한 처리
    const transferredNetworks = nicData.flatMap(nic =>
      nic.networks?.map(network => {
        // 네트워크 id가 없으면 networks 배열에서 찾아서 넣기
        let original = networks.find(n => n.name === network.name || n.id === network.id);
        return {
          ...network,
          hostNicVo: { id: bondNic.name, name: bondNic.name },
          networkVo: {
            ...network.networkVo,
            id: network.networkVo?.id || original?.id,
          },
        }
      }) || []
    );


    setBaseItems(prev => {
      const newNicList = prev.nic.filter(nic => !slaveIds.includes(nic.id));

      const updatedNetworkAttachments = prev.networkAttachment
        .filter(na => !slaveIds.includes(na.hostNicVo?.id))  // 기존 NIC에 연결된 네트워크 제외
        .concat(transferredNetworks);  // 새 본딩 NIC으로 네트워크 옮김

      return {
        ...prev,
        nic: [...newNicList, bondNic],
        networkAttachment: updatedNetworkAttachments
      };
    });

    // 변경된 본딩 목록 업데이트
    setModifiedBonds(prev => [...prev, bondNic]);

    // 변경된 네트워크 목록 업데이트
    setModifiedNAs(prev => [
      ...prev,
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
  const handleDrop = (e, targetDestination, nicId = null, nicName = null) => {
    e.preventDefault();
    if (!dragItem) return;

    const { item, type, list, parentBond } = dragItem;

    // 인터페이스
    if (type === "nic") {
      if (list === "slave" && targetDestination === "bond") {
        handleDropBond(item, parentBond, nicId, nicName); // "본딩 해제" - slave NIC를 baseNic로 이동시키기
      } else if (list === "nic" && targetDestination === "bond") {
        handleAddBonding(item, nicId); // 본딩 생성
      }
    }

    // 네트워크
    if (type === "network") {
      if (list === "attach" && targetDestination === "detach") {
        handleDropUnassignedNetworkToNic(item, nicId, nicName); // nic에 할당되지 않은 네트워크를 할당
      } else if (list === "detach" && targetDestination === "detach") {
        handleDropBetweenNetworkToNic(item, nicId, nicName);    // 할당되어 있는 네트워크 간 이동
      } else if (list === "detach" && targetDestination === "attach") {
        handleDropAssignedNetworkToUnassigned(item);            // 할당되어 있는 네트워크를 해제
      }
    }

    setDragItem(null);
    setDragOverTarget(null);
  };
  
  return (
    <>
    <div className="w-[90%]">
      <div className="header-right-btns">
        {/* 변경항목이 있다면 활성화 */}
        {dragItemFlag && (
          <>
            <ActionButton actionType="default" 
              label={Localization.kr.UPDATE} 
              onClick={handleFormSubmit} // 버튼 클릭시 네트워크 업데이트
            />
            <ActionButton actionType="default"
              label={Localization.kr.CANCEL}
              onClick={() => {
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
            // const matchedNAs = baseItems.networkAttachment.filter(
            //   (na) => 
            //     (na.hostNicVo?.id && na.hostNicVo.id === nic.id) || (!na.hostNicVo?.id && na.hostNicVo?.name === nic.name)
            // ).concat(
            //   movedItems.networkAttachment.filter(
            //     (na) => 
            //       (na.hostNicVo?.id && na.hostNicVo.id === nic.id)|| (!na.hostNicVo?.id && na.hostNicVo?.name === nic.name)
            //   )
            // );
            const matchedNAs = [...baseItems.networkAttachment, ...movedItems.networkAttachment].filter(
              (na) => na.hostNicVo?.id === nic.id || na.hostNicVo?.name === nic.name
            );


            return (
              <div className="row group-span mb-4 items-center" key={nic.id} >
                
                {/* 인터페이스 */}
                <div className="col-40 fs-18" 
                  onDragOver={(e) => e.preventDefault()}
                >
                  {nic.bondingVo?.slaves?.length > 0 
                    ? <BondNic
                        nic={nic}
                        dragItem={dragItem}
                        handleDragStart={handleDragStart}
                        setSelectedNic={setSelectedNic}
                        setEditBondingMode={setEditBondingMode}
                        setIsBondingPopup={setIsBondingPopup}
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
                  {matchedNAs.length > 0 && (
                    <RVI24 iconDef={rvi24CompareArrows()} className="icon" />
                  )}
                </div>

                {/* 할당된 논리 네트워크 */}
                <div className="col-40 fs-18 network-stack">
                  {matchedNAs.length > 0 ? (
                    matchedNAs.map((na) => (
                      <React.Fragment key={`${nic.id}-${na.networkVo?.id}`}>
                        <MatchNetwork
                          networkAttach={na}
                          nicId={nic.id}
                          nicName={nic.name}
                          handleDrop={handleDrop}
                          handleDragOver={handleDragOver}
                          handleDragStart={handleDragStart}
                          setSelectedNetwork={setSelectedNetwork}
                          setIsNetworkEditPopup={setIsNetworkEditPopup}
                        />
                      </React.Fragment>
                    ))
                  ) : (
                    <NoneNetwork
                      nicId={nic.id}
                      nicName={nic.name}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                    />
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
              <ClusterNetworkList net={net} handleDragStart={handleDragStart}/>
           )}
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

      {/* <br/>
      <span>modifiedBonds: {modifiedBonds.map((e) => `[${e.name}: ${e.bondingVo.slaves.map((s) => s?.name)}]`)}</span><br/>
      <span>removeBonds: {removeBonds.map((e) => `${e.name}, `)}</span><br/>
      <span>modifiedNAs: {modifiedNAs.map(e => `[${e.hostNicVo.name}: ${Array.isArray(e.networkVo) ? e.networkVo.map(net => net.name).join(", ") : e.networkVo.name}]`)}</span><br/>
      <span>removeNAs: {removeNAs.map((e) => `${e.name}, `)}</span><br/>
      <br/> */}
      
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
          nicData={
            editBondingMode 
            ? selectedNic ? [selectedNic] : []
            : selectedBond
              ? [
                  {
                    ...selectedBond.nic1,
                    networks: [...baseItems.networkAttachment, ...movedItems.networkAttachment]
                      .filter(na => na.hostNicVo.id === selectedBond.nic1.id)
                  },
                  {
                    ...selectedBond.nic2,
                    networks: [...baseItems.networkAttachment, ...movedItems.networkAttachment]
                      .filter(na => na.hostNicVo.id === selectedBond.nic2.id)
                  }
                ]
              : []
          }
          onBondingCreated={createBondingData}
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
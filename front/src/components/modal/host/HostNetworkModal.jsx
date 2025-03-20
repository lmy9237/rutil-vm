import React, { useState, useRef, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAltH, faDesktop, faPencilAlt,} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import HostNetworkBondingModal from "./HostNetworkBondingModal";
import HostNetworkEditModal from "./HostNetworkEditModal";
import { useHost, useNetworkFromCluster, useNetworkInterfaceFromHost } from "../../../api/RQHook";
import "../network/MNetwork.css";
import Loading from "../../common/Loading";
import { renderTFStatusIcon } from "../../Icon";

const HostNetworkModal = ({ isOpen, onClose, hostId }) => {
  // 호스트 상세정보 조회로 클러스터id 뽑기
  const { data: host } = useHost(hostId);
  
  const { data: hostNics } = useNetworkInterfaceFromHost(hostId, (e) => ({
    ...e,
    name: e?.name,
    ipv4BootProtocol: e?.bootProtocol,
    ipv4Address: e?.ip?.address,
    ipv4Gateway: e?.ip?.gateway,
    ipv4Netmask: e?.ip?.netmask,
    ipv6BootProtocol: e?.ipv6BootProtocol,
    ipv6Address: e?.ipv6?.address,
    ipv6Gateway: e?.ipv6?.gateway,
    ipv6Netmask: e?.ipv6?.netmask,
    status: e?.status || "",
    bondingVo: {
      ...e?.bondingVo,
      slaves: e?.bondingVo?.slaves?.map((slave) => ({
        id: slave.id,
        name: slave.name,
      })),
    },
  }));
  
  // 할당되지 않은 논리 네트워크 조회
  const { data: network } = useNetworkFromCluster(host?.clusterVo?.id, (network) => ({
    id: network?.id ?? "",
    name: network?.name ?? "",
    status: network?.status ?? "",
    vlan: network?.vlan,
    role: network?.usage?.vm, 
  }));

  // 본딩 리스트 (본딩 설정되면 이곳에 본딩정보가 담김)
  const [modifiedBondList, setModifiedBondList] = useState([]);

  // 네트워크 연결 리스트
  const [modifiedNetworkList, setModifiedNetworkList] = useState([]);

  // 네트워크 인터페이스 및 Bonding 정보를 저장하는 배열
  const [outer, setOuter] = useState([]);
  
  const [selectedBonding, setSelectedBonding] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  // const [contextMenu, setContextMenu] = useState(null);
  const [isBondingPopupOpen, setIsBondingPopupOpen] = useState(false);
  const [isNetworkEditPopupOpen, setIsNetworkEditPopupOpen] = useState(false);
  
  // 본딩 모달 열기
  const openBondingPopup = (bond) => {
    setSelectedBonding(bond); // 선택한 본딩 정보 저장
    setIsBondingPopupOpen(true);
  }; 
  
  // 네트워크 편집 모달 열기
  const openNetworkEditPopup = (network) => {
    setSelectedNetwork(network); // 선택한 네트워크 정보 저장
    setIsNetworkEditPopupOpen(true);
  };

  useEffect(() => {
    if (hostNics) {
      setOuter(
        hostNics.map((nic) => ({
          id: nic.id,
          name: nic.bondingVo?.slaves?.length > 1 ? nic?.name : "",
          children: nic.bondingVo?.slaves?.length > 0 ? nic.bondingVo.slaves : [{ id: nic.id, name: nic.name }],
          networks: nic.networkVo?.id ? [{ id: nic.networkVo.id, name: nic.networkVo.name }] : [],
        }))
      );
    }
  }, [hostNics]);

  const assignedNetworkIds = outer.flatMap((outerItem) =>outerItem.networks.map((net) => net.id));
  const availableNetworks = network?.filter((net) => !assignedNetworkIds.includes(net.id));
  
  // 드래그하는 요소를 추적
  const dragItem = useRef(null);  

  // 드래그 시작할 때 선택된 아이템과 출처 저장.
  const dragStart = (e, item, source, parentId = null) => { dragItem.current = { item, source, parentId } };

  // 드롭된 대상에 따라 네트워크 할당, 본딩 생성 등의 처리
  const drop = (targetId, targetType) => {
    if (!dragItem.current) return;
    const { item, source, parentId } = dragItem.current;
  
    if (source === "container" && targetType === "interface") {
      if (parentId === targetId) {
        alert("같은 Interface 내에서는 이동할 수 없습니다.");
        dragItem.current = null;
        return;
      }
  
      setOuter((prevOuter) => {
        let validMove = true;
        let bondRequired = false; // Bonding이 필요한 경우 플래그
  
        const updatedOuter = prevOuter.map((outerItem) => {
          if (outerItem.id === parentId) {
            if ( outerItem.networks.length > 0 && outerItem.children.length === 1 ) {
              alert("Container를 이동할 수 없습니다. 연결된 네트워크가 있고 container가 하나뿐입니다.");
              validMove = false;
              return outerItem;
            }
            return {
              ...outerItem,
              children: outerItem.children.filter((child) => child.id !== item.id),
            };
          }
  
          if (outerItem.id === targetId) {
            const targetHasBond = outerItem.name.startsWith("bond"); // bond 그룹인지 확인
            const targetHasMultipleChildren = outerItem.children.length > 1; // 이미 2개 이상 container가 있는지
            const targetHasNetwork = outerItem.networks.length > 0; // 네트워크가 걸려 있는지
          
            if (targetHasBond && targetHasMultipleChildren) {
              // Bonding이 이미 있고, 여러 개의 container가 존재하면 그냥 추가
              return {
                ...outerItem,
                children: [...outerItem.children, item],
              };
            } else if (targetHasBond && !targetHasMultipleChildren && targetHasNetwork) {
              // Bond 내에 하나의 container만 있고 네트워크가 걸려 있다면 이동 불가
              alert("Container를 이동할 수 없습니다. 연결된 네트워크가 있고 container가 하나뿐입니다.");
              validMove = false;
              return outerItem;
            } else {
              // Bonding이 없는 상태에서 단일 container끼리 합칠 때 본딩 필요
              bondRequired = true;
            }          
            // 본딩이 필요하든 아니든, container는 무조건 추가해야 함
            return {
              ...outerItem,
              children: [...outerItem.children, item],
            };
          }
          
          return outerItem;
        });
  
        if (bondRequired) {
          openBondingPopup("create"); // Bonding 모달 띄우기
        }
  
        return validMove ? updatedOuter : prevOuter;
      });
    } else if (source === "unassigned" && targetType === "networkOuter") {
      // 네트워크를 인터페이스에 추가
      setOuter((prevOuter) =>
        prevOuter.map((outerItem) => {
          if (outerItem.id === targetId) {
            if (outerItem.networks.length > 0) {
              alert("1개의 네트워크만 걸 수 있습니다.");
              return outerItem;
            }
            return { ...outerItem, networks: [...outerItem.networks, item] };
          }
          return outerItem;
        })
      );
      
    } else if (source === "networkOuter" && targetType === "unassigned") {
      // 네트워크를 할당 해제 (Unassigned로 이동)
      setOuter((prevOuter) => prevOuter.map((outerItem) => {
        if (outerItem.id === parentId) {
          return {
            ...outerItem,
            networks: outerItem.networks.filter((network) => network.id !== item.id),
          };
        }
        return outerItem;
      }).filter(
        (outerItem) => outerItem.children.length > 0 || outerItem.networks.length > 0) // Remove empty outer
      );
      
    } else if (source === "networkOuter" && targetType === "networkOuter") {
      // 네트워크를 다른 인터페이스로 이동
      setOuter((prevOuter) => prevOuter.map((outerItem) => {
        if (outerItem.id === parentId) {
          return {
            ...outerItem,
            networks: outerItem.networks.filter( (network) => network.id !== item.id ),
          };
        }
        if (outerItem.id === targetId) {
          if (outerItem.networks.length > 0) {
            alert("1개의 네트워크만 걸 수 있습니다.");
            return outerItem;
          }
          return {
            ...outerItem,
            networks: [...outerItem.networks, item],
          };
        }
      return outerItem;
      }));
    }
    dragItem.current = null; // Reset drag state
  };

  const handleFormSubmit = () => {
    
    const dataToSubmit = {
      // 본딩과 네트워크 정보가 들어갈 예정
      // diskAttachmentVos: diskListState.map((disk) => ({
      //   id: disk?.id || "",
      //   active: true,
      //   bootable: disk?.bootable,
      //   readOnly: disk?.readOnly,
      //   passDiscard: false,
      //   interface_: disk?.interface_,
      //   diskImageVo: {
      //     id: disk?.id || "", // 기존 디스크 ID (새 디스크일 경우 빈 문자열)
      //     size: disk?.size * 1024 * 1024 * 1024, // GB → Bytes 변환
      //     alias: disk?.alias,
      //     description: disk?.description || "",
      //     storageDomainVo: { id: disk?.storageDomainVo?.id || "" },
      //     diskProfileVo: { id: disk?.diskProfileVo?.id || "" },
      //     sparse: disk?.sparse,
      //     wipeAfterDelete: disk?.wipeAfterDelete || false,
      //     sharable: disk?.sharable || false,
      //     backup: disk?.backup || false,
      //   },
      // })),
    };

    // const onSuccess = () => {
    //   onClose();
    //   toast.success(`호스트 네트워크 설정 완료`);
    // };
    // const onError = (err) => toast.error(`Error 호스트 네트워크: ${err}`);

    // console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그

    // editHost(
    //   { hostId: formState.id, hostData: dataToSubmit },
    //   { onSuccess, onError }
    // )
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"호스트 네트워크"}
      submitTitle={"설정"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "880px"}} 
    >
      <div className="py-3 font-bold underline"></div>
      <div className="host-network-separation f-btw">
        <div className="network-separation-left">
          <div className ="f-btw">
            <div>인터페이스</div>
            <div>할당된 논리 네트워크</div>
          </div>

          {outer
            .filter(outerItem => outerItem.children.length > 0 || outerItem.networks.length > 0)
            .map((outerItem) => (
              <div key={outerItem.id} className="separation-left-content">
                <div 
                  key={outerItem.id} 
                  className="interface" 
                  onDragOver={(e) => e.preventDefault()} 
                  onDrop={() => drop(outerItem.id, "interface")}
                > 
                  {outerItem.name && (
                    <div className="interface-header">
                      {outerItem.name} {outerItem.name.startsWith("bond") && (
                        <FontAwesomeIcon icon={faPencilAlt} className="icon" onClick={() => openBondingPopup("edit")} />
                      )}
                    </div>
                  )}
                  <div className="children">
                    {outerItem.children.map((child) => (
                      <div 
                        key={child.id} 
                        className="container" 
                        draggable 
                        onDragStart={(e) => dragStart(e, child, "container", outerItem.id)}
                      >
                        {child.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 화살표 */}
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faArrowsAltH} style={{color: "grey", width: "5vw", fontSize: "20px", }} />
                </div>

                <div className="assigned-network-outer">
                  <div 
                    className="outer-networks" 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={() => drop(outerItem.id, "networkOuter")}
                  >
                    {outerItem.networks.length === 0 ? (
                      <div className="assigned-network"><span>할당된 네트워크 없음</span></div>
                    ) : (
                      outerItem.networks.map(network => (
                        <div 
                          key={network.id} 
                          className="center" 
                          draggable 
                          onDragStart={(e) => dragStart(e, network, "networkOuter", outerItem.id)}
                        >
                          <div className="left-section">
                            {renderTFStatusIcon(network?.status==="OPERATIONAL")}{network.name}
                          </div>
                          <div className="right-section">
                            {network?.role && <FontAwesomeIcon icon={faDesktop} className="icon" />}
                            <FontAwesomeIcon icon={faPencilAlt} className="icon" onClick={() => openNetworkEditPopup(network)} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        <div
          className="network-separation-right"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => drop(null, "unassigned")}
        >
          <div className ="f-btw">
            <div>할당되지 않은 논리 네트워크</div>
          </div>
        
          {availableNetworks?.map((net) => (
            <div
              key={net.id}
              className="network-item"
              draggable
              onDragStart={(e) => dragStart(e, net, "unassigned")}
            >
              <div className="flex items-center justify-center">
                {renderTFStatusIcon(net?.status==="OPERATIONAL")}{net?.name}<br/>
                {net?.vlan === 0 ? "":`(VLAN ${net?.vlan})` }
              </div>
            </div>
          ))}
        </div>
      </div>
      <Suspense fallback={<Loading/>}>
        {/* 네트워크쪽 연필 추가모달 */}
        {isNetworkEditPopupOpen && selectedNetwork && (
          <HostNetworkEditModal
            isOpen={isNetworkEditPopupOpen}
            onClose={() => setIsNetworkEditPopupOpen(false)}
            network={selectedNetwork}
          />
        )}
        {/* 본딩 */}
        {isBondingPopupOpen && selectedBonding && (
          <HostNetworkBondingModal
            isOpen={isBondingPopupOpen}
            editmode
            onClose={() => setIsBondingPopupOpen(false)}
          />
        )}
      </Suspense>

    </BaseModal>
  );
};

export default HostNetworkModal;

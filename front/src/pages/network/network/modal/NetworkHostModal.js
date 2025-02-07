import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAltH, faBan, faCheck, faCrown, faDesktop, faExclamationTriangle, faFan, faPencilAlt, faPlay, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../css/MNetwork.css";
import { useHost, useNetworkFromCluster } from "../../../../api/RQHook";
import NewBondingModal from "./NewBondingModal";
import NetworkHostPlusModal from "./NetworkHostPlusModal";

const NetworkHostModal = ({ isOpen, onRequestClose, nicData, hostId }) => {
  const dragItem = useRef(null);

  // 호스트상세정보 조회로 클러스터id 뽑기
  const { data: host } = useHost(hostId);

  // 클러스터id로 네트워크정보조회
  const { data: network } = useNetworkFromCluster(host?.clusterVo?.id, (network) => {
    return {
      id: network?.id ?? '',
      name: network?.name ?? 'Unknown',
      status: network?.status ?? '',
      role: network?.role ? <FontAwesomeIcon icon={faCrown} fixedWidth /> : '',
      description: network?.description ?? 'No description',
    };
  });
  const clusterId = host?.clusterVo?.id;

  useEffect(() => {
    if (!hostId) {
      console.error("hostId가 없습니다. 요청을 건너뜁니다.");
    } else {
      console.log("hostId:", hostId);
    }
  }, [hostId]);

  useEffect(() => {
    if (!clusterId) {
      console.error("클러스터 ID가 없습니다. 요청을 건너뜁니다.");
    } else {
      console.log("클러스터 ID:", clusterId);
    }
  }, [clusterId]);
  

  //연필모달
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const openSecondModal = () => setIsSecondModalOpen(true);
  // Bonding Modal 상태 관리
  const [isBondingModalOpen, setIsBondingModalOpen] = useState(false);
  const [bondingMode, setBondingMode] = useState(null); // 모달창에서 사용할 모드 설정
  const openBondingModal = (mode) => {
    setBondingMode(mode);
    setIsBondingModalOpen(true);
  };
  const closeBondingModal = () => {
    setBondingMode(null);
    setIsBondingModalOpen(false);
  };

  useEffect(() => {
    if (network) {
      console.log("클러스터에 대한 네트워크 정보:", network);
    }
  }, [network]);
  useEffect(() => {
    if (nicData) {
      console.log("nicData  정보:", nicData);
    }
  }, [nicData]);


  // Outer 생성
  const [outer, setOuter] = useState(() => {
    let bondCounter = 0; // bond 이름을 위한 카운터
    return (
      nicData?.map((nic) => ({
        id: nic.id || `outer${bondCounter + 1}`,
        name: nic.bondingVo?.slaves?.length > 1 ? `bond${bondCounter++}` : "", // bond 이름 설정
        children: nic.bondingVo?.slaves?.length > 0
          ? nic.bondingVo.slaves.map((slave) => ({ id: slave.id, name: slave.name }))
          : [{ id: nic.id, name: nic.name }],
        networks: nic.networkVo?.id
          ? [{ id: nic.networkVo.id, name: nic.networkVo.name }]
          : [],
      })) || []
    );
  });

  // Interfaces 생성
  const [unassignedInterface, setUnassignedInterface] = useState(
    nicData?.map((nic) => ({
      id: nic.id,
      name: nic.name,
      children: nic.bondingVo?.slaves?.length > 0
        ? nic.bondingVo.slaves.map((slave) => ({ id: slave.id, name: slave.name }))
        : [{ id: nic.id, name: nic.name }], // slaves가 없으면 nic의 name 사용
    })) || []
  );



  // Networks in Outer 생성
  const [unassignedNetworksOuter, setUnassignedNetworksOuter] = useState(
    nicData?.map((nic) => ({
      id: nic.networkVo?.id || `network${nic.id}`,
      name: nic.networkVo?.name || `Unassigned Network for ${nic.name}`,
      children: [],
    })) || []
  );

  // Networks 설정 (기존 데이터 유지)
  const [unassignedNetworks, setUnassignedNetworks] = useState([
    { id: "networkcontent2", name: "Network content B" },
    { id: "networkcontent3", name: "Network content C" },
    { id: "networkcontent4", name: "Network content D" },
  ]);
  useEffect(() => {
    console.log("nicData:", nicData);
    console.log("Outer State:", outer);
    console.log("Unassigned Interface State:", unassignedInterface);
  }, [nicData, outer, unassignedInterface]);
  const dragStart = (e, item, source, parentId = null) => {
    dragItem.current = { item, source, parentId };
  };

  const drop = (targetId, targetType) => {
    const { item, source, parentId } = dragItem.current;
  
    if (source === "container" && targetType === "interface") {
      if (parentId === targetId) {
        alert("같은 Interface 내에서는 이동할 수 없습니다.");
        dragItem.current = null; // Reset drag state
        return;
      }
  
      setOuter((prevOuter) => {
        let validMove = true;
  
        const updatedOuter = prevOuter
          .map((outerItem) => {
            if (outerItem.id === parentId) {
              // Check if the container is the only one left and a network is assigned
              if (outerItem.networks.length > 0 && outerItem.children.length === 1) {
                alert("Container를 이동할 수 없습니다. 연결된 네트워크가 있고 container가 하나뿐입니다.");
                validMove = false; // Invalid move, abort further updates
                return outerItem;
              }
              // Remove the item from the source interface
              return {
                ...outerItem,
                children: outerItem.children.filter((child) => child.id !== item.id),
              };
            }
            if (outerItem.id === targetId) {
              // Check if both `outerItem` and `parentId` contain 1 container each
              const sourceOuter = prevOuter.find((o) => o.id === parentId);
              if (
                sourceOuter &&
                sourceOuter.children.length === 1 &&
                outerItem.children.length === 1
              ) {
                // Check if both have networks assigned
                if (sourceOuter.networks.length > 0 && outerItem.networks.length > 0) {
                  alert("Container를 이동할 수 없습니다. 연결된 네트워크가 있고 container가 하나뿐입니다.");
                  validMove = false; // Do not allow the move
                  return outerItem;
                }
                openBondingModal("create"); // Open bonding modal in create mode
                validMove = false; // Prevent the move until bonding is resolved
                return outerItem;
              }
              // Add the item to the target interface
              return {
                ...outerItem,
                children: [...outerItem.children, item],
              };
            }
            return outerItem;
          })
          .filter((outerItem) => outerItem.children.length > 0 || outerItem.networks.length > 0); // Remove empty outer
  
        return validMove ? updatedOuter : prevOuter;
      });
    } else if (source === "unassigned" && targetType === "networkOuter") {
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
      setUnassignedNetworks((prev) => prev.filter((net) => net.id !== item.id));
    } else if (source === "networkOuter" && targetType === "unassigned") {
      setOuter((prevOuter) =>
        prevOuter
          .map((outerItem) => {
            if (outerItem.id === parentId) {
              return {
                ...outerItem,
                networks: outerItem.networks.filter((network) => network.id !== item.id),
              };
            }
            return outerItem;
          })
          .filter((outerItem) => outerItem.children.length > 0 || outerItem.networks.length > 0) // Remove empty outer
      );
      setUnassignedNetworks((prev) => [...prev, item]); // Add back to unassigned
    } else if (source === "networkOuter" && targetType === "networkOuter") {
      // Move network from one outer to another
      setOuter((prevOuter) =>
        prevOuter.map((outerItem) => {
          if (outerItem.id === parentId) {
            // Remove the network from the source outer
            return {
              ...outerItem,
              networks: outerItem.networks.filter((network) => network.id !== item.id),
            };
          }
          if (outerItem.id === targetId) {
            // Add the network to the target outer
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
        })
      );
    }
  
    dragItem.current = null; // Reset drag state
  };
  
  
  
  
  const renderNetworkOuter = (outerItem) => {
    if (outerItem.networks.length === 0) {
      return (
        <div
          className="outer-networks"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => drop(outerItem.id, "networkOuter")}
        >
          <div className="assigned-network">
            <div className="left-section">
              <span className="text">할당된 네트워크가 없음</span>
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div
        className="outer-networks"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => drop(outerItem.id, "networkOuter")}
      >
        {outerItem.networks.map((network) => (
          <div
            key={network.id}
            className="center"
            draggable
            onDragStart={(e) => dragStart(e, network, "networkOuter", outerItem.id)}
          >
            <div className="left-section">{network.name}</div>
            <div className="right-section">
              <FontAwesomeIcon icon={faFan} className="icon" />
              <FontAwesomeIcon icon={faDesktop} className="icon" />
              <FontAwesomeIcon icon={faDesktop} className="icon" />
              <FontAwesomeIcon icon={faBan} className="icon" />
              <FontAwesomeIcon icon={faExclamationTriangle} className="icon" />
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="icon"
                onClick={openSecondModal}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  
  
  const renderInterface = (interfaceItem) => (
    <div
      key={interfaceItem.id}
      className="interface"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => drop(interfaceItem.id, "interface")}
    >
      {/* Bond 이름 표시 및 연필 아이콘 추가 */}
      {interfaceItem.name && (
        <div className="interface-header">
          {interfaceItem.name}
          {interfaceItem.name.startsWith("bond") && (
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="icon"
              onClick={() => openBondingModal("edit")} // 편집 모드로 NewBondingModal 열기
              style={{ marginLeft: "0.5rem", cursor: "pointer" }}
            />
          )}
        </div>
      )}
      <div className="children">
        {interfaceItem.children.map((child) => (
          <div
            key={child.id}
            className="container"
            draggable
            onDragStart={(e) => dragStart(e, child, "container", interfaceItem.id)}
          >
            {child.name}
          </div>
        ))}
      </div>
    </div>
  );
  
  
  const renderUnassignedNetworks = () => {
    const assignedNetworkIds = outer.flatMap((outerItem) =>
      outerItem.networks.map((net) => net.id)
    );
  
    const availableNetworks = network?.filter(
      (net) => !assignedNetworkIds.includes(net.id)
    );
  
    return availableNetworks?.map((net) => (
      <div
        key={net.id}
        className="network-item"
        draggable
        onDragStart={(e) => dragStart(e, net, "unassigned")}
   
      >
        <div className="flex items-center justify-center">
          <FontAwesomeIcon
            icon={net.status === "UP" ? faPlay : faPlay}
            style={{ color: net.status === "UP" ? "red" : "green",  fontSize: '0.3rem', transform: 'rotate(270deg)', marginRight:'0.3rem'}}
          />
          {net.name}
        </div>
        
        
      </div>
    ));
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="호스트 네트워크 설정"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="host-nework-content-popup modal">
        <div className="popup-header">
          <h1>호스트 네트워크 설정</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="host-network-outer">
          <div className="py-1 font-bold underline">드래그 하여 변경</div>
          <div className="host-network-separation">
          <div className="network-separation-left">
        <div>
          <div>인터페이스</div>
          <div>할당된 논리 네트워크</div>
        </div>

        {outer.map((outerItem) => (
          <div key={outerItem.id} className="separation-left-content">
            {/* Render Interface */}
            {renderInterface(outerItem)}

            <div className="flex items-center justify-center">
              <FontAwesomeIcon
                icon={faArrowsAltH}
                style={{ color: "grey", width: "5vw", fontSize: "0.6rem" }}
              />
            </div>

            {/* Render Networks for Each Interface */}
            <div className="assigned-network-outer">
              <div className="outer-networks">{renderNetworkOuter(outerItem)}</div>
            </div>
          </div>
        ))}

</div>


            {/* Unassigned Networks */}
            <div
              className="network_separation_right"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(null, "unassigned")}
            >
              {renderUnassignedNetworks()}
            </div>


          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: "none" }}></button>
          <button>OK</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>


        {/*네트워크쪽 연필 추가모달 */}
        <NetworkHostPlusModal
          isOpen={isSecondModalOpen}
          onClose={() => setIsSecondModalOpen(false)}
          initialSelectedTab="ipv4"
        />
        {/*본딩 */}
        <NewBondingModal
          isOpen={isBondingModalOpen}
          onClose={closeBondingModal}
          mode={bondingMode}
        />
    </Modal>
  );
};

export default NetworkHostModal;

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ComputingTree from "./tree/ComputingTree";
import NetworkTree from "./tree/NetworkTree";
import StorageTree from "./tree/StorageTree";
import useUIState from "../../hooks/useUIState";
import NetworkModals from "../modal/network/NetworkModals";
import DataCenterModals from "../modal/datacenter/DataCenterModals";
import DomainModals from "../modal/domain/DomainModals";
import ClusterModals from "../modal/cluster/ClusterModals";

const SidebarTree = ({ selected }) => {
  const location = useLocation();
  const {
    tmiLastSelected, setTmiLastSelected
  } = useUIState()

  // 📌 대시보드, 이벤트, 설정이면 lastSelected 값으로 변경
  const sectionToRender = ["dashboard", "event", "settings"].includes(selected) ? tmiLastSelected : selected;

  // ✅ 상태 관리
  const [selectedDiv, setSelectedDiv] = useState(null);

  const getBackgroundColor = (id) => {
    return location.pathname.includes(id) ? "rgb(218, 236, 245)" : "";
  };
  const getPaddingLeft = (hasChildren, basePadding = "1rem", extraPadding = "0.6rem") => {
    return hasChildren ? extraPadding : basePadding;
  };

// 우클릭박스
const menuRef = useRef(null); // ✅ context menu 영역 참조
const [contextMenu, setContextMenu] = useState(null);
const openContextMenu = (e, item, treeType) => {
  e.preventDefault();
  setContextMenu({
    mouseX: e.clientX,
    mouseY: e.clientY,
    item,
    treeType, // 예: "network", "storage", "computing"
  });
};

const closeContextMenu = () => setContextMenu(null);
useEffect(() => {
  const handleClickOutside = (e) => {
    // contextMenu가 열려 있고, 클릭한 곳이 menuRef 바깥이면 닫기
    if (contextMenu && menuRef.current && !menuRef.current.contains(e.target)) {
      setContextMenu(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [contextMenu]);
  
// 모달열기
const [activeModal, setActiveModal] = useState(null);
const [selectedNetworks, setSelectedNetworks] = useState([]);
const [selectedDataCenters, setSelectedDataCenters] = useState([]);
const [selectedDomains, setSelectedDomains] = useState([]);
const [selectedClusters, setSelectedClusters] = useState([]);


  return (
    <div className="aside-popup">
      {/* ✅ 가상머신 섹션 */}
      {sectionToRender === "computing" && 
      <>
        <ComputingTree
          selectedDiv={selectedDiv}
          setSelectedDiv={setSelectedDiv}
          getBackgroundColor={getBackgroundColor}
          getPaddingLeft={getPaddingLeft}
          onContextMenu={openContextMenu}      
          contextMenu={contextMenu}
          menuRef={menuRef}
          setActiveModal={setActiveModal}        
          setSelectedDataCenters={setSelectedDataCenters} 
          setSelectedClusters={setSelectedClusters} 
        />
        <ClusterModals
          activeModal={activeModal?.startsWith("cluster:") ? activeModal.split(":")[1] : null}
          selectedClusters={selectedClusters}
          cluster={activeModal?.startsWith("cluster:") && activeModal.includes("edit") ? selectedClusters[0] : null}
          datacenterId={selectedDataCenters[0]?.id}
          onClose={() => setActiveModal(null)}
        />
      </>
      }

      {/* ✅ 네트워크 섹션 */}
      {sectionToRender === "network" && (
        <>
        <NetworkTree 
          selectedDiv={selectedDiv} 
          setSelectedDiv={setSelectedDiv} 
          getBackgroundColor={getBackgroundColor}
          getPaddingLeft={getPaddingLeft}
          onContextMenu={openContextMenu} 
          contextMenu={contextMenu}      
          closeContextMenu={closeContextMenu}  
          menuRef={menuRef} 
          setActiveModal={setActiveModal}             
          setSelectedNetworks={setSelectedNetworks}  
          setSelectedDataCenters={setSelectedDataCenters} 
       />
        <NetworkModals
          activeModal={activeModal?.startsWith("network:") ? activeModal.split(":")[1] : null}
          selectedNetworks={selectedNetworks}
          network={activeModal?.startsWith("network:") && activeModal.includes("edit") ? selectedNetworks[0] : null}
          onClose={() => setActiveModal(null)}
        />
     </>
      )}

      {/* ✅ 스토리지 섹션 */}
      {sectionToRender === "storage" && (
        <>
          <StorageTree 
            selectedDiv={selectedDiv} 
            setSelectedDiv={setSelectedDiv} 
            getBackgroundColor={getBackgroundColor}
            getPaddingLeft={getPaddingLeft}
            onContextMenu={openContextMenu} 
            contextMenu={contextMenu}      
            closeContextMenu={closeContextMenu}  
            menuRef={menuRef} 
            setActiveModal={setActiveModal} 
            setSelectedDataCenters={setSelectedDataCenters}    
          />
          <DomainModals
            activeModal={activeModal?.startsWith("domain:") ? activeModal.split(":")[1] : null}
            selectedDomains={selectedDomains}
            domain={activeModal?.startsWith("domain:") && activeModal.includes("edit") ? selectedDomains[0] : null}
            onClose={() => setActiveModal(null)}
          />
        </>
      )}
      <DataCenterModals
        activeModal={activeModal?.startsWith("datacenter:") ? activeModal.split(":")[1] : null}
        selectedDataCenters={selectedDataCenters}
        dataCenter={activeModal?.startsWith("datacenter:") && activeModal.includes("edit") ? selectedDataCenters[0] : null}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default SidebarTree;

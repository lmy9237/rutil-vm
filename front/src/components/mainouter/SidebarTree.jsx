import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useUIState from "../../hooks/useUIState";
import useClickOutside from "../../hooks/useClickOutside";
import ComputingTree from "./tree/ComputingTree";
import NetworkTree from "./tree/NetworkTree";
import StorageTree from "./tree/StorageTree";
import NetworkModals from "../modal/network/NetworkModals";
import DataCenterModals from "../modal/datacenter/DataCenterModals";
import DomainModals from "../modal/domain/DomainModals";
import ClusterModals from "../modal/cluster/ClusterModals";
import DataCenterActionButtons from "../dupl/DataCenterActionButtons";
import ClusterActionButtons from "../dupl/ClusterActionButtons"
import NetworkActionButtons from "../dupl/NetworkActionButtons"
import DomainActionButtons from "../dupl/DomainActionButtons";
import Logger from "../../utils/Logger";
import HostActionButtons from "../dupl/HostActionButtons";

const SidebarTree = () => {
  const location = useLocation();
  const {
    tmiLastSelected, setTmiLastSelected,
    contextMenu, setContextMenu
  } = useUIState()

  // 📌 대시보드, 이벤트, 설정이면 lastSelected 값으로 변경
  // const sectionToRender = ["dashboard", "event", "settings"].includes(tmiLastSelected) ? tmiLastSelected;

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
  const openContextMenu = (e, item, treeType) => {
    Logger.debug(`SidebarTree > openContextMenu ... e.clientX: ${e.clientX}, e.clientY: ${e.clientY}, item: `, item)
    e.stopPropagation();
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      item,
      treeType,
    });
  };
  const closeContextMenu = () => setContextMenu(null);
  useClickOutside(menuRef, (e) => {
    setContextMenu(null);
  })
  
  // 모달열기
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDataCenters, setSelectedDataCenters] = useState([]);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [selectedHosts, setSelectedHosts] = useState([]);
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);

  return (
    <div className="aside-popup">
      {/* ✅ 가상머신 섹션 */}
      {(tmiLastSelected === "computing" || tmiLastSelected === "dashboard") && // 첫 로딩일 때 반응하도록 
        <>
          <ComputingTree
            setSelectedDiv={setSelectedDiv}
            contextMenu={contextMenu}
            menuRef={menuRef}
            setActiveModal={setActiveModal}            
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
      {tmiLastSelected === "network" && (
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
            // isContextDelete={activeModal?.includes("context")} 
          />
      </>
      )}

      {/* ✅ 스토리지 섹션 */}
      {tmiLastSelected === "storage" && (
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

      {/* 우클릭 context 메뉴 */}
      {contextMenu ? (
         <div className="right-click-menu-box context-menu-item"
          ref={menuRef}
          style={{
            position: "fixed",
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            background: "white",
            zIndex: "9999",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {(contextMenu?.item?.type === "dataCenter") ?
            <DataCenterActionButtons
              status="single"
              actionType="context"
              onCloseContextMenu={() => setContextMenu(null)}
              openModal={(action) => {
                setActiveModal?.(`datacenter:${action}`);
                setSelectedDataCenters?.([contextMenu.item]); 
                setContextMenu(null);    
              }}
            /> : 
          (contextMenu?.item?.type === "cluster") ? 
            <ClusterActionButtons
              isEditDisabled={false} // 필요 시 조건 지정 가능
              status={"ready"}       // 또는 contextMenu.item.status 등
              actionType="context"
              openModal={(action) => {
                setActiveModal?.(`cluster:${action}`);
                setSelectedClusters?.([contextMenu.item]);
                setContextMenu(null);
              }}
            /> : 
          (contextMenu?.item.type === "host") ? 
            <HostActionButtons
              isEditDisabled={false} // 필요 시 조건 지정 가능
              status={"ready"}       // 또는 contextMenu.item.status 등
              actionType="context"
              openModal={(action) => {
                setActiveModal?.(`host:${action}`);
                setSelectedHosts?.([contextMenu.item]);
                setContextMenu(null);
              }}
            /> : 
          (contextMenu?.item.type === "network") ? 
            <NetworkActionButtons              
              status={contextMenu.item?.status}
              actionType="context"
              openModal={(action) => {
                setActiveModal?.(`network:${action}`); 
                setSelectedNetworks?.([contextMenu.item]);    
                setContextMenu(null);
              }}
            />
            : 
          (contextMenu?.item.type === "domain") ? 
            <DomainActionButtons
              status={contextMenu?.item?.status}
              actionType="context"
              openModal={(action) => {
                setActiveModal?.(`domain:${action}`);
                setSelectedDomains?.([contextMenu.item]);  
                setContextMenu(null);
              }}
              isEditDisabled={contextMenu?.item?.status === "MAINTENANCE"}
              isDeleteDisabled={contextMenu?.item?.status === "LOCKED" || contextMenu?.item?.status === "ACTIVE"}
            /> : null
          }
        </div>
      ) : null}
    </div>
  );
};

export default SidebarTree;

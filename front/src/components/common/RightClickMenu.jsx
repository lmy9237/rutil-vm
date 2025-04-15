import React, { useEffect, useRef } from "react";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import useClickOutside from "../../hooks/useClickOutside";
import DataCenterModals from "../modal/datacenter/DataCenterModals";
import ClusterModals from "../modal/cluster/ClusterModals";
import NetworkModals from "../modal/network/NetworkModals";
import DomainModals from "../modal/domain/DomainModals";
import VmModals from "../modal/vm/VmModals";
import DataCenterActionButtons from "../dupl/DataCenterActionButtons";
import ClusterActionButtons from "../dupl/ClusterActionButtons"
import NetworkActionButtons from "../dupl/NetworkActionButtons"
import DomainActionButtons from "../dupl/DomainActionButtons";
import HostActionButtons from "../dupl/HostActionButtons";
import HostModals from "../modal/host/HostModals";
import VmActionButtons from "../dupl/VmActionButtons";
import Logger from "../../utils/Logger";

/**
 * @name RightClickMenu
 * @description 우클릭 했을 때 나오는 메뉴에 대한 모든 UI
 * 
 * @returns {JSX.Element} 화면
 */
const RightClickMenu = () => {
  const { 
    activeModal, setActiveModal,
    contextMenu, setContextMenu,
  } = useUIState()
  const { 
    datacentersSelected, setDatacentersSelected,
    clustersSelected, setClustersSelected,
    hostsSelected, setHostsSelected,
    networksSelected, setNetworksSelected,
    domainsSelected, setDomainsSelected,
    clearAllSelected,
  } = useGlobal()
  
  const menuRef = useRef(null); // ✅ context menu 영역 참조
  useClickOutside(menuRef, (e) => {
    if (!contextMenu()) {
      return;
    }
    setContextMenu(null);
    clearAllSelected()
  })

  Logger.debug(`RightClickMenu ... `)
  return (
    <>
      <DataCenterModals dataCenter={datacentersSelected[0] ?? null} />
      <ClusterModals cluster={clustersSelected[0] ?? null}
        // datacenterId={}  // TODO: 선택 된 호스트 모달의 datacenterId 찾기
      />
      <HostModals host={hostsSelected[0] ?? null}
        // clusterId={}  // TODO: 선택 된 호스트 모달의 clusterId 찾기
      /> 
      <NetworkModals 
        network={networksSelected[0] ?? null}
        // dcId={}  // TODO: 선택 된 호스트 모달의 datacenterId 찾기
      />
      <DomainModals
        domain={domainsSelected[0] ?? null}
        // datacenterId={}  // TODO: 선택 된 호스트 모달의 datacenterId 찾기
      />
      <VmModals
        vm={domainsSelected[0] ?? null}
      />
      {contextMenu() ? (
        <div id="right-click-menu-box"
          className="right-click-menu-box context-menu-item"
          ref={menuRef}
          style={{
            position: "fixed",
            top: contextMenu().mouseY,
            left: contextMenu().mouseX,
            background: "white",
            zIndex: "9999",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {(contextMenu()?.item?.type === "datacenter") ? (
            <DataCenterActionButtons actionType="context"
              status={"single"}
            />
          ) : (contextMenu()?.item?.type === "cluster") ? (
            <ClusterActionButtons actionType="context"
              isEditDisabled={false} // 필요 시 조건 지정 가능
              status={"ready"}       // 또는 contextMenu.item.status 등
            />
          ) : (contextMenu()?.item?.type === "host") ? 
            (<HostActionButtons actionType="context"
              isEditDisabled={false} // 필요 시 조건 지정 가능
              status={"ready"}       // 또는 contextMenu.item.status 등
            />
          ) : (contextMenu()?.item?.type === "network") ? 
            (<NetworkActionButtons actionType="context"
              status={contextMenu().item?.status}
            />
          ) : (contextMenu()?.item?.type === "domain") ? (
            <DomainActionButtons actionType="context"
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenu()?.item?.type === "vm") ? (
            <VmActionButtons actionType="context"
              status={contextMenu()?.item?.status}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default RightClickMenu;

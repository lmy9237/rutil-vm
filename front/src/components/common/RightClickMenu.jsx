import React, { useEffect, useMemo, useRef } from "react";
import useContextMenu from "../../hooks/useContextMenu";
import useGlobal from "../../hooks/useGlobal";
import useClickOutside from "../../hooks/useClickOutside";
import DataCenterModals from "../modal/datacenter/DataCenterModals";
import ClusterModals from "../modal/cluster/ClusterModals";
import HostModals from "../modal/host/HostModals";
import VmModals from "../modal/vm/VmModals";
import TemplateModals from "../modal/template/TemplateModals";
import NetworkModals from "../modal/network/NetworkModals";
import DomainModals from "../modal/domain/DomainModals";
import EventModals from "../modal/event/EventModals";
import SettingUsersModals from "../modal/settings/SettingUsersModals";

import DataCenterActionButtons from "../dupl/DataCenterActionButtons";
import ClusterActionButtons from "../dupl/ClusterActionButtons"
import HostActionButtons from "../dupl/HostActionButtons";
import VmActionButtons from "../dupl/VmActionButtons";
import TemmplateActionButtons from "../dupl/TemplateActionButtons";
import NetworkActionButtons from "../dupl/NetworkActionButtons"
import DomainActionButtons from "../dupl/DomainActionButtons";
import DiskActionButtons from "../dupl/DiskActionButtons";
import VmDiskActionButtons from "../dupl/VmDiskActionButtons";
import SettingUsersActionButtons from "../dupl/SettingUsersActionButtons"
import EventActionButtons from "../dupl/EventActionButtons"
import VmDiskModals from "../modal/vm/VmDiskModals";
import DiskModals from "../modal/disk/DiskModals";
import VnicProfileModals from "../modal/vnic-profile/VnicProfileModals";
import VmSnapshotModals from "../modal/vm/VmSnapshotModals";

/**
 * @name RightClickMenu
 * @description 우클릭 했을 때 나오는 메뉴에 대한 UI
 * 
 * @returns {JSX.Element} 화면
 */
const RightClickMenu = () => {
  const {
    contextMenu, contextMenuType, clearAllContextMenu
  } = useContextMenu()
  const { 
    datacentersSelected, // setDatacentersSelected,
    clustersSelected, // setClustersSelected,
    hostsSelected, // setHostsSelected,
    vmsSelected, // setVmsSelected,
    snapshotsSelected, // setSnapshotsSelected,
    templatesSelected, // setTemplatesSelected,
    networksSelected, // setNetworksSelected,
    vnicProfilesSelected, // setVnicProfilesSelected,
    domainsSelected, // setDomainsSelected,
    disksSelected, // setDisksSelected,
    eventsSelected, // setEventsSelected,
    usersSelected, // setUsersSelected,
    sourceContext,
    clearAllSelected,
  } = useGlobal()

  const contextTargets2Ignore = useMemo(() => ([ /* 우킄릭시 메뉴 제공되지 않는 기능대상 */
    "application",
    "iscsi",
    "fcp",
  ]), [])
  
  const menuRef = useRef(null); // ✅ context menu 영역 참조
  useClickOutside(menuRef, (e) => {
    if (contextMenu() !== null) {
      setTimeout(() => clearAllContextMenu(), 250)
    }
  })

  return (
    <>
      <DataCenterModals dataCenter={datacentersSelected[0] ?? null} />
      <ClusterModals cluster={clustersSelected[0] ?? null} />
      <HostModals host={hostsSelected[0] ?? null} />
      <VmModals vm={vmsSelected[0] ?? null} />
      <VmSnapshotModals snapshot={snapshotsSelected[0] ?? null} />
      <TemplateModals template={templatesSelected[0] ?? null} />
      <NetworkModals network={networksSelected[0] ?? null} />
      <VnicProfileModals vnicProfile={vnicProfilesSelected[0] ?? null} />
      <DomainModals domain={domainsSelected[0] ?? null} sourceContext={sourceContext} />
      <DiskModals disk={disksSelected[0] ?? null} />
      <VmDiskModals disk={disksSelected[0] ?? null} />
      <EventModals event={eventsSelected[0] ?? null}/>
      <SettingUsersModals user={usersSelected[0] ?? null} />
      {(contextMenu() !== null && 
        contextMenuType() !== null && 
        !contextTargets2Ignore.includes(contextMenuType())
      ) ? (
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
          {(contextMenuType() === "datacenter") ? (
            <DataCenterActionButtons actionType="context"
              status={"single"}
            />
          ) : (contextMenuType() === "cluster") ? (
            <ClusterActionButtons actionType="context"
              status={"ready"}
            />
          ) : (contextMenuType() === "host") ? (
            <HostActionButtons actionType="context"
              status={"ready"}
            />
          ) : (contextMenuType() === "vm") ? (
            <VmActionButtons actionType="context"
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "template") ? (
            <TemmplateActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "network") ? 
            (<NetworkActionButtons actionType={"context"} 
              status={contextMenu().item?.status}
            />
          ) : (contextMenuType() === "vnicprofile") ? 
            (<NetworkActionButtons actionType={"context"} 
              status={contextMenu().item?.status}
            />
          ) : (contextMenuType() === "domain") ? (
            <DomainActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "disk") ? (
            <DiskActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "vmdisk") ? (
            <VmDiskActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "user") ? (
            <SettingUsersActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "event") ? (
            <EventActionButtons actionType={"context"}
              status={contextMenu()?.item?.status}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default React.memo(RightClickMenu);

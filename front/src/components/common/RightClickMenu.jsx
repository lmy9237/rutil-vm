import React, { useMemo, useRef } from "react";
import useContextMenu                from "@/hooks/useContextMenu";
import useGlobal                     from "@/hooks/useGlobal";
import useClickOutside               from "@/hooks/useClickOutside";
import DataCenterModals              from "@/components/modal/datacenter/DataCenterModals";
import ClusterModals                 from "@/components/modal/cluster/ClusterModals";
import HostModals                    from "@/components/modal/host/HostModals";
import VmModals                      from "@/components/modal/vm/VmModals";
import VmDiskModals                  from "@/components/modal/vm/VmDiskModals";
import VmNicModals                   from "@/components/modal/vm/VmNicModals";
import TemplateModals                from "@/components/modal/template/TemplateModals";
import TemplateNicModals             from "@/components/modal/template/TemplateNicModals";
import VmSnapshotModals              from "@/components/modal/vm/VmSnapshotModals";
import DiskModals                    from "@/components/modal/disk/DiskModals";
import DiskSnapshotModals            from "@/components/modal/disk/DiskSnapshotModals";
import VnicProfileModals             from "@/components/modal/vnic-profile/VnicProfileModals";
import NetworkModals                 from "@/components/modal/network/NetworkModals";
import DomainModals                  from "@/components/modal/domain/DomainModals";
import DomainDataCenterModals        from "@/components/modal/domain/DomainDataCenterModals";
import EventModals                   from "@/components/modal/event/EventModals";
import JobModals                     from "@/components/modal/job/JobModals";
import SettingProviderModals        from "@/components/modal/settings/SettingProviderModals";
import SettingUsersModals            from "@/components/modal/settings/SettingUsersModals";
import SettingUserSessionsModal      from "@/components/modal/settings/SettingUserSessionsModal";
import SettingCertModals             from "@/components/modal/settings/SettingCertModals";

import RutilManagerActionButtons     from "@/components/dupl/RutilManagerActionButtons";
import DataCenterActionButtons       from "@/components/dupl/DataCenterActionButtons";
import ClusterActionButtons          from "@/components/dupl/ClusterActionButtons"
import HostActionButtons             from "@/components/dupl/HostActionButtons";
import VmActionButtons               from "@/components/dupl/VmActionButtons";
import VmDiskActionButtons           from "@/components/dupl/VmDiskActionButtons";
import VmNicActionButtons            from "@/components/dupl/VmNicActionButtons";
import TemplateActionButtons         from "@/components/dupl/TemplateActionButtons";
import TemplateNicActionbuttons      from "@/components/dupl/TemplateNicActionbuttons";
import NetworkActionButtons          from "@/components/dupl/NetworkActionButtons"
import DomainActionButtons           from "@/components/dupl/DomainActionButtons";
import DomainDataCenterActionButtons from "@/components/dupl/DomainDataCenterActionButtons";
import DiskActionButtons             from "@/components/dupl/DiskActionButtons";
import SettingUsersActionButtons     from "@/components/dupl/SettingUsersActionButtons"
import SettingCertActionButtons     from "@/components/dupl/SettingCertActionButtons";
import EventActionButtons            from "@/components/dupl/EventActionButtons"
import JobActionButtons              from "@/components/dupl/JobActionButtons";
import DiskSnapshotActionButtons     from "@/components/dupl/DiskSnapshotActionButtons";
import "./RightClickMenu.css"
import SettingProvidersActionButtons from "../dupl/SettingProvidersActionButtons";

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
    nicsSelected, // setNicsSelected
    eventsSelected, // setEventsSelected,
    jobsSelected, // setJobsSelected,
    providersSelected, // setProvidersSelected,
    usersSelected, // setUsersSelected,
    usersessionsSelected, // setUsersessionsSelected,
    sourceContext,
    clearAllSelected,
  } = useGlobal()

  const contextTargets2Ignore = useMemo(() => ([ /* 우킄릭시 메뉴 제공되지 않는 기능대상 */
    "application",
    "hostnic",
    "usersession", // 활성화 세션
    "disksnapshot", // NOTE: 삭제처리를 직접 하지 않음으로 기능 배제
    "hostdevice", // 호스트 장치
    "iscsi",
    "fcp",
  ]), [])
  
  const menuRef = useRef(null); // ✅ context menu 영역 참조
  useClickOutside(menuRef, (e) => {
    if (contextMenu() !== null && e.type !== "contextmenu") {
      setTimeout(() => clearAllContextMenu(), 0)
    }
  })
  const contextMenuStyleByPosition = () => (
    (contextMenu().mouseY+menuRef.current?.offsetHeight > window.innerHeight) ? {
      position: "fixed",
      background: "white",
      zIndex: "9999",
      bottom: contextMenu().mouseY - menuRef.current?.offsetHeight,
      left: contextMenu().mouseX,
    } : {
      position: "fixed",
      background: "white",
      zIndex: "9999",
      top: contextMenu().mouseY,
      left: contextMenu().mouseX,
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
      <DomainDataCenterModals />
      <DiskModals disk={disksSelected[0] ?? null} />
      <DiskSnapshotModals shot={snapshotsSelected[0] ?? null} />
      <VmDiskModals disk={disksSelected[0] ?? null} />
      <VmNicModals nic={nicsSelected[0] ?? null} />
      <TemplateNicModals nic={nicsSelected[0] ?? null} />
      <EventModals event={eventsSelected[0] ?? null}/>
      <JobModals job={jobsSelected[0] ?? null} />
      <SettingProviderModals provider={providersSelected[0] ?? null} /> 
      <SettingUsersModals user={usersSelected[0] ?? null} />
      <SettingUserSessionsModal usersession={usersessionsSelected[0] ?? null} />
      <SettingCertModals />
      {(contextMenu() !== null && 
        contextMenuType() !== null && 
        !contextTargets2Ignore.includes(contextMenuType())
      ) ? (
        <div id="right-click-menu-box"
          className="right-click-menu-box context-menu-item"
          ref={menuRef}
          style={contextMenuStyleByPosition()}
          onClick={(e) => e.stopPropagation()}
        >
          {(contextMenuType() === "rutil-manager") ? (
            <RutilManagerActionButtons actionType="context" 
            />
          ) : (contextMenuType() === "datacenter") ? (
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
            <TemplateActionButtons actionType={"context"} 
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
          ) : (contextMenuType() === "domaindatacenter") ? (
            <DomainDataCenterActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "disk") ? (
            <DiskActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "disksnapshot") ? (
            <DiskSnapshotActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "vmdisk") ? (
            <VmDiskActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "nic") ? (
            <VmNicActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "templatenic") ? ( 
            <TemplateNicActionbuttons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "provider") ? (
            <SettingProvidersActionButtons actionType={"context"}
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "user") ? (
            <SettingUsersActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "cert") ? (
            <SettingCertActionButtons actionType={"context"} 
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "event") ? (
            <EventActionButtons actionType={"context"}
              status={contextMenu()?.item?.status}
            />
          ) : (contextMenuType() === "job") ? (
            <JobActionButtons actionType={"context"}
              status={contextMenu()?.item?.status}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default React.memo(RightClickMenu);

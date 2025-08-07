import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import { openNewTab }          from "@/navigation";
import SectionLayout           from "@/components/SectionLayout";
import TabNavButtonGroup       from "@/components/common/TabNavButtonGroup";
import { rvi24Desktop }        from "@/components/icons/RutilVmIcons";
import HeaderButton            from "@/components/button/HeaderButton";
import Path                    from "@/components/Header/Path";
import VmGeneral               from "./VmGeneral";
import VmMonitor               from "./VmMonitor";
import VmNics2                 from "./VmNics2";
import VmSnapshots             from "./VmSnapshots";
import VmApplications          from "./VmApplications";
import VmHostDevices           from "./VmHostDevices";
import VmEvents                from "./VmEvents";
import VmDisks                 from "./VmDisks";
import {
  useAllSnapshotsFromVm,
  useVm
} from "@/api/RQHook";
import {
  refetchIntervalInMilli
} from "@/util";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";
import "./Vm.css";

/**
 * @name VmInfo
 * @description 가상머신 종합페이지
 * (/computing/vms)
 *
 * @param {string} hostId 호스트 ID
 *
 * @see VmGeneral
 * @see VmNics
 * @see VmDisks
 * @see VmSnapshots
 * @see VmApplications
 * @see VmHostDevices
 * @see VmEvents
 *
 * @returns
 */
const VmInfo = () => {
  const navigate = useNavigate();
  const {
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()
  const { setVmsSelected } = useGlobal()
  const { id: vmId, section } = useParams();
  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
    isRefetching: isVmRefetching,
    refetch: refetchVm,
  } = useVm(vmId);
  const { 
    data: snapshots = [] 
  } = useAllSnapshotsFromVm(vmId, (e) => ({ ...e }));

  const hasLockedSnapshot = useMemo(() => {
    return snapshots.some(s => s.status?.toLowerCase() === "locked".toLowerCase());
  }, [snapshots]);
  
  // const isUp = vm?.running ?? false;
  // const isDown = vm?.notRunning ?? false;
  const isUp = vm?.status?.toUpperCase() === "UP";
  const isDown = vm?.status?.toUpperCase() === "DOWN";
  const isPause = vm?.status?.toUpperCase() === "PAUSED" || vm?.status?.toUpperCase() === "SUSPENDED";
  const isRebootable = vm?.status?.toUpperCase() === "UP" || vm?.status?.toUpperCase() === "POWERING_UP";
  const isMaintenance = vm?.status?.toUpperCase() === "MAINTENANCE";
  const allOkay2PowerDown = vm?.qualified4PowerDown;
  const isVmQualified2Migrate = vm?.qualified2Migrate ?? false;
  const isVmQualified4ConsoleConnect = vm?.qualified4ConsoleConnect || false;
  
  const [activeTab, setActiveTab] = useState("general");
  const tabs = useMemo(() => {

    if (vm?.status === "up"){
      return [
        { id: "general",      label: Localization.kr.GENERAL,     onClick: () => handleTabClick("general") },
        { id: "monitor",      label: Localization.kr.MONITOR,     onClick: () => handleTabClick("monitor") },
        { id: "nics",         label: Localization.kr.NICS,        onClick: () => handleTabClick("nics") },
        { id: "disks",        label: Localization.kr.DISK,        onClick: () => handleTabClick("disks") },
        { id: "snapshots",    label: Localization.kr.SNAPSHOT,    onClick: () => handleTabClick("snapshots") },
        { id: "applications", label: Localization.kr.APPLICATION, onClick: () => handleTabClick("applications") },
        { id: "hostDevices",  label: Localization.kr.HOST_DEVICE, onClick: () => handleTabClick("hostDevices") },
        { id: "events",       label: Localization.kr.EVENT,       onClick: () => handleTabClick("events") },
      ];
    } else {
      return [
        { id: "general",      label: Localization.kr.GENERAL,     onClick: () => handleTabClick("general") },
        { id: "nics",         label: Localization.kr.NICS,        onClick: () => handleTabClick("nics") },
        { id: "disks",        label: Localization.kr.DISK,        onClick: () => handleTabClick("disks") },
        { id: "snapshots",    label: Localization.kr.SNAPSHOT,    onClick: () => handleTabClick("snapshots") },
        { id: "applications", label: Localization.kr.APPLICATION, onClick: () => handleTabClick("applications") },
        { id: "hostDevices",  label: Localization.kr.HOST_DEVICE, onClick: () => handleTabClick("hostDevices") },
        { id: "events",       label: Localization.kr.EVENT,       onClick: () => handleTabClick("events") },
      ]
    } 
  }, [vmId, vm?.status]);

  const pathData = useMemo(() => ([
    vm?.name,
    tabs.find((section) => section.id === activeTab)?.label,
  ]), [vm, tabs, activeTab]);

  // 탭 메뉴 관리
  const renderSectionContent = useCallback(() => {
    Logger.debug(`VmInfo > renderSectionContent ...`)
    const SectionComponent = {
      general: VmGeneral,
      monitor: VmMonitor,
      // nics: VmNics,
      nics: VmNics2,
      disks: VmDisks,
      snapshots: VmSnapshots,
      applications: VmApplications,
      hostDevices: VmHostDevices,
      events: VmEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent vmId={vmId} /> : null;
  }, [activeTab, vmId]);

  const sectionHeaderButtons = useMemo(() => ([
    { type: "update",    onClick: () => setActiveModal("vm:update"),        label: Localization.kr.UPDATE, },
    { type: "start",     onClick: () => setActiveModal("vm:start"),         label: Localization.kr.START,       disabled: !(isDown || isPause || isMaintenance) },
    { type: "pause",     onClick: () => setActiveModal("vm:pause"),         label: Localization.kr.PAUSE,       disabled: !isUp },
    { type: "reboot",    onClick: () => setActiveModal("vm:reboot"),        label: Localization.kr.REBOOT,      disabled: !isRebootable },
    { type: "reset",     onClick: () => setActiveModal("vm:reset"),         label: Localization.kr.RESET,       disabled: !isRebootable },
    { type: "shutdown",  onClick: () => setActiveModal("vm:shutdown"),      label: Localization.kr.END,         disabled: isDown, },
    { type: "powerOff",  onClick: () => setActiveModal("vm:powerOff"),      label: Localization.kr.POWER_OFF,   disabled: isDown  },
    { type: "console",   onClick: () => openNewTab("console", vmId),        label: Localization.kr.CONSOLE,     disabled: !isVmQualified4ConsoleConnect },
    { type: "snapshots", onClick: () => setActiveModal("vm:snapshot"),      label: `${Localization.kr.SNAPSHOT} ${Localization.kr.CREATE}`,                  disabled: !(isUp || isDown) || hasLockedSnapshot  },
    { type: "migration", onClick: () => setActiveModal("vm:migration"),     label: Localization.kr.MIGRATION, disabled: !isVmQualified2Migrate },
  ]), [vm, vmId, isUp, isDown, hasLockedSnapshot]);

  const popupItems = [
    /* { type: "import",  onClick: () => setActiveModal("vm:import"),       label: Localization.kr.IMPORT, }, */
    { type: "copyVm",    onClick: () => setActiveModal("vm:copy"),          label: `${Localization.kr.VM} 복제` },
    { type: "remove",    onClick: () => setActiveModal("vm:remove"),        label: Localization.kr.REMOVE, disabled: !isDown },
    { type: "templates", onClick: () => setActiveModal("vm:templates"),     label: `${Localization.kr.TEMPLATE} ${Localization.kr.CREATE}`, disabled: !isDown, }, 
    { type: "ova",       onClick: () => setActiveModal("vm:ova"),           label: `ova로 ${Localization.kr.EXPORT}`,  disabled: isPause, },
  ];

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`VmInfo > handleTabClick ... vmId: ${vmId}, tab: ${tab}`)
    const path = tab === "general"
      ? `/computing/vms/${vmId}` 
      : `/computing/vms/${vmId}/${tab}`;
    navigate(path);
    setTabInPage("/computing/vms", tab);
    setActiveTab(tab);
  }, [vmId]);

  useEffect(() => {
    Logger.debug(`VmInfo > useEffect ... section: ${section}`)
    setActiveTab(section || "general");
  }, [section]);

  //탭 유효성 체크 (만약 up인상태의 가상머신의 monitor탭에서 tree메뉴의 꺼진가상머신을 누르면 일반페이지로 가도록 설정)
  useEffect(() => {  
    Logger.debug(`VmInfo > useEffect ... (for Automatic Tab Switch)`)
    if (!vm || !activeTab) return;
    if (activeTab === "monitor" && vm.status?.toUpperCase() !== "UP") {
      handleTabClick("general");
    }
  }, [vm?.status, activeTab]);

  useEffect(() => {
    Logger.debug(`VmInfo > useEffect ... (for Automatic Tab Switch)`)
    if (isVmError || (!isVmLoading && !vm)) {
      navigate("/computing/vms");
    }
    const currentTabInPage = tabInPage("/computing/vms")
    handleTabClick(currentTabInPage === "" ? "general" : currentTabInPage);
    // setActiveTab(currentTabInPage === "" ? "general" : currentTabInPage);
    setVmsSelected(vm)
  }, [vm]);
  
  useEffect(() => {
    Logger.debug(`VmInfo > useEffect ... (for VM status check)`)
    if ([...activeModal()].length > 0) return // 모달이 켜져 있을 떄 조회 및 렌더링 일시적으로 방지
    const intervalInMilli = refetchIntervalInMilli(vm?.status)
    Logger.debug(`VmInfo > useEffect ... look for VM status (${vm?.status}) in ${intervalInMilli/1000} second(s)`)
    const intervalId = setInterval(() => {
      refetchVm()
    }, intervalInMilli) // 주기적 조회
    return () => {clearInterval(intervalId)}
  }, [vmId, vm, activeModal, setActiveModal])

  return (
    <SectionLayout>
      <HeaderButton title={vm?.name} titleIcon={rvi24Desktop()}
        status={Localization.kr.renderStatus(vm?.status)}
        isLoading={isVmLoading} isRefetching={isVmRefetching} refetch={refetchVm}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path pathElements={pathData} basePath={`/computing/vms/${vmId}`}/>
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default VmInfo;

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import { openNewTab } from "../../../navigation";
import SectionLayout from "../../../components/SectionLayout";
import TabNavButtonGroup from "../../../components/common/TabNavButtonGroup";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import VmGeneral from "./VmGeneral";
import VmNics from "./VmNics";
import VmSnapshots from "./VmSnapshots";
import VmApplications from "./VmApplications";
import VmHostDevices from "./VmHostDevices";
import VmEvents from "./VmEvents";
import VmDisks from "./VmDisks";
import { useVm } from "../../../api/RQHook";
import { rvi24Desktop } from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
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
  const { activeModal, setActiveModal, } = useUIState()
  const { id: vmId, section } = useParams();
  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
  } = useVm(vmId);
  const { setVmsSelected } = useGlobal()

  const isUp = vm?.status === "UP";
  const isDown = vm?.status === "DOWN";
  const isPause = vm?.status === "SUSPENDED";
  const isMaintenance = vm?.status === "MAINTENANCE";

  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (isVmError || (!isVmLoading && !vm)) {
      navigate("/computing/vms");
    }
    setVmsSelected(vm)
  }, [vm]);

  const tabs = useMemo(() => ([
    { id: "general",      label: Localization.kr.GENERAL,     onClick: () => handleTabClick("general") },
    { id: "nics",         label: Localization.kr.NICS,        onClick: () => handleTabClick("nics") },
    { id: "disks",        label: Localization.kr.DISK,        onClick: () => handleTabClick("disks") },
    { id: "snapshots",    label: Localization.kr.SNAPSHOT,    onClick: () => handleTabClick("snapshots") },
    { id: "applications", label: Localization.kr.APPLICATION, onClick: () => handleTabClick("applications") },
    { id: "hostDevices",  label: Localization.kr.HOST_DEVICE, onClick: () => handleTabClick("hostDevices") },
    { id: "events",       label: Localization.kr.EVENT,       onClick: () => handleTabClick("events") },
  ]), [vmId]);

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`VmInfo > handleTabClick ... vmId: ${vmId}`)
    const path = tab === "general"
      ? `/computing/vms/${vmId}` 
      : `/computing/vms/${vmId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [vmId]);

  const pathData = useMemo(() => ([
    vm?.name,
    tabs.find((section) => section.id === activeTab)?.label,
  ]), [vm, tabs, activeTab]);

    // 탭 메뉴 관리
  const renderSectionContent = useCallback(() => {
    Logger.debug(`VmInfo > renderSectionContent ...`)
    const SectionComponent = {
      general: VmGeneral,
      nics: VmNics,
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
    { type: "start",     onClick: () => setActiveModal("vm:start"),         label: Localization.kr.START, disabled: !(isDown || isPause || isMaintenance) },
    { type: "pause",     onClick: () => setActiveModal("vm:pause"),         label: Localization.kr.PAUSE, disabled: !isUp },
    { type: "reboot",    onClick: () => setActiveModal("vm:reboot"),        label: Localization.kr.REBOOT, disabled: !isUp },
    { type: "reset",     onClick: () => setActiveModal("vm:reset"),         label: Localization.kr.RESET, disabled: !isUp },
    { type: "shutdown",  onClick: () => setActiveModal("vm:shutdown"),      label: Localization.kr.END, disabled:!isUp, },
    { type: "powerOff",  onClick: () => setActiveModal("vm:powerOff"),      label: Localization.kr.POWER_OFF, disabled: !isUp  },
    { type: "console",   onClick: () => openNewTab("console", vmId),        label: Localization.kr.CONSOLE, disabled: !isUp },
    { type: "snapshots", onClick: () => setActiveModal("vm:snapshot"),      label: "스냅샷 생성", disabled: !(isUp || isDown) },
    { type: "migration", onClick: () => setActiveModal("vm:migration"),     label: Localization.kr.MIGRATION, disabled: !isUp },
  ]), [vm, vmId]);

  const popupItems = [
    /* { type: "import",  onClick: () => setActiveModal("vm:import"),  label: Localization.kr.IMPORT, }, */
    { type: "copyVm",    onClick: () => setActiveModal("vm:copy"), label: `${Localization.kr.VM} 복제` },
    { type: "remove",    onClick: () => setActiveModal("vm:remove"), label: Localization.kr.REMOVE, disabled: !isDown, },
    { type: "templates", onClick: () => setActiveModal("vm:templates"), label: "템플릿 생성", disabled: !isDown, }, 
    { type: "ova",       onClick: () => setActiveModal("vm:ova"), label: "OVA로 내보내기",  disabled: !isDown, },
  ];

  return (
    <SectionLayout>
      <HeaderButton title={vm?.name}
        titleIcon={rvi24Desktop()}
        buttons={sectionHeaderButtons}
        status={Localization.kr.renderStatus(vm?.status)}
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

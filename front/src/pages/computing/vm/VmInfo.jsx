import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import Loading from "../../../components/common/Loading";
import HeaderButton from "../../../components/button/HeaderButton";
import NavButton from "../../../components/navigation/NavButton";
import Path from "../../../components/Header/Path";
import VmModals from "../../../components/modal/vm/VmModals";
import VmGeneral from "./VmGeneral";
import VmNics from "./VmNics";
import VmSnapshots from "./VmSnapshots";
import VmApplications from "./VmApplications";
import VmHostDevices from "./VmHostDevices";
import VmEvents from "./VmEvents";
import { rvi24Desktop } from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import { useVm } from "../../../api/RQHook";
import VmDisks from "./VmDisks";
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

  const isUp = vm?.status === "UP";
  const isDown = vm?.status === "DOWN";
  const isMaintenance = vm?.status === "MAINTENANCE";

  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (isVmError || (!isVmLoading && !vm)) {
      navigate("/computing/vms");
    }
  }, [isVmError, isVmLoading, vm, navigate]);

  const sections = [
    { id: "general", label: Localization.kr.GENERAL },
    { id: "nics", label: Localization.kr.NICS },
    { id: "disks", label: "디스크" },
    { id: "snapshots", label: "스냅샷" },
    { id: "applications", label: "애플리케이션" },
    { id: "hostDevices", label: `${Localization.kr.HOST} 장치` },
    { id: "events", label: Localization.kr.EVENT },
  ];

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const handleTabClick = (tab) => {
    Logger.debug(`VmInfo > handleTabClick ... vmId: ${vmId}`)
    const path = tab === "general"? `/computing/vms/${vmId}` : `/computing/vms/${vmId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [
    vm?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ];

  // 탭 메뉴 관리
  const renderSectionContent = () => {
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
  };

  const sectionHeaderButtons = [
    { type: "update", onClick: () => setActiveModal("vm:update"), label: Localization.kr.UPDATE, },
    { type: "start", onClick: () => setActiveModal("vm:start"), label: Localization.kr.START, disabled: isUp && !isMaintenance },
    { type: "pause", onClick: () => setActiveModal("vm:pause"), label: Localization.kr.PAUSE, disabled: !isUp },
    { type: "reboot", onClick: () => setActiveModal("vm:reboot"), label: "재부팅", disabled: !isUp },
    { type: "reset", onClick: () => setActiveModal("vm:reset"), label: "재설정", disabled: !isUp },
    { type: "shutdown", onClick: () => setActiveModal("vm:shutdown"), label: "종료", disabled:!isUp, },
    { type: "powerOff", onClick: () => setActiveModal("vm:powerOff"), label: "전원 끔", disabled: !isUp  },
    { type: "console", onClick: () => setActiveModal("vm:console", vmId), label: "콘솔", disabled: !isUp },
    { type: "snapshots", onClick: () => setActiveModal("vm:snapshot"), label: "스냅샷 생성", disabled: !(isUp || isDown) },
    { type: "migration", onClick: () => setActiveModal("vm:migration"), label: "마이그레이션", disabled: isUp },
  ];

  const popupItems = [
    /* { 
      type: "import", 
      label: Localization.kr.IMPORT, 
      onClick: () => setActiveModal("vm:import") 
    }, */
    { type: "copyVm", onClick: () => setActiveModal("vm:copyVm"), label: `${Localization.kr.VM} 복제` },
    { type: "delete", onClick: () => setActiveModal("vm:delete"), label: Localization.kr.REMOVE, disabled: !isDown, },
    { type: "templates", onClick: () => setActiveModal("vm:templates"), label: "템플릿 생성", disabled: !isDown, }, 
    { type: "ova", onClick: () => setActiveModal("vm:ova"), label: "OVA로 내보내기",  disabled: !isDown, },
  ];

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Desktop()}
        title={vm?.name}
        status={Localization.kr.renderStatus(vm?.status)}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
      />
      <div className="content-outer">
        <NavButton sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full info-content">
          <Path pathElements={pathData}  basePath={`/computing/vms/${vmId}`}/>
          <Suspense fallback={<Loading />}>{renderSectionContent()}</Suspense>
        </div>
      </div>

      {/* vm 모달창 */}
      <VmModals vm={vm}/>
    </div>
  );
};

export default VmInfo;

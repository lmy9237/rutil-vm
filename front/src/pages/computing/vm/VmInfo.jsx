import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useVmById } from "../../../api/RQHook";
import { openNewTab } from "../../../navigation";
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
  const { id: vmId, section } = useParams();
  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
  } = useVmById(vmId);

  const isUp = vm?.status === "UP";
  const isMaintenance = vm?.status === "MAINTENANCE";

  const [activeTab, setActiveTab] = useState("general");
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

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
    {
      type: "edit", label: Localization.kr.UPDATE, disabled: !isUp
      , onClick: () => openModal("edit"),
    }, {
      type: "start", label: Localization.kr.START, disabled: isUp && !isMaintenance
      , onClick: () => openModal("start"),
    }, {
      type: "pause", label: "일시중지", disabled: !isUp
      , onClick: () => openModal("pause"),
    }, {
      type: "reboot", label: "재부팅", disabled: !isUp
      , onClick: () => openModal("reboot"),
    }, {
      type: "reset", label: "재설정", disabled: !isUp
      , onClick: () => openModal("reset"),
    }, {
      type: "stop", label: "종료", disabled: !isUp /* TODO: shutdown으로 변경*/
      , onClick: () => openModal("stop"), /* TODO: shutdown으로 변경 */
    }, {
      type: "powerOff", label: "전원 끔", disabled: !isUp
      , onClick: () => openModal("powerOff"),
    }, { 
      type: "console", label: "콘솔", disabled: !isUp
      , onClick: () => openNewTab("console", vmId)
    }, {
      type: "snapshots",  label: "스냅샷 생성", disabled: !isUp
      , onClick: () => openModal("snapshot")
    }, { 
      type: "migration",  label: "마이그레이션", disabled: isUp
      , onClick: () => openModal("migration")
    },
  ];

  const popupItems = [
    { 
      type: "import", 
      label: "가져오기", 
      onClick: () => openModal("import") 
    }, {
      type: "copyVm",
      label: `${Localization.kr.VM} 복제`,
      onClick: () => openModal("copyVm"),
    }, {
      type: "delete",
      label: "삭제",
      disabled: !isMaintenance,
      onClick: () => openModal("delete"),
    }, {
      type: "templates",
      label: "템플릿 생성",
      onClick: () => openModal("templates"),
    }, { 
      type: "ova", 
      label: "OVA로 내보내기", 
      onClick: () => openModal("ova") 
    },
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
          {renderSectionContent()}
        </div>
      </div>

      {/* vm 모달창 */}
      <VmModals activeModal={activeModal}
        vm={vm} selectedVms={vm}
        onClose={closeModal}
      />
    </div>
  );
};

export default VmInfo;

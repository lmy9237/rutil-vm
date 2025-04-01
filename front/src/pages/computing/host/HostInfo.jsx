import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import HostGeneral from "./HostGeneral";
import HostVms from "./HostVms";
import HostNics from "./HostNics";
import HostDevices from "./HostDevices";
import HostEvents from "./HostEvents";
import HostModals from "../../../components/modal/host/HostModals";
import Localization from "../../../utils/Localization";
import { rvi24Host } from "../../../components/icons/RutilVmIcons";
import { useHost } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import "./Host.css";

/**
 * @name HostInfo
 * @description 호스트 종합페이지
 * (/computing/hosts/<hostId>)
 *
 * @param {string} hostId 호스트 ID
 *
 * @see HostGeneral
 * @see HostVms
 * @see HostNics
 * @see HostDevices
 * @see HostEvents
 * @see HostModals
 *
 * @returns
 */
const HostInfo = () => {
  const navigate = useNavigate();
  const { id: hostId, section } = useParams();
  const { 
    data: host, 
    isError, error, 
    isLoading
  } = useHost(hostId);

  const isUp = host?.status === "UP";
  const isMaintenance = host?.status === "MAINTENANCE";
  const isNonOperational = host?.status === "NON_OPERATIONAL"

  const [activeTab, setActiveTab] = useState("general");
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isError || (!isLoading && !host)) {
      navigate("/computing/rutil-manager/hosts");
    }
  }, [isError, isLoading, host, navigate]);

  const sections = [
    { id: "general", label: Localization.kr.GENERAL },
    { id: "vms", label: Localization.kr.VM },
    { id: "nics", label: Localization.kr.NICS },
    { id: "devices", label: `${Localization.kr.HOST} 장치` },
    { id: "events", label: Localization.kr.EVENT },
  ];

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const handleTabClick = (tab) => {
    Logger.debug(`HostInfo > handleTabClick ... tab: ${tab}`);
    const path = tab === "general"
        ? `/computing/hosts/${hostId}`
        : `/computing/hosts/${hostId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [
    host?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ];

  // 탭 메뉴 관리
  const renderSectionContent = () => {
    Logger.debug(`HostInfo > renderSectionContent ... `);
    const SectionComponent = {
      general: HostGeneral,
      vms: HostVms,
      nics: HostNics,
      devices: HostDevices,
      events: HostEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent hostId={hostId} /> : null;
  };

  // 편집, 삭제 버튼들
  const sectionHeaderButtons = [
    { type: "edit", label: Localization.kr.UPDATE, disabled: !isUp, onClick: () => openModal("edit"), }, 
    { type: "delete", label: Localization.kr.REMOVE, disabled: !isMaintenance, onClick: () => openModal("delete"), },
  ];

  const popupItems = [
    {
      type: "deactivate",
      label: "유지보수",
      disabled: !isUp && isNonOperational,
      onClick: () => openModal("deactivate"),
    }, {
      type: "activate",
      label: Localization.kr.ACTIVATE,
      disabled: isMaintenance ,
      onClick: () => openModal("activate"),
    }, {
      type: Localization.kr.RESTART,
      label: "재시작",
      disabled: !isUp,
      onClick: () => openModal("restart"),
    }, {
      type: "reInstall",
      label: "다시 설치",
      disabled: isUp,
      onClick: () => openModal("reInstall"),
    }, {
      type: "register",
      label: "인증서 등록",
      disabled: isUp,
      onClick: () => openModal("register"),
    }, {
      type: "haOn",
      label: "글로벌 HA 유지 관리를 활성화",
      disabled: !isUp,
      onClick: () => openModal("haOn"),
    }, {
      type: "haOff",
      label: "글로벌 HA 유지 관리를 비활성화",
      disabled: !isUp,
      onClick: () => openModal("haOff"),
    },
  ];

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Host()}
        title={host?.name}
        status={Localization.kr.renderStatus(host?.status)}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full info-content">
          <Path
            pathElements={pathData}
            basePath={`/computing/hosts/${hostId}`}
          />
          {renderSectionContent()}
        </div>
      </div>

      {/* 호스트 모달창 */}
      <HostModals
        activeModal={activeModal}
        host={host}
        selectedHosts={host}
        onClose={closeModal}
      />
    </div>
  );
};

export default HostInfo;

import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Loading from "../../../components/common/Loading";
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
    isLoading: isHostLoading,
    isError: isHostError, 
    isSuccess: isHostSuccess,
  } = useHost(hostId);
  const { activeModal, setActiveModal, } = useUIState()
  const { hostsSelected, setHostsSelected } = useGlobal()
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isHostError || (!isHostLoading && !host)) {
      navigate("/computing/rutil-manager/hosts");
    }
    setHostsSelected(host)
  }, [host]);

  const isUp = host?.status === "UP";
  const isMaintenance = host?.status === "MAINTENANCE";
  const isNonOperational = host?.status === "NON_OPERATIONAL"

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`HostInfo > handleTabClick ... tab: ${tab}`);
    const path = tab === "general"
        ? `/computing/hosts/${hostId}`
        : `/computing/hosts/${hostId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [hostId]);

  const sections = useMemo(() => ([
    { id: "general", label: Localization.kr.GENERAL },
    { id: "vms", label: Localization.kr.VM },
    { id: "nics", label: Localization.kr.NICS },
    { id: "devices", label: `${Localization.kr.HOST} 장치` },
    { id: "events", label: Localization.kr.EVENT },
  ]), [])

  const pathData = useMemo(() => ([
    host?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ]), [host]);  

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

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
  const sectionHeaderButtons = useMemo(() => ([
    { type: "host:update", onClick: () => setActiveModal("host:update"), label: Localization.kr.UPDATE, disabled: !isUp, }, 
    { type: "host:remove", onClick: () => setActiveModal("host:remove"), label: Localization.kr.REMOVE, disabled: !isMaintenance, },
  ]), [])

  const popupItems = [
    { type: "deactivate", onClick: () => setActiveModal("host:deactivate"), label: "유지보수", disabled: !isUp && isNonOperational, },
    { type: "activate", onClick: () => setActiveModal("host:activate"), label: Localization.kr.ACTIVATE, disabled: isMaintenance , },
    { type: "restart", onClick: () => setActiveModal("host:restart"), label: Localization.kr.RESTART, disabled: !isUp, },
    { type: "reInstall", onClick: () => setActiveModal("host:reInstall"), label: "다시 설치", disabled: isUp, },
    { type: "enrollCert", onClick: () => setActiveModal("host:enrollCert"), label: "인증서 등록", disabled: isUp, },
    { type: "haOn", onClick: () => setActiveModal("host:haOn"), label: "글로벌 HA 유지 관리를 활성화", disabled: !isUp, }, 
    { type: "haOff", onClick: () => setActiveModal("host:haOff"), label: "글로벌 HA 유지 관리를 비활성화", disabled: !isUp, },
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
        <div className="px-[0.5rem] py-[0.5rem] w-full info-content">
          <Path
            pathElements={pathData}
            basePath={`/computing/hosts/${hostId}`}
          />
          <Suspense fallback={<Loading />}>{renderSectionContent()}</Suspense>
        </div>
      </div>

      {/* 호스트 모달창 */}
      <HostModals host={host} />
    </div>
  );
};

export default HostInfo;

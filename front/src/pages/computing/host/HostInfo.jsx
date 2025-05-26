import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import SectionLayout           from "@/components/SectionLayout";
import TabNavButtonGroup       from "@/components/common/TabNavButtonGroup";
import HeaderButton            from "@/components/button/HeaderButton";
import Path                    from "@/components/Header/Path";
import HostGeneral             from "./HostGeneral";
import HostVms                 from "./HostVms";
import HostNics                from "./HostNics";
import HostDevices             from "./HostDevices";
import HostNetworkAdapter      from "./HostNetworkAdapter";
import HostEvents             from "./HostEvents";
import {
  rvi24Host
} from "@/components/icons/RutilVmIcons";
import { 
  useHost
} from "@/api/RQHook";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";
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
  const isInstalling = host?.status === "INSTALLING";

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`HostInfo > handleTabClick ... tab: ${tab}`);
    const path = tab === "general"
        ? `/computing/hosts/${hostId}`
        : `/computing/hosts/${hostId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [navigate, activeTab, hostId]);

  const tabs = useMemo(() => ([
    { id: "general",        label: Localization.kr.GENERAL, onClick: () => handleTabClick("general") },
    { id: "vms",            label: Localization.kr.VM,      onClick: () => handleTabClick("vms") },
    { id: "nics",           label: Localization.kr.NICS,    onClick: () => handleTabClick("nics") },
    { id: "networkAdapter", label: "네트워크 어댑터",          onClick: () => handleTabClick("networkAdapter") },
    { id: "devices",        label: `${Localization.kr.HOST} 장치`, onClick: () => handleTabClick("devices") },
    { id: "events",         label: Localization.kr.EVENT,    onClick: () => handleTabClick("events") },
  ]), [hostId])

  const pathData = useMemo(() => ([
    host?.name,
    [...tabs].find((section) => section.id === activeTab)?.label,
  ]), [host]);  

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  // 탭 메뉴 관리
  const renderSectionContent = useCallback(() => {
    Logger.debug(`HostInfo > renderSectionContent ... `);
    const SectionComponent = {
      general: HostGeneral,
      vms: HostVms,
      nics: HostNics,
      networkAdapter: HostNetworkAdapter,
      devices: HostDevices,
      events: HostEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent hostId={hostId} /> : null;
  }, [activeTab, hostId]);

  // 편집, 삭제 버튼들
  const sectionHeaderButtons = useMemo(() => ([
    { type: "host:update", onClick: () => setActiveModal("host:update"), label: Localization.kr.UPDATE, disabled: !isUp || isInstalling, }, 
    { type: "host:remove", onClick: () => setActiveModal("host:remove"), label: Localization.kr.REMOVE, disabled: !isMaintenance || isInstalling, },
  ]), [host])

  const popupItems = [
    { type: "deactivate", onClick: () => setActiveModal("host:deactivate"), label: "유지보수", disabled: isInstalling || isNonOperational || !isUp, },
    { type: "activate", onClick: () => setActiveModal("host:activate"), label: Localization.kr.ACTIVATE, disabled: !isMaintenance || isUp || isInstalling, },
    { type: "restart", onClick: () => setActiveModal("host:restart"), label: Localization.kr.RESTART, disabled: !isUp || isInstalling, },
    { type: "reInstall", onClick: () => setActiveModal("host:reInstall"), label: "다시 설치", disabled: isUp || isInstalling, },
    { type: "enrollCert", onClick: () => setActiveModal("host:enrollCert"), label: "인증서 등록", disabled: isUp || isInstalling, },
    { type: "haOn", onClick: () => setActiveModal("host:haOn"), label: "글로벌 HA 유지 관리를 활성화", disabled: !isUp || isInstalling, }, 
    { type: "haOff", onClick: () => setActiveModal("host:haOff"), label: "글로벌 HA 유지 관리를 비활성화", disabled: !isUp || isInstalling, },
  ];

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Host()}
        title={host?.name}
        status={Localization.kr.renderStatus(host?.status)}
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
          <Path pathElements={pathData} basePath={`/computing/hosts/${hostId}`} />
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default HostInfo;

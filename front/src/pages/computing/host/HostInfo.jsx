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
import HostEvents              from "./HostEvents";
import {
  rvi24Host
} from "@/components/icons/RutilVmIcons";
import { 
  useHost
} from "@/api/RQHook";
import {
  refetchIntervalInMilli
} from "@/util";
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
  const {
    activeModal, setActiveModal,
    tabInPage, setTabInPage
  } = useUIState()
  const { setHostsSelected } = useGlobal()
  const { id: hostId, section } = useParams();
  const { 
    data: host,
    isLoading: isHostLoading,
    isError: isHostError, 
    isSuccess: isHostSuccess,
    isRefetching: isHostRefetching,
    refetch: refetchHost,
  } = useHost(hostId);

  const isUp = host?.status?.toLowerCase() === "UP".toLowerCase();
  const isMaintenance = host?.status?.toLowerCase() === "MAINTENANCE".toLowerCase();
  const isNonOperational = host?.status?.toLowerCase() === "NON_OPERATIONAL".toLowerCase();
  const isInstalling = host?.status?.toLowerCase() === "INSTALLING".toLowerCase();
  const isReboot = host?.status?.toLowerCase() === "REBOOT".toLowerCase();
  const isGlobalMaintenance = host?.globalMaintenance === true
  const isHostedConfigured = host?.hostedConfigured === true

  const [activeTab, setActiveTab] = useState("general");
  const tabs = useMemo(() => ([
    { id: "general",        label: Localization.kr.GENERAL,               onClick: () => handleTabClick("general") },
    { id: "vms",            label: Localization.kr.VM,                    onClick: () => handleTabClick("vms") },
    { id: "nics",           label: Localization.kr.NICS,                  onClick: () => handleTabClick("nics") },
    { id: "networkAdapter", label: `${Localization.kr.NETWORK} 어댑터`,    onClick: () => handleTabClick("networkAdapter") },
    { id: "devices",        label: `${Localization.kr.HOST} 장치`,         onClick: () => handleTabClick("devices") },
    { id: "events",         label: Localization.kr.EVENT,                 onClick: () => handleTabClick("events") },
  ]), [hostId])

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`HostInfo > handleTabClick ... hostId: ${hostId}`);
    const path = tab === "general"
        ? `/computing/hosts/${hostId}`
        : `/computing/hosts/${hostId}/${tab}`;
    navigate(path);
    setTabInPage("/computing/hosts", tab);
    setActiveTab(tab);
  }, [hostId]);

  const pathData = useMemo(() => ([
    host?.name,
    tabs.find((section) => section.id === activeTab)?.label,
  ]), [host, tabs, activeTab]);  


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
    { type: "host:update", onClick: () => setActiveModal("host:update"),             label: Localization.kr.UPDATE, disabled: isInstalling || isReboot, }, 
    { type: "host:remove", onClick: () => setActiveModal("host:remove"),             label: Localization.kr.REMOVE, disabled: !isMaintenance || isInstalling, },
  ]), [host])

  const popupItems = [
    { type: "deactivate",    onClick: () => setActiveModal("host:deactivate"),       label: Localization.kr.MAINTENANCE,          disabled: isInstalling || isNonOperational || !isUp, },
    { type: "activate",      onClick: () => setActiveModal("host:activate"),         label: Localization.kr.ACTIVATE,             disabled: !isMaintenance || isUp || isInstalling, },
    { type: "restart",       onClick: () => setActiveModal("host:restart"),          label: Localization.kr.RESTART,              disabled: !isUp || isInstalling, },
    { type: "refresh",       onClick: () => setActiveModal("host:refresh"),          label: Localization.kr.REFRESH_CAPABILITIES, disabled: !isUp || isInstalling  },
    { type: "reinstall",     onClick: () => setActiveModal("host:reinstall"),        label: Localization.kr.REINSTALL,            disabled: isUp || isInstalling || !isMaintenance, },
    { type: "enrollCert",    onClick: () => setActiveModal("host:enrollCert"),       label: `${Localization.kr.CERTIFICATE} ${Localization.kr.ENROLL}`, disabled: isUp || isInstalling, },
    { type: "haOn",          onClick: () => setActiveModal("host:haOn"),             label: "글로벌 HA 유지 관리를 활성화",           disabled: !isHostedConfigured || /*!isMaintenance ||*/ isGlobalMaintenance, }, 
    { type: "haOff",         onClick: () => setActiveModal("host:haOff"),            label: "글로벌 HA 유지 관리를 비활성화",          disabled: !isHostedConfigured || /*!isMaintenance ||*/ !isGlobalMaintenance, },
  ];

  useEffect(() => {
    Logger.debug(`HostInfo > useEffect ... section: ${section}`)
    setActiveTab(section || "general");
  }, [section]);

  useEffect(() => {
    Logger.debug(`HostInfo > useEffect ... (for Automatic Tab Switch)`)
    if (isHostError || (!isHostLoading && !host)) {
      navigate("/computing/rutil-manager/hosts");
    }
    const currentTabInPage = tabInPage("/computing/hosts")
    handleTabClick(currentTabInPage === "" ? "general" : currentTabInPage);
    // setActiveTab(currentTabInPage === "" ? "general" : currentTabInPage)    
    setHostsSelected(host)
  }, [host]);

  useEffect(() => {
    Logger.debug(`HostInfo > useEffect ... (for Host status check)`)
    if (!!activeModal) return // 모달이 켜져 있을 떄 조회 및 렌더링 일시적으로 방지
    const intervalInMilli = refetchIntervalInMilli(host?.status)
    Logger.debug(`HostInfo > useEffect ... look for Host status (${host?.status}) in ${intervalInMilli/1000} second(s)`)
    const intervalId = setInterval(() => {
      refetchHost()
    }, intervalInMilli) // 주기적 조회
    return () => {clearInterval(intervalId)}
  }, [hostId, host, activeModal])

  return (
    <SectionLayout>
      <HeaderButton title={host?.name} titleIcon={rvi24Host()}
        status={Localization.kr.renderStatus(host?.status)}
        isLoading={isHostLoading} isRefetching={isHostRefetching} refetch={refetchHost}
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

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import SectionLayout          from "@/components/SectionLayout";
import TabNavButtonGroup      from "@/components/common/TabNavButtonGroup";
import HeaderButton           from "@/components/button/HeaderButton";
import Path                   from "@/components/Header/Path";
import NetworkGeneral         from "./NetworkGeneral";
import NetworkVnicProfiles    from "./NetworkVnicProfiles";
import NetworkHosts           from "./NetworkHosts";
import NetworkVms             from "./NetworkVms";
import NetworkTemplates       from "./NetworkTemplates";
import NetworkClusters        from "./NetworkClusters";
import {
  rvi24Network, 
  rvi24NetworkDot,
} from "@/components/icons/RutilVmIcons";
import {
  useNetwork
} from "@/api/RQHook";
import {
  refetchIntervalInMilli
} from "@/util";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

/**
 * @name NetworkInfo
 * @description 네트워크 정보
 *
 * @param {string}
 * @returns {JSX.Element} NetworkInfo
 */
const NetworkInfo = () => {
  const navigate = useNavigate();
  const { id: networkId, section } = useParams();
  const {
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()
  const { networksSelected, setNetworksSelected } = useGlobal()
  const {
    data: network,
    isLoading: isNetworkLoading,
    isError: isNetworkError,
    isSuccess: isNetworkSuccess,
    isRefetching: isNetworkRefetching,
    refetch: refetchNetwork,
   } = useNetwork(networkId);

  const [activeTab, setActiveTab] = useState("general");

  const tabs = useMemo(() => [
    { id: "general",       label: Localization.kr.GENERAL,      onClick: () => handleTabClick("general") },
    { id: "vnicProfiles",  label: Localization.kr.VNIC_PROFILE, onClick: () => handleTabClick("vnicProfiles") },
    { id: "clusters",      label: Localization.kr.CLUSTER,      onClick: () => handleTabClick("clusters") },
    { id: "hosts",         label: Localization.kr.HOST,         onClick: () => handleTabClick("hosts") },
    { id: "vms",           label: Localization.kr.VM,           onClick: () => handleTabClick("vms") },
    { id: "templates",     label: Localization.kr.TEMPLATE,     onClick: () => handleTabClick("templates") },
  ], [networkId]);
  
  const pathData = useMemo(() => [
    network?.name,
    tabs.find((section) => section.id === activeTab)?.label,
  ], [network, tabs, activeTab]);

  const renderSectionContent = useCallback(() => {
    Logger.debug(`NetworkInfo > renderSectionContent ...`)
    const SectionComponent = {
      general: NetworkGeneral,
      vnicProfiles: NetworkVnicProfiles,
      clusters: NetworkClusters,
      hosts: NetworkHosts,
      vms: NetworkVms,
      templates: NetworkTemplates,
    }[activeTab];
    return SectionComponent ? <SectionComponent networkId={networkId} /> : null;
  }, [activeTab, networkId]);

  const sectionHeaderButtons = useMemo(() => ([
    { type: "update", label: Localization.kr.UPDATE, onClick: () => setActiveModal("network:update") },
    { type: "remove", label: Localization.kr.REMOVE, onClick: () => setActiveModal("network:remove") },
  ]), []);

  const handleTabClick = useCallback((tab) => {
    const path =
      tab === "general"
        ? `/networks/${networkId}`
        : `/networks/${networkId}/${tab}`;
    navigate(path);
    setTabInPage("/networks", tab);
    setActiveTab(tab);
  }, [network]);

  const _titleIcon = useMemo(() => {
    return network?.status.toUpperCase() === "operational".toUpperCase()
      ? rvi24NetworkDot()
      : rvi24Network()
  }, [network])

  useEffect(() => {
    Logger.debug(`NetworkInfo > useEffect ... section: ${section}`)
    setActiveTab(section || "general");
  }, [section]);

  useEffect(() => {
    Logger.debug(`NetworkInfo > useEffect ... (for Automatic Tab Switch)`)
    if (isNetworkError || (!isNetworkLoading && !network)) {
      navigate("/networks");
    }
    const currentTabInPage = tabInPage("/networks")
    handleTabClick(currentTabInPage === "" ? "general" : currentTabInPage);
    //setActiveTab(currentTabInPage === "" ? "general" : currentTabInPage)
    setNetworksSelected(network)
  }, [network, navigate]);

  useEffect(() => {
    Logger.debug(`NetworkInfo > useEffect ... (for Network status check)`)
    if (!!activeModal) return // 모달이 켜져 있을 떄 조회 및 렌더링 일시적으로 방지
    const intervalInMilli = refetchIntervalInMilli(network?.status)
    Logger.debug(`NetworkInfo > useEffect ... look for Network status (${network?.status}) in ${intervalInMilli/1000} second(s)`)
    const intervalId = setInterval(() => {
      refetchNetwork()
    }, intervalInMilli) // 주기적 조회
    return () => {clearInterval(intervalId)}
  }, [network, networkId, activeModal]);
  
  return (
    <SectionLayout>
      <HeaderButton title={network?.name} titleIcon={_titleIcon}
        status={Localization.kr.renderStatus(network?.status)}
        isLoading={isNetworkLoading} isRefetching={isNetworkRefetching} refetch={refetchNetwork}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path pathElements={pathData} basePath={`/networks/${networkId}`} />
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default NetworkInfo;

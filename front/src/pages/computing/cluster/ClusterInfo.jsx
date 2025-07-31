import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import SectionLayout from "../../../components/SectionLayout";
import TabNavButtonGroup from "../../../components/common/TabNavButtonGroup";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import ClusterGeneral from "./ClusterGeneral";
import ClusterHosts from "./ClusterHosts";
import ClusterVms from "./ClusterVms";
import ClusterNetworks from "./ClusterNetworks";
import ClusterEvents from "./ClusterEvents";
import { rvi24Cluster } from "../../../components/icons/RutilVmIcons";
import {
  useCluster
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./Cluster.css";

/**
 * @name ClusterInfo
 * @description 클러스터 종합 페이지
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 *
 * @see ClusterGeneral
 * @see ClusterHosts
 * @see ClusterVms
 * @see ClusterNetworks
 * @see ClusterEvents
 * @see ClusterModals
 */
const ClusterInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: clusterId, section } = useParams();
  const {
    data: cluster,
    isLoading: isClusterLoading,
    isError: isClusterError,
    isSuccess: isClusterSuccess,
  } = useCluster(clusterId, (e) => ({ ...e }));
  const { 
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()
  const { setClustersSelected } = useGlobal()
  const [activeTab, setActiveTab] = useState("general");

  const tabs = useMemo(() => ([
    { id: "general",  label: Localization.kr.GENERAL, onClick: () => handleTabClick("general") },
    { id: "hosts",    label: Localization.kr.HOST,    onClick: () => handleTabClick("hosts") },
    { id: "vms",      label: Localization.kr.VM,      onClick: () => handleTabClick("vms") },
    { id: "networks", label: "논리 네트워크",           onClick: () => handleTabClick("networks") },
    { id: "events",   label: Localization.kr.EVENT,   onClick: () => handleTabClick("events") },
  ]), [clusterId]);

  const pathData = useMemo(() => ([
    cluster?.name,
    tabs.find((section) => section.id === activeTab)?.label,
  ]), [activeTab, cluster])

  const renderSectionContent = useCallback(() => {
    Logger.debug(`ClusterInfo > renderSectionContent ... `)
    const SectionComponent = {
      general: ClusterGeneral,
      hosts: ClusterHosts,
      vms: ClusterVms,
      networks: ClusterNetworks,
      events: ClusterEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent clusterId={clusterId} /> : null;
  }, [activeTab, clusterId]);

  const sectionHeaderButtons = useMemo(() => ([
    { type: "update", onClick: () => setActiveModal("cluster:update"), label: Localization.kr.UPDATE, },
    { type: "remove", onClick: () => setActiveModal("cluster:remove"), label: Localization.kr.REMOVE, },
  ]), []);

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  useEffect(() => {
    if (isClusterError || (!isClusterLoading && !cluster)) {
      navigate("/computing/rutil-manager/clusters");
    }
    const currentTabInPage = tabInPage("/computing/clusters")
    handleTabClick(currentTabInPage === "" ? "general" : currentTabInPage);
    //setActiveTab(currentTabInPage === "" ? "general" : currentTabInPage)    
    setClustersSelected(cluster)
  }, [cluster, navigate]);

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`ClusterInfo > handleTabClick ... tab: ${tab}`)
    const path =
      tab === "general"
        ? `/computing/clusters/${clusterId}`
        : `/computing/clusters/${clusterId}/${tab}`;
    navigate(path);
    setTabInPage("/computing/clusters", tab);
    setActiveTab(tab);
  }, []);

  return (
    <SectionLayout>
      <HeaderButton title={cluster?.name}
        titleIcon={rvi24Cluster()}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path type="cluster" pathElements={pathData} basePath={`/computing/clusters/${clusterId}`}/>
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default ClusterInfo;

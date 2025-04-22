import React, { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import Loading from "../../../components/common/Loading";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import ClusterGeneral from "./ClusterGeneral";
import ClusterHosts from "./ClusterHosts";
import ClusterVms from "./ClusterVms";
import ClusterNetworks from "./ClusterNetworks";
import ClusterEvents from "./ClusterEvents";
import { useCluster } from "../../../api/RQHook";
import { rvi24Cluster } from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import "./Cluster.css";
import SectionLayout from "../../../components/SectionLayout";

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
  const { id: clusterId, section } = useParams();
  const {
    data: cluster,
    isLoading: isClusterLoading,
    isError: isClusterError,
    isSuccess: isClusterSuccess,
  } = useCluster(clusterId, (e) => ({ ...e }));
  const { activeModal, setActiveModal, } = useUIState()
  const { clustersSelected, setClustersSelected } = useGlobal()
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isClusterError || (!isClusterLoading && !cluster)) {
      navigate("/computing/rutil-manager/clusters");
    }
    setClustersSelected(cluster)
  }, [cluster, navigate]);

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`ClusterInfo > handleTabClick ... tab: ${tab}`)
    const path =
      tab === "general"
        ? `/computing/clusters/${clusterId}`
        : `/computing/clusters/${clusterId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, []);

  const sections = useMemo(() => ([
    { id: "general", label: Localization.kr.GENERAL },
    { id: "hosts", label: Localization.kr.HOST },
    { id: "vms", label: Localization.kr.VM },
    { id: "networks", label: "논리 네트워크" },
    { id: "events", label: Localization.kr.EVENT },
  ]), []);

  const pathData = useMemo(() => ([
    cluster?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ]), [cluster, activeTab])

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const renderSectionContent = () => {
    Logger.debug(`ClusterInfo > renderSectionContent ... `)
    const SectionComponent = {
      general: ClusterGeneral,
      hosts: ClusterHosts,
      vms: ClusterVms,
      networks: ClusterNetworks,
      events: ClusterEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent clusterId={clusterId} /> : null;
  };

  const sectionHeaderButtons = useMemo(() => ([
    { type: "update", onClick: () => setActiveModal("cluster:update"), label: Localization.kr.UPDATE, },
    { type: "remove", onClick: () => setActiveModal("cluster:remove"), label: Localization.kr.REMOVE, },
  ]), []);

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Cluster()}
        title={cluster?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full info-content">
          <Path pathElements={pathData} basePath={`/computing/clusters/${clusterId}`}/>
          <Suspense fallback={<Loading />}>{renderSectionContent()}</Suspense>
        </div>
      </div>
    </SectionLayout>
  );
};

export default ClusterInfo;

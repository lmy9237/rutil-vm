import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import ClusterModals from "../../../components/modal/cluster/ClusterModals";
import ClusterGeneral from "./ClusterGeneral";
import ClusterHosts from "./ClusterHosts";
import ClusterVms from "./ClusterVms";
import ClusterNetworks from "./ClusterNetworks";
import ClusterEvents from "./ClusterEvents";
import { useCluster } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import { rvi24Cluster } from "../../../components/icons/RutilVmIcons";
import "./Cluster.css";
import Logger from "../../../utils/Logger";

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

  const [activeTab, setActiveTab] = useState("general");
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isClusterError || (!isClusterLoading && !cluster)) {
      navigate("/computing/rutil-manager/clusters");
    }
  }, [isClusterError, isClusterLoading, cluster, navigate]);

  const sections = [
    { id: "general", label: Localization.kr.GENERAL },
    { id: "hosts", label: Localization.kr.HOST },
    { id: "vms", label: Localization.kr.VM },
    { id: "networks", label: "논리 네트워크" },
    { id: "events", label: Localization.kr.EVENT },
  ];

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const handleTabClick = (tab) => {
    const path =
      tab === "general"
        ? `/computing/clusters/${clusterId}`
        : `/computing/clusters/${clusterId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [
    cluster?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ];

  const renderSectionContent = () => {
    const SectionComponent = {
      general: ClusterGeneral,
      hosts: ClusterHosts,
      vms: ClusterVms,
      networks: ClusterNetworks,
      events: ClusterEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent clusterId={clusterId} /> : null;
  };

  const sectionHeaderButtons = [
    { type: "edit", label: Localization.kr.UPDATE, onClick: () => openModal("edit") },
    { type: "delete", label: Localization.kr.REMOVE, onClick: () => openModal("delete") },
  ];

  Logger.debug("...");
  return (
    <div id="section">
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
          {renderSectionContent()}
        </div>
      </div>

      {/* 클러스터 모달창 */}
      <ClusterModals
        activeModal={activeModal}
        cluster={cluster}
        selectedClusters={cluster}
        onClose={closeModal}
      />
    </div>
  );
};

export default ClusterInfo;

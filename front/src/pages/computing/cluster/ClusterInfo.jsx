import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
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
    { id: "general", label: "일반" },
    { id: "hosts", label: "호스트" },
    { id: "vms", label: "가상머신" },
    { id: "networks", label: "논리 네트워크" },
    { id: "events", label: "이벤트" },
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
    { type: "edit", label: "편집", onClick: () => openModal("edit") },
    { type: "delete", label: "삭제", onClick: () => openModal("delete") },
  ];

  console.log("...");
  return (
    <div id="section">
      <HeaderButton
        titleIcon={faEarthAmericas}
        title={cluster?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full px-[0.5rem] py-[0.5rem] info-content">
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

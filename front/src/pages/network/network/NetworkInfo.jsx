import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import NetworkModals from "../../../components/modal/network/NetworkModals";
import NetworkGeneral from "./NetworkGeneral";
import NetworkVnicProfiles from "./NetworkVnicProfiles";
import NetworkHosts from "./NetworkHosts";
import NetworkVms from "./NetworkVms";
import NetworkTemplates from "./NetworkTemplates";
import NetworkClusters from "./NetworkClusters";
import Localization from "../../../utils/Localization";
import { useNetworkById } from "../../../api/RQHook";
import { rvi24Network } from "../../../components/icons/RutilVmIcons";

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
  const { data: network, isError, isLoading } = useNetworkById(networkId);

  const [activeTab, setActiveTab] = useState("general");
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isError || (!isLoading && !network)) {
      navigate("/networks");
    }
  }, [isError, isLoading, network, navigate]);

  const sections = [
    { id: "general", label: Localization.kr.GENERAL },
    { id: "vnicProfiles", label: Localization.kr.VNIC_PROFILE },
    { id: "clusters", label: Localization.kr.CLUSTER },
    { id: "hosts", label: Localization.kr.HOST },
    { id: "vms", label: Localization.kr.VM },
    { id: "templates", label: "템플릿" },
  ];

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const handleTabClick = (tab) => {
    const path =
      tab === "general"
        ? `/networks/${networkId}`
        : `/networks/${networkId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };
  const pathData = [
    network?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ];

  const renderSectionContent = () => {
    const SectionComponent = {
      general: NetworkGeneral,
      vnicProfiles: NetworkVnicProfiles,
      clusters: NetworkClusters,
      hosts: NetworkHosts,
      vms: NetworkVms,
      templates: NetworkTemplates,
    }[activeTab];
    return SectionComponent ? <SectionComponent networkId={networkId} /> : null;
  };

  const sectionHeaderButtons = [
    { type: "edit", label: "편집", onClick: () => openModal("edit") },
    { type: "delete", label: "삭제", onClick: () => openModal("delete") },
  ];

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Network()}
        title={network?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full px-[0.5rem] py-[0.5rem] info-content">
          <Path pathElements={pathData} basePath={`/networks/${networkId}`} />
          {renderSectionContent()}
        </div>
      </div>

      {/* 네트워크 모달창 */}
      <NetworkModals
        activeModal={activeModal}
        network={network}
        selectedNetworks={network}
        onClose={closeModal}
      />
    </div>
  );
};

export default NetworkInfo;

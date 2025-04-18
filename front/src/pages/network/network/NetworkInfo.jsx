import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
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
import { useNetwork } from "../../../api/RQHook";
import { rvi24Network } from "../../../components/icons/RutilVmIcons";
import useGlobal from "../../../hooks/useGlobal";

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
  const { activeModal, setActiveModal, } = useUIState()
  const { networksSelected, setNetworksSelected } = useGlobal()
  const {
    data: network,
    isError: isNetworkError,
    isLoading: isNetworkLoading,
   } = useNetwork(networkId);

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isNetworkError || (!isNetworkLoading && !network)) {
      navigate("/networks");
    }
    setNetworksSelected(network)
  }, [network, navigate]);

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
    { type: "update", label: Localization.kr.UPDATE, onClick: () => setActiveModal("network:update") },
    { type: "remove", label: Localization.kr.REMOVE, onClick: () => setActiveModal("network:remove") },
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
      <NetworkModals network={network} />
    </div>
  );
};

export default NetworkInfo;

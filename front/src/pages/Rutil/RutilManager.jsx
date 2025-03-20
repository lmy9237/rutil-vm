import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavButton from "../../components/navigation/NavButton";
import HeaderButton from "../../components/button/HeaderButton";

import Path from "../../components/Header/Path";
import Info from "./Info";
import DataCenters from "./DataCenters";
import Clusters from "./Clusters";
import Hosts from "./Hosts";
import Vms from "./Vms";
import Templates from "./Templates";
import StorageDomains from "./StorageDomains";
import Disks from "./Disks";
import Networks from "./Networks";
import VnicProfiles from "./VnicProfiles";
import Localization from "../../utils/Localization";
import "./RutilManager.css";
import { rvi16Globe } from "../../components/icons/RutilVmIcons";

/**
 * @name RutilManager
 * @description Rutil Manager 창
 * 
 * @returns {JSX.Element} Rutil Manager 창
 */
const RutilManager = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("info"); // 기본 탭은 info로

  const rootPath = location.pathname.split("/").slice(0, 2).join("/"); // '/computing' 또는 '/networks' 등 추출

  // Header와 Sidebar에 쓰일 섹션과 버튼 정보
  const sections = [
    { id: "info", label: Localization.kr.GENERAL },
    { id: "datacenters", label: Localization.kr.DATA_CENTER },
    { id: "clusters", label: Localization.kr.CLUSTER },
    { id: "hosts", label: Localization.kr.HOST },
    { id: "vms", label: Localization.kr.VM },
    { id: "templates", label: "템플릿" },
    { id: "storageDomains", label: "스토리지 도메인" },
    { id: "disks", label: "디스크" },
    { id: "networks", label: Localization.kr.NETWORK },
    { id: "vnicProfiles", label: Localization.kr.VNIC_PROFILE },
  ];

  // section이 변경될때 tab도 같이 변경
  useEffect(() => {
    setActiveTab(!section ? "info" : section);
  }, [section]);

  const handleTabClick = (tab) => {
    const path = tab === "info"
        ? `${rootPath}/rutil-manager`
        : `${rootPath}/rutil-manager/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [
    "Rutil Manager",
    sections.find((section) => section.id === activeTab)?.label,
  ];

  const sectionComponents = {
    info: Info,
    datacenters: DataCenters,
    clusters: Clusters,
    hosts: Hosts,
    vms: Vms,
    templates: Templates,
    storageDomains: StorageDomains,
    disks: Disks,
    networks: Networks,
    vnicProfiles: VnicProfiles,
  };

  const renderSectionContent = () => {
    const SectionComponent = sectionComponents[activeTab] || Info;
    return <SectionComponent />;
  };

  return (
    <div id="section">
      <HeaderButton title="Rutil Manager"
        titleIcon={rvi16Globe}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full info-content">
          <Path pathElements={pathData} />
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}

export default RutilManager;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavButton from "../../components/navigation/NavButton";
import HeaderButton from "../../components/button/HeaderButton";
import Path from "../../components/Header/Path";
import RutilGeneral from "./RutilGeneral";
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
import { rvi24Globe } from "../../components/icons/RutilVmIcons";
import SectionLayout from "../../components/SectionLayout";
import Logger from "../../utils/Logger";
import "./RutilManager.css";

/**
 * @name RutilManager
 * @description Rutil Manager 창
 * 
 * @returns {JSX.Element} Rutil Manager 창
 * 
 * @see RutilGeneral
 * @see DataCenters
 * @see Clusters
 * @see Hosts
 * @see Vms
 * @see Templates
 * @see StorageDomains
 * @see Disks
 * @see Networks
 * @see VnicProfiles
 */
const RutilManager = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("info"); // 기본 탭은 info로

  const rootPath = location.pathname.split("/").slice(0, 2).join("/"); // '/computing' 또는 '/networks' 등 추출

  // Header와 Sidebar에 쓰일 섹션과 버튼 정보
  const sections = useMemo(() => [
    { id: "info", label: Localization.kr.GENERAL },
    { id: "datacenters", label: Localization.kr.DATA_CENTER },
    { id: "clusters", label: Localization.kr.CLUSTER },
    { id: "hosts", label: Localization.kr.HOST },
    { id: "vms", label: Localization.kr.VM },
    { id: "templates", label: Localization.kr.TEMPLATE },
    { id: "storageDomains", label: Localization.kr.DOMAIN },
    { id: "disks", label: Localization.kr.DISK },
    { id: "networks", label: Localization.kr.NETWORK },
    { id: "vnicProfiles", label: Localization.kr.VNIC_PROFILE },
  ], []);

  // section이 변경될때 tab도 같이 변경
  useEffect(() => {
    setActiveTab(!section ? "info" : section);
  }, [section]);

  const handleTabClick = useCallback((tab) => {
    const path = tab === "info"
        ? `${rootPath}/rutil-manager`
        : `${rootPath}/rutil-manager/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [rootPath]);

  const pathData = useMemo(() => [
    "Rutil Manager",
    sections.find((section) => section.id === activeTab)?.label,
  ], [sections, activeTab]);

  const renderSectionContent = useCallback(() => {
    Logger.debug(`RutilManager > renderSectionContent ...`)
    const sectionComponents = {
      info: RutilGeneral,
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
    const SectionComponent = sectionComponents[activeTab] || RutilGeneral;
    return <SectionComponent />;
  }, [activeTab]);

  return (
    <SectionLayout>
      <HeaderButton title="Rutil Manager"
        titleIcon={rvi24Globe()}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="info-content v-start gap-8 w-full">
          <Path pathElements={pathData} />
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
}

export default RutilManager;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SectionLayout          from "@/components/SectionLayout";
import TabNavButtonGroup      from "@/components/common/TabNavButtonGroup";
import HeaderButton           from "@/components/button/HeaderButton";
import Path                   from "@/components/Header/Path";
import { rvi24Globe }         from "@/components/icons/RutilVmIcons";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import RutilGeneral           from "./RutilGeneral";
import RutilDataCenters       from "./RutilDataCenters";
import RutilClusters          from "./RutilClusters";
import RutilHosts             from "./RutilHosts";
import RutilVms               from "./RutilVms";
import RutilTemplates         from "./RutilTemplates";
import RutilStorageDomains    from "./RutilStorageDomains";
import RutilDisks             from "./RutilDisks";
import RutilNetworks          from "./RutilNetworks";
import RutilVnicProfiles      from "./RutilVnicProfiles";
import "./RutilManager.css";

/**
 * @name RutilManager
 * @description Rutil Manager 창
 * 
 * @returns {JSX.Element} Rutil Manager 창
 * 
 * @see RutilGeneral
 * @see RutilDataCenters
 * @see RutilClusters
 * @see RutilHosts
 * @see RutilVms
 * @see RutilTemplates
 * @see RutilStorageDomains
 * @see RutilDisks
 * @see RutilNetworks
 * @see RutilVnicProfiles
 */
const RutilManager = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("info"); // 기본 탭은 info로

  const rootPath = useMemo(() => 
    location.pathname.split("/").slice(0, 2).join("/")
  , [location]) // '/computing' 또는 '/networks' 등 추출

  // Header와 Sidebar에 쓰일 섹션과 버튼 정보
  const tabs = useMemo(() => [
    { id: "info",           label: Localization.kr.GENERAL,      onClick: () => handleTabClick("info") },
    { id: "datacenters",    label: Localization.kr.DATA_CENTER,  onClick: () => handleTabClick("datacenters") },
    { id: "clusters",       label: Localization.kr.CLUSTER,      onClick: () => handleTabClick("clusters") },
    { id: "hosts",          label: Localization.kr.HOST,         onClick: () => handleTabClick("hosts") },
    { id: "vms",            label: Localization.kr.VM,           onClick: () => handleTabClick("vms") },
    { id: "templates",      label: Localization.kr.TEMPLATE,     onClick: () => handleTabClick("templates") },
    { id: "storageDomains", label: Localization.kr.DOMAIN,       onClick: () => handleTabClick("storageDomains") },
    { id: "disks",          label: Localization.kr.DISK,         onClick: () => handleTabClick("disks") },
    { id: "networks",       label: Localization.kr.NETWORK,      onClick: () => handleTabClick("networks") },
    { id: "vnicProfiles",   label: Localization.kr.VNIC_PROFILE, onClick: () => handleTabClick("vnicProfiles") },
  ], [rootPath]);

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
    tabs.find((section) => section.id === activeTab)?.label,
  ], [tabs, activeTab]);

  const renderSectionContent = useCallback(() => {
    Logger.debug(`RutilManager > renderSectionContent ...`)
    const sectionComponents = {
      info: RutilGeneral,
      datacenters: RutilDataCenters,
      clusters: RutilClusters,
      hosts: RutilHosts,
      vms: RutilVms,
      templates: RutilTemplates,
      storageDomains: RutilStorageDomains,
      disks: RutilDisks,
      networks: RutilNetworks,
      vnicProfiles: RutilVnicProfiles,
    };
    const SectionComponent = sectionComponents[activeTab] || RutilGeneral;
    return <SectionComponent />;
  }, [activeTab]);

  return (
    <SectionLayout>
      <HeaderButton title="Rutil Manager" titleIcon={rvi24Globe()} />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path pathElements={pathData} />
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
}

export default RutilManager;

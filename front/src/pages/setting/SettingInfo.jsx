import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionLayout          from "@/components/SectionLayout";
import TabNavButtonGroup      from "@/components/common/TabNavButtonGroup";
import HeaderButton           from "@/components/button/HeaderButton";
import Path                   from "@/components/Header/Path";
import SettingUsers           from "./SettingUsers";
import SettingSessions        from "./SettingSessions";
import SettingCerts    from "./SettingCerts";
import {
  rvi24Gear
} from "@/components/icons/RutilVmIcons";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./Setting.css";

/**
 * @name SettingInfo
 * @description 관리
 * (/settings/:sectionId)
 * @returns {JSX.Element} SettingInfo
 * 
 * @see App
 */
const SettingInfo = () => {
  const navigate = useNavigate();
  const { section } = useParams();
  const [activeTab, setActiveTab] = useState(section || "users"); // 초기값 설정

  const tabs = useMemo(() => [
    { id: "users",       label: Localization.kr.USER,  onClick: () => handleTabClick("users") },
    { id: "sessions",    label: "활성 사용자 세션",       onClick: () => handleTabClick("sessions") },
    // { id: "licenses",    label: "라이센싱",             onClick: () => handleTabClick("licenses") },
    // { id: "firewall", label: "방화벽" },
    { id: "certificate", label: Localization.kr.CERTIFICATE,                onClick: () => handleTabClick("certificate") },
    // { id: 'app_settings', label: '설정' },
    // { id: 'user_sessionInfo', label: '계정설정' },
  ], []);

  useEffect(() => {
    setActiveTab(!section ? "users" : section);
  }, [section]);

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`SettingInfo > handleTabClick ... tab: ${tab}`)
    const path = `/settings/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, []);
  
  const pathData = useMemo(() => [
    Localization.kr.MANAGEMENT,
    [...tabs].find((tab) => tab?.id === activeTab)?.label,
  ], [tabs, activeTab]);

  const sectionComponents = {
    users: SettingUsers,
    sessions: SettingSessions,
    // licenses: Setting,
    // firewall: Setting,
    certificate: SettingCerts,
  };

  const renderSectionContent = () => {
    const SectionComponent = sectionComponents[activeTab];
    return SectionComponent ? <SectionComponent /> : null;
  };

  return (
    <SectionLayout>
      <HeaderButton title={Localization.kr.MANAGEMENT}
        titleIcon={rvi24Gear()}
        additionalText="목록이름"
      />
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
};
export default SettingInfo;

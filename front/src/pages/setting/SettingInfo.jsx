import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import HeaderButton from "../../components/button/HeaderButton";
import NavButton from "../../components/navigation/NavButton";
import Path from "../../components/Header/Path";
import SettingUsers from "./SettingUsers";
import SettingSessions from "./SettingSessions";
import SettingCertificates from "./SettingCertificates";
import "./Setting.css";

/**
 * @name SettingInfo
 * @description 관리
 *
 * @returns {JSX.Element} SettingInfo
 */
const SettingInfo = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(section || "users"); // 초기값 설정

  const sections = [
    { id: "users", label: "사용자" },
    { id: "sessions", label: "활성 사용자 세션" },
    { id: "licenses", label: "라이센싱" },
    { id: "firewall", label: "방화벽" },
    { id: "certificate", label: "인증서" },
    // { id: 'app_settings', label: '설정' },
    // { id: 'user_sessionInfo', label: '계정설정' },
  ];

  useEffect(() => {
    if (!section) {
      setActiveTab("users");
    } else {
      setActiveTab(section);
    }
  }, [section]);

  const handleTabClick = (tab) => {
    const path = tab === "users" ? `/setting/users` : `/setting/${tab}`;
    navigate(`/settings/${tab}`);
    setActiveTab(tab);
  };
  const pathData = [
    "관리",
    sections.find((section) => section.id === activeTab)?.label,
  ];

  const sectionComponents = {
    users: SettingUsers,
    sessions: SettingSessions,
    // licenses: Setting,
    // firewall: Setting,
    certificate: SettingCertificates,
  };

  const renderSectionContent = () => {
    const SectionComponent = sectionComponents[activeTab];
    return SectionComponent ? <SectionComponent /> : null;
  };

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faCog}
        title="관리"
        // subtitle=" > 사용자 세션"
        additionalText="목록이름"
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full px-[0.5rem] py-[0.5rem]">
          <Path pathElements={pathData} />
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};
export default SettingInfo;

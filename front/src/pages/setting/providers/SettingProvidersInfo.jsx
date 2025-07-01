import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionLayout          from "@/components/SectionLayout";
import TabNavButtonGroup      from "@/components/common/TabNavButtonGroup";
import HeaderButton           from "@/components/button/HeaderButton";
import Path                   from "@/components/Header/Path";
import {
  rvi24Gear
} from "@/components/icons/RutilVmIcons";
import Localization           from "@/utils/Localization";
import useGlobal from "@/hooks/useGlobal";
import SettingProvidersGeneral from "./SettingProvidersGeneral";
import SettingProvidersToken from "./SettingProvidersToken";
import { useProvider } from "@/api/RQHook";
import useUIState from "@/hooks/useUIState";

/**
 * @name SettingInfo
 * @description 관리
 * (/settings/:sectionId)
 * @returns {JSX.Element} SettingInfo
 * 
 * @see App
 */
const SettingProvidersInfo = () => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal, } = useUIState()
  const { id: providerId, section } = useParams();
  const [activeTab, setActiveTab] = useState(section || "general");
  const { providersSelected, _setProvidersSelected } = useGlobal();

  // TODO 공급자 상세정보 필요
  const {
    data: provider,
    isError: isNetworkError,
    isLoading: isNetworkLoading,
   } = useProvider(providerId);

  useEffect(() => {
    setActiveTab(section || "general");  
  }, [section]);

  const handleTabClick = useCallback((tab) => {
    const path =
      tab === "general"
        ? `/settings/provider/${providerId}`
        : `/settings/provider/${providerId}/${tab}`;
      navigate(path);
      setActiveTab(tab);
  }, [navigate, providerId]);

  const tabs = useMemo(() => [
    { id: "general", label: Localization.kr.GENERAL, onClick: () => handleTabClick("general") },
    { id: "token", label: "인증 키", onClick: () => handleTabClick("token") },
  ], [handleTabClick]);
  
  const pathData = useMemo(() => [
    Localization.kr.MANAGEMENT,
    //provider?.name,
    [...tabs].find((tab) => tab?.id === activeTab)?.label,
  ], [provider,tabs, activeTab]);

  const sectionComponents = {
    general: SettingProvidersGeneral,    
    token: SettingProvidersToken, 
  };

  const renderSectionContent = () => {
    const SectionComponent = sectionComponents[activeTab];
    return SectionComponent ? <SectionComponent /> : null;
  };

  const sectionHeaderButtons = useMemo(() => [
    { type: "update", onClick: () => setActiveModal("provider:update"), label: Localization.kr.UPDATE,  },
    { type: "remove", onClick: () => setActiveModal("provider:remove"), label: Localization.kr.REMOVE,},
  ], [])
  
  return (
    <SectionLayout>
      <HeaderButton 
        title={"공급자 이름"}
        //title={provider?.name}
        titleIcon={rvi24Gear()}
         buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path pathElements={pathData} basePath={`/settings/provider/${providerId}`} />
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};
export default SettingProvidersInfo;

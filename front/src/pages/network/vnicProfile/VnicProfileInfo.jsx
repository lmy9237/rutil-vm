import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SectionLayout          from "@/components/SectionLayout";
import TabNavButtonGroup      from "@/components/common/TabNavButtonGroup";
import Path                   from "@/components/Header/Path";
import HeaderButton           from "@/components/button/HeaderButton";
import { 
  rvi24Lan
} from "@/components/icons/RutilVmIcons";
import VnicProfileVms         from "./VnicProfileVms";
import VnicProfileTemplates   from "./VnicProfileTemplates";

import {
  useVnicProfile
} from "@/api/RQHook";
import {
  refetchIntervalInMilli
} from "@/util";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

/**
 * @name VnicProfileInfo
 * @description ...
 *
 * @returns {JSX.Element} VnicProfileInfo
 */
const VnicProfileInfo = () => {
  const navigate = useNavigate();
  const { id: vnicProfileId, section } = useParams();
  const {
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()
  const { setVnicProfilesSelected } = useGlobal()
  const {
    data: vnicProfile, 
    isLoading: isVnicProfileLoading,
    isError: isVnicProfileError,
    isSuccess: isVnicProfileSuccess,
    isRefetching: isVnicProfileRefetching,
    refetch: refetchVnicProfile,
  } = useVnicProfile(vnicProfileId, (e) => ({...e,}));
  
  const [activeTab, setActiveTab] = useState('vms');

  const tabs = useMemo(() => [
    { id: 'vms',        label: Localization.kr.VM,        onClick: () => handleTabClick("vms") },
    { id: 'templates',  label: Localization.kr.TEMPLATE,  onClick: () => handleTabClick("templates") },
  ], []);

  const pathData = useMemo(() => ([
    vnicProfile?.name, 
    tabs.find((section) => section.id === activeTab)?.label
  ]), [vnicProfile, tabs , activeTab]);

  const renderSectionContent = useCallback(() => {
    const SectionComponent = {
      vms: VnicProfileVms,
      templates: VnicProfileTemplates
    }[activeTab];
    return SectionComponent ? <SectionComponent vnicProfileId={vnicProfileId} /> : null;
  }, [activeTab, vnicProfileId])

  const sectionHeaderButtons = [
    { type: "update", label: Localization.kr.UPDATE, onClick: () => setActiveModal("vnicprofile:update"), },
    { type: "remove", label: Localization.kr.REMOVE, onClick: () => setActiveModal("vnicprofile:remove"), },
  ]

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`VnicProfileInfo > handleTabClick ... vnicProfileId: ${vnicProfileId}, tab: ${tab}`)
    const path = tab === 'vms'
      ? `/vnicProfiles/${vnicProfileId}/vms`
      : `/vnicProfiles/${vnicProfileId}/${tab}`;
    navigate(path);
    setTabInPage("/vnicProfiles", tab);
    setActiveTab(tab);
  }, [vnicProfileId]);

  useEffect(() => {
    Logger.debug(`VnicProfileInfo > useEffect ... section: ${section}`)
    setActiveTab(section || "vms");
  }, [section]);

  useEffect(() => {
    Logger.debug(`VnicProfileInfo > useEffect ... (for Automatic Tab Switch)`)
    if (isVnicProfileError || (!isVnicProfileLoading && !vnicProfile)) {
      navigate('/vnicProfiles/vms');
    }
    const currentTabInPage = tabInPage("/vnicProfiles")
    handleTabClick(
      currentTabInPage === "" || 
      currentTabInPage === "general"
        ? "vms" : currentTabInPage
    );
    setVnicProfilesSelected(vnicProfile);
    //setActiveTab(currentTabInPage);
  }, [vnicProfile, navigate]);

  useEffect(() => {
    Logger.debug(`VnicProfileInfo > useEffect ... (for vNIC Profile status check)`)
    if (!!activeModal) return // 모달이 켜져 있을 떄 조회 및 렌더링 일시적으로 방지
    const intervalInMilli = refetchIntervalInMilli(vnicProfile?.status, true)
    Logger.debug(`VnicProfileInfo > useEffect ... look for vNIC Profile status (${vnicProfile?.status}) in ${intervalInMilli/1000} second(s)`)
    const intervalId = setInterval(() => {
      refetchVnicProfile()
    }, intervalInMilli) // 주기적 조회
    return () => {clearInterval(intervalId)}
  }, [vnicProfile])

  return (
    <SectionLayout>
      <HeaderButton title={vnicProfile?.name} titleIcon={rvi24Lan()}
        isLoading={isVnicProfileLoading} isRefetching={isVnicProfileRefetching} refetch={refetchVnicProfile}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path pathElements={pathData} basePath={`/vnicProfiles/${vnicProfileId}/vms`}/>
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default VnicProfileInfo;

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import SectionLayout from "../../../components/SectionLayout";
import TabNavButtonGroup from "../../../components/common/TabNavButtonGroup";
import Path from "../../../components/Header/Path";
import VnicProfileVms from "./VnicProfileVms";
import VnicProfileTemplates from "./VnicProfileTemplates";
import Localization from "../../../utils/Localization";
import { useVnicProfile } from "../../../api/RQHook";
import { rvi24Lan } from "../../../components/icons/RutilVmIcons";
import HeaderButton from "../../../components/button/HeaderButton";

/**
 * @name VnicProfileInfo
 * @description ...
 *
 * @returns {JSX.Element} VnicProfileInfo
 */
const VnicProfileInfo = () => {
  const navigate = useNavigate();
  const { id: vnicProfileId, section } = useParams();
  const { activeModal, setActiveModal, } = useUIState()
  const { setVnicProfilesSelected } = useGlobal()
  const {
    data: vnicProfile, 
    refetch: refetchVnicProfile,
    isError: isVnicProfileError,
    isLoading: isVnicProfileLoading,
  } = useVnicProfile(vnicProfileId, (e) => ({...e,}));
  
  const [activeTab, setActiveTab] = useState('vms');

  useEffect(() => {
    if (isVnicProfileError || (!isVnicProfileLoading && !vnicProfile)) {
      navigate('/vnicPrfiles');
    }
    setVnicProfilesSelected(vnicProfile)
  }, [isVnicProfileError, isVnicProfileLoading, vnicProfile]);

  const tabs = useMemo(() => [
    { id: 'vms',        label: Localization.kr.VM,        onClick: () => handleTabClick("vms") },
    { id: 'templates',  label: Localization.kr.TEMPLATE,  onClick: () => handleTabClick("templates") },
  ], []);

  const handleTabClick = useCallback((tab) => {
    const path = tab === 'vms' 
      ? `/vnicProfiles/${vnicProfileId}/vms`
      : `/vnicProfiles/${vnicProfileId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [vnicProfileId]);

  useEffect(() => {
    setActiveTab(section || 'vms');
  }, [section]);

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

  return (
    <SectionLayout>
      <HeaderButton title={vnicProfile?.name}
        titleIcon={rvi24Lan()}
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

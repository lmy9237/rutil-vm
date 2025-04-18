import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUIState from '../../../hooks/useUIState';
import Path from '../../../components/Header/Path';
import NavButton from '../../../components/navigation/NavButton';
import VnicProfileVms from './VnicProfileVms';
import VnicProfileTemplates from './VnicProfileTemplates';
import VnicProfileModals from '../../../components/modal/vnic-profile/VnicProfileModals';
import Localization from '../../../utils/Localization';
import { useVnicProfile } from '../../../api/RQHook';
import {rvi24Lan } from '../../../components/icons/RutilVmIcons';
import HeaderButton from '../../../components/button/HeaderButton';

/**
 * @name VnicProfileInfo
 * @description ...
 *
 * @returns {JSX.Element} VnicProfileInfo
 */
const VnicProfileInfo = () => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal, } = useUIState()
  const { id: vnicProfileId, section } = useParams();
  const {
    data: vnic, status, isRefetching, refetch, isError, error, isLoading
  } = useVnicProfile(vnicProfileId, (e) => ({...e,}));
  
  const [activeTab, setActiveTab] = useState('vms');

  useEffect(() => {
    if (isError || (!isLoading && !vnic)) {
      navigate('/vnicPrfiles');
    }
  }, [isError, isLoading, vnic, navigate]);

  const sections = [  
    { id: 'vms', label: Localization.kr.VM },
    { id: 'templates', label: '템플릿' },
  ];

  useEffect(() => {
    setActiveTab(section || 'vms');
  }, [section]);

  const handleTabClick = (tab) => {
    const path = tab === 'vms' ? `/vnicProfiles/${vnicProfileId}/vms` : `/vnicProfiles/${vnicProfileId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [vnic?.name, sections.find((section) => section.id === activeTab)?.label];

  const renderSectionContent = () => {
    const SectionComponent = {
      vms: VnicProfileVms,
      templates: VnicProfileTemplates
    }[activeTab];
    return SectionComponent ? <SectionComponent vnicProfileId={vnicProfileId} /> : null;
  };

  const sectionHeaderButtons = [
    { type: 'update', label: Localization.kr.UPDATE, onClick: () => setActiveModal("vnicprofile:update"),},
    { type: 'remove', label: Localization.kr.REMOVE, onClick: () => setActiveModal("vnicprofile:remove"), },
  ]

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Lan()}
        title={vnic?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton 
          sections={sections} 
          activeSection={activeTab} 
          handleSectionClick={handleTabClick} 
        />
        <div className="w-full info-content">
          <Path pathElements={pathData} basePath={`/vnicProfiles/${vnicProfileId}/vms`}/>
          { renderSectionContent() }
        </div>
      </div>

      {/* 클러스터 모달창 */}
      <VnicProfileModals vnicProfile={vnic} />
    </div>
  );
};

export default VnicProfileInfo;

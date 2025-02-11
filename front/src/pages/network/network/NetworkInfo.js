import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import NavButton from '../../../components/navigation/NavButton';
import HeaderButton from '../../../components/button/HeaderButton';
import Footer from '../../../components/footer/Footer';
import Path from '../../../components/Header/Path';
import NetworkModals from '../../../components/modal/network/NetworkModals';
import NetworkGeneral from './NetworkGeneral';
import NetworkVnicProfiles from './NetworkVnicProfiles';
import NetworkHosts from './NetworkHosts';
import NetworkVms from './NetworkVms'
import NetworkTemplates from './NetworkTemplates'
import NetworkClusters from './NetworkClusters';
import { useNetworkById } from '../../../api/RQHook';

const NetworkInfo = () => {
  const navigate = useNavigate();
  const { id: networkId, section } = useParams();
  const {
    data: network, isError, isLoading
  } = useNetworkById(networkId);

  const [activeTab, setActiveTab] = useState('general');
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isError || (!isLoading && !network)) {
      navigate('/networks');
    }
  }, [isError, isLoading, network, navigate]);
  
  const sections = [
    { id: 'general', label: '일반' },
    { id: 'vnicProfiles', label: 'vNIC 프로파일' },
    { id: 'clusters', label: '클러스터' },
    { id: 'hosts', label: '호스트' },
    { id: 'vms', label: '가상머신' },
    { id: 'templates', label: '템플릿' },
  ];

  useEffect(() => {
    setActiveTab(section || 'general');
  }, [section]);

  const handleTabClick = (tab) => {
    const path = tab === 'general' ? `/networks/${networkId}` : `/networks/${networkId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [network?.name, sections.find((section) => section.id === activeTab)?.label];

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
    { type: 'edit', label: '편집', onClick: () => openModal("edit")},
    { type: 'delete', label: '삭제', onClick: () => openModal("delete") },
  ];
  

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faServer}
        title={network?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton 
          sections={sections} 
          activeSection={activeTab} 
          handleSectionClick={handleTabClick} 
        />
        <div className="w-full px-[0.5rem] py-[0.5rem]"
>
          <Path pathElements={pathData} />
          {renderSectionContent()}
        </div>
      </div>

      {/* 네트워크 모달창 */}
      <NetworkModals
        activeModal={activeModal}
        network={network}
        selectedNetworks={network}
        onClose={closeModal}
      />
      <Footer/>
    </div>
  );
};

export default NetworkInfo;
import React, { useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderButton from '../../../components/button/HeaderButton';
import Footer from '../../../components/footer/Footer';
import Path from '../../../components/Header/Path';
import { adjustFontSize } from '../../../UIEvent';
import { faLaptop, } from '@fortawesome/free-solid-svg-icons'
import NavButton from '../../../components/navigation/NavButton';
import VnicProfileVms from './VnicProfileVms';
import VnicProfileTemplates from './VnicProfileTemplates';
import { useVnicProfile } from '../../../api/RQHook';
import VnicProfileModals from './modal/VnicProfileModals';

const VnicProfileInfo = () => {
  const navigate = useNavigate();
  const { id: vnicProfileId, section } = useParams();
  const {
    data: vnic, status, isRefetching, refetch, isError, error, isLoading
  } = useVnicProfile(vnicProfileId, (e) => ({...e,}));

  // const [modals, setModals] = useState({ edit: false, delete: false });
  
  const [activeTab, setActiveTab] = useState('vms');
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isError || (!isLoading && !vnic)) {
      navigate('/vnicPrfiles');
    }
  }, [isError, isLoading, vnic, navigate]);

  const sections = [  
    { id: 'vms', label: '가상머신' },
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
      { type: 'edit', label: '편집', onClick: () => openModal('edit'),},
      { type: 'delete', label: '삭제', onClick: () => openModal('delete'), },
  ]

  useEffect(() => {
      window.addEventListener('resize', adjustFontSize);
      adjustFontSize();
      return () => { window.removeEventListener('resize', adjustFontSize); };
  }, []);

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faLaptop}
        title={vnic?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton 
          sections={sections} 
          activeSection={activeTab} 
          handleSectionClick={handleTabClick} 
        />
        <div className="host-btn-outer">
          <Path pathElements={pathData} />
          { renderSectionContent() }
        </div>
      </div>

      {/* 클러스터 모달창 */}
      <VnicProfileModals
        activeModal={activeModal}
        vnicProfile={vnic}
        selectedVnicProfiles={vnic}
        onClose={closeModal}
      />
      <Footer/>
    </div>
  );
};

export default VnicProfileInfo;

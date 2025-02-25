import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import NavButton from '../../../components/navigation/NavButton';
import HeaderButton from '../../../components/button/HeaderButton';
import Footer from '../../../components/footer/Footer';
import Path from '../../../components/Header/Path';
import DomainModals from '../../../components/modal/domain/DomainModals';
import DomainGeneral from './DomainGeneral';
import DomainDatacenters from './DomainDatacenters';
import DomainVms from './DomainVms';
import DomainEvents from './DomainEvents';
import DomainDisks from './DomainDisks';
import DomainTemplates from './DomainTemplates';
import DomainDiskSnapshots from './DomainDiskSnapshots';
import DomainGetVms from './DomainGetVms';
import DomainGetTemplates from './DomainGetTemplates';
import DomainGetDisks from './DomainGetDisks';
import { useDomainById, useOvfUpdateDomain, useRefreshLunDomain } from '../../../api/RQHook';

/**
 * @name DomainInfo
 * @description 도메인 정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainInfo
 */
const DomainInfo = () => {
  const navigate = useNavigate();
  const { id: domainId, section } = useParams();
  const { data: domain } = useDomainById(domainId);
  const { mutate: refreshDomain } = useRefreshLunDomain();
  const { mutate: ovfUpdateDomain } = useOvfUpdateDomain();

  const [activeTab, setActiveTab] = useState('general');
  const [activeModal, setActiveModal] = useState(null);
  
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  const sections = [
    { id: 'general', label: '일반' },
    { id: 'datacenters', label: '데이터 센터' },
    { id: 'vms', label: '가상머신' },
    { id: 'getVms', label: '가상머신 가져오기' },
    { id: 'templates', label: '템플릿' },
    { id: 'getTemplates', label: '템플릿 가져오기' },
    { id: 'disks', label: '디스크' },
    { id: 'getDisks', label: '디스크 불러오기' },
    { id: 'diskSnapshots', label: '디스크 스냅샷' },
    { id: 'events', label: '이벤트' },
  ];

  useEffect(() => {
    setActiveTab(section || 'general');
  }, [section]);

  const handleTabClick = (tab) => {
    const path = tab === 'general' ? `/storages/domains/${domainId}` : `/storages/domains/${domainId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [domain?.name, sections.find((section) => section.id === activeTab)?.label];

  const renderSectionContent = () => {
    const SectionComponent = {
      general: DomainGeneral,
      datacenters: DomainDatacenters,
      vms: DomainVms,
      getVms: DomainGetVms,
      templates: DomainTemplates,
      getTemplates: DomainGetTemplates,
      disks: DomainDisks,
      getDisks: DomainGetDisks,
      diskSnapshots: DomainDiskSnapshots,
      events: DomainEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent domainId={domainId} /> : null;
  };

  const handleUpdateOvf = async () => {
    if (!domainId) return;
    ovfUpdateDomain(domainId)
    console.error("OVF 업데이트");
  };

  const handleRefresh = async () => {
    if (!domainId) return;
    refreshDomain(domainId)
    console.error("디스크 검사");
  };

  const sectionHeaderButtons = [
    { type: 'edit', label: '도메인 편집', onClick: () => openModal("edit")},
    { type: 'delete', label: '삭제', onClick: () => openModal("delete")},
    { type: 'destroy', label: '파괴', onClick: () => openModal("destroy")},
  ];

  const popupItems = [
    { type: "updateOvf", label: "OVF 업데이트", onClick: handleUpdateOvf },
    { type: "refreshlun", label: "디스크 검사", onClick: handleRefresh },
  ];

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faDatabase}
        title={domain?.name}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
      />
      <div className="content-outer">
        <NavButton 
          sections={sections} 
          activeSection={activeTab} 
          handleSectionClick={handleTabClick} 
        />
        <div className="w-full px-[0.5rem] py-[0.5rem] info-content">
          <Path pathElements={pathData} basePath={`/storages/domains/${domainId}`}/>
          {renderSectionContent()}
        </div>
      </div>
      
      {/* domain 모달창 */}
      <DomainModals
        activeModal={activeModal}
        domain={domain}
        selectedClusters={domain}
        onClose={closeModal}
      />
      {/* <Footer/> */}
    </div>
  );
};

export default DomainInfo;
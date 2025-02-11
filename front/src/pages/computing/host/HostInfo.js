import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import NavButton from '../../../components/navigation/NavButton';
import HeaderButton from '../../../components/button/HeaderButton';
import Footer from '../../../components/footer/Footer';
import Path from '../../../components/Header/Path';
import HostGeneral from './HostGeneral';
import HostVms from './HostVms'
import HostNics from './HostNics'
import HostDevices from './HostDevices';
import HostEvents from './HostEvents'
import HostModals from '../../../components/modal/host/HostModals';
import { renderHostStatus } from '../../../components/Icon';
import { useHost } from '../../../api/RQHook';
import './Host.css';

/**
 * @name HostInfo
 * @description 호스트 종합페이지
 * (/computing/hosts/<hostId>)
 * 
 * @param {string} hostId 호스트 ID
 * 
 * @see HostGeneral
 * @see HostVms
 * @see HostNics
 * @see HostDevices
 * @see HostEvents
 * @see HostModals
 * 
 * @returns
 */
const HostInfo = () => {
  const navigate = useNavigate();
  const { id: hostId, section } = useParams();
  const { 
    data: host, isError, error, isLoading 
  } = useHost(hostId);

  const isUp = host?.status === 'UP';
  const isMaintenance = host?.status === 'MAINTENANCE';

  const [activeTab, setActiveTab] = useState('general');
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isError || (!isLoading && !host)) {
      navigate('/computing/rutil-manager/hosts');
    }
  }, [isError, isLoading, host, navigate]);

  const sections = [
    { id: 'general', label: '일반' },
    { id: 'vms', label: '가상머신' },
    { id: 'nics', label: '네트워크 인터페이스' },
    { id: 'devices', label: '호스트 장치' },
    { id: 'events', label: '이벤트' },
  ];

  useEffect(() => {
    setActiveTab(section || 'general');
  }, [section]);

  const handleTabClick = (tab) => {
    const path = (tab === 'general') 
      ? `/computing/hosts/${hostId}`
      : `/computing/hosts/${hostId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [host?.name, sections.find((section) => section.id === activeTab)?.label];

  // 탭 메뉴 관리
  const renderSectionContent = () => {
    const SectionComponent = {
      general: HostGeneral,
      vms: HostVms,
      nics: HostNics,
      devices: HostDevices,
      events: HostEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent hostId={hostId} /> : null;
  };

  // 편집, 삭제 버튼들
  const sectionHeaderButtons = [
    { type: 'edit', label: '편집', disabled: !isUp, onClick: () => openModal("edit")},
    { type: 'delete', label: '삭제', disabled: !isMaintenance, onClick: () => openModal("delete") },
  ];

  const popupItems = [
    { type: 'deactivate', label: '유지보수', disabled: !isUp, onClick: () => openModal('deactivate') },
    { type: 'activate', label: '활성화', disabled: !isMaintenance, onClick: () => openModal('activate') },
    { type: 'restart', label: '재시작', disabled: !isUp, onClick: () => openModal('restart') },
    { type: 'reInstall', label: '다시 설치', disabled: isUp, onClick: () => openModal('reInstall') },
    { type: 'register', label: '인증서 등록', disabled: isUp, onClick: () => openModal('register') },
    { type: 'haOn', label: '글로벌 HA 유지 관리를 활성화', disabled: !isUp, onClick: () => openModal('haOn') },
    { type: 'haOff', label: '글로벌 HA 유지 관리를 비활성화', disabled: !isUp, onClick: () => openModal('haOff') },
  ];

  console.log("...")
  return (
    <div id="section">
      <HeaderButton
        titleIcon={faUser}
        title={host?.name}
        status={renderHostStatus(host?.status)}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
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
      
      {/* 호스트 모달창 */}
      <HostModals
        activeModal={activeModal}
        host={host}
        selectedHosts={host}
        onClose={closeModal}
      />
      <Footer/>
    </div>
  );
};

export default HostInfo;
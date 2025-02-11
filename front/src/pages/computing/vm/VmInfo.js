import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderButton from '../../../components/button/HeaderButton';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../../components/footer/Footer';
import NavButton from '../../../components/navigation/NavButton';
import Path from '../../../components/Header/Path';
import VmModals from '../../../components/modal/vm/VmModals';
import { renderVmStatus } from '../../../components/Icon';
import VmGeneral from './VmGeneral';
import VmHostDevices from './VmHostDevices';
import VmEvents from './VmEvents';
import VmApplications from './VmApplications';
import VmSnapshots from './VmSnapshots';
import VmNics from './VmNics';
import VmDisks from './VmDisks';
import { useVmById } from '../../../api/RQHook';
import './css/Vm.css';

const VmInfo = () => {
  const navigate = useNavigate();
  const { id: vmId, section } = useParams();
  const { 
    data: vm, isError, error, isLoading
  } = useVmById(vmId);

  const isUp = vm?.status === 'UP';
  const isMaintenance = vm?.status === 'MAINTENANCE';

  const [activeTab, setActiveTab] = useState('general');
  const [activeModal, setActiveModal] = useState(null);
  
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isError || (!isLoading && !vm)) {
      navigate('/computing/vms');
    }
  }, [isError, isLoading, vm, navigate]);

  const sections = [
    { id: 'general', label: '일반' },
    { id: 'nics', label: '네트워크 인터페이스' },
    { id: 'disks', label: '디스크' },
    { id: 'snapshots', label: '스냅샷' },
    { id: 'applications', label: '애플리케이션' },
    { id: 'hostDevices', label: '호스트 장치' },
    { id: 'events', label: '이벤트' }
  ];
  
  useEffect(() => {
    setActiveTab(section || 'general');
  }, [section]);

  const handleTabClick = (tab) => {
    const path = tab === 'general' ? `/computing/vms/${vmId}` : `/computing/vms/${vmId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [vm?.name, sections.find(section => section.id === activeTab)?.label];
  
  // 탭 메뉴 관리
  const renderSectionContent = () => {
    const SectionComponent = {
      general: VmGeneral,
      nics: VmNics,
      disks: VmDisks,
      snapshots: VmSnapshots,
      applications: VmApplications,
      hostDevices: VmHostDevices,
      events: VmEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent vmId={vmId} /> : null;
  };

  const sectionHeaderButtons = [
    { type: 'edit', label: '편집', disabled: !isUp, onClick: () => openModal("edit")},
    { type: 'start', label: '실행', disabled: !isMaintenance, onClick: () => openModal("start") },
    { type: 'pause', label: '일시중지', disabled: !isUp, onClick: () => openModal("pause") },
    { type: 'reboot', label: '재부팅', disabled: !isUp, onClick: () => openModal("reboot") },
    { type: 'reset', label: '재설정', disabled: !isUp, onClick: () => openModal("reset") },
    { type: 'stop', label: '종료', disabled: !isUp, onClick: () => openModal("stop") },
    { type: 'powerOff', label: '전원 끔', disabled: !isUp, onClick: () => openModal("powerOff") },
    { type: 'snapshots', label: '스냅샷 생성', },
    { type: 'migration', label: '마이그레이션', }
  ];
    
  const popupItems = [
    { type: 'import', label: '가져오기', onClick: () => openModal('import') },
    { type: 'copyVm', label: '가상 머신 복제',onClick: () => openModal('copyVm')  },
    { type: 'delete', label: '삭제', disabled: !isMaintenance, onClick: () => openModal("delete") },
    { type: 'templates', label: '템플릿 생성', onClick: () => openModal('templates') },
    { type: 'ova', label: 'OVA로 내보내기' ,onClick: () => openModal('ova') }
  ];

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faMicrochip}
        title={vm?.name}
        status={renderVmStatus(vm?.status)}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
      />
      <div className="content-outer">
        <NavButton 
          sections={sections} 
          activeSection={activeTab} 
          handleSectionClick={handleTabClick}  
        />
        <div className="host-btn-outer">
          <Path pathElements={pathData} />
          {renderSectionContent()}
        </div>
      </div>

      {/* vm 모달창 */}
      <VmModals
        activeModal={activeModal}
        vm={vm}
        selectedVms={vm}
        onClose={closeModal}
      />
      <Footer/>
    </div>
  );
};

export default VmInfo;

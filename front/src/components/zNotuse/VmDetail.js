import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import HeaderButton from '../button/HeaderButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faInfoCircle,
  faExclamationTriangle,
  faMicrochip
} from '@fortawesome/free-solid-svg-icons';
import './css/Vm.css';
import Footer from '../footer/Footer';
import NavButton from '../navigation/NavButton';
import Path from '../Header/Path';
import { useVmById } from '../../api/RQHook';
import VmGeneral from '../../pages/computing/vm/VmGeneral';
import VmHostDevice from '../../pages/computing/vm/VmHostDevices';
import VmEvent from '../../pages/computing/vm/VmEvent';
import VmApplication from '../../pages/computing/vm/VmApplications';
import VmSnapshot from '../../pages/computing/vm/VmSnapshots';
import VmNetwork from '../../pages/computing/vm/VmNics';
import VmDisk from '../../pages/computing/vm/VmDisks';
import VmModals from '../modal/vm/VmModals';
import VmActionModal from '../modal/vm/VmActionModal';

// React Modal 설정
Modal.setAppElement('#root');


const VmDetail = () => {
  const { id, section } = useParams();
  const [activeNavTab, setActiveNavTab] = useState('general');
  const handleNavTabClick = (tab) => {
    setActiveNavTab(tab);
    if (tab !== 'general') {
      navigate(`/computing/vms/${id}/${tab}`);
    } else {
      navigate(`/computing/vms/${id}`);
    }
  };
  useEffect(() => {
    if (!section) {
      setActiveNavTab('general');
    } else {
      setActiveNavTab(section);
    }
  }, [section]);

  const openPopup = (popupType) => {
    setActivePopup(popupType);
    setActiveSection('common'); // 팝업을 열 때 항상 '일반' 섹션으로 설정
    setSelectedModalTab('common'); // '일반' 탭이 기본으로 선택되게 설정
    setIsModalOpen(true); // 모달 창 열림
    setAction(popupType); // 선택된 액션 설정
    setSelectedVm(vm); // 현재 VM 데이터 설정
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 창 닫힘
    setActivePopup(null);  // 팝업 상태 초기화
    setActiveSection('common'); // 모달 닫을 때 '일반' 섹션으로 초기화
    setSelectedModalTab('common'); // 편집모달창 초기화
    setIsModalOpen(false); // 모달 닫기
    setAction(null); // 액션 초기화
  };



  const [activePopup, setActivePopup] = useState(null);
  const closePopup = () => {
    setActivePopup(null);
    setActiveSection('common_outer'); // 팝업을 닫을 때도 상태 초기화
    setIsModalOpen(false); // 팝업 닫기
  };
  const handleTabClickModal = (tab) => {
    setSelectedTab(tab);
  };
  const [selectedTab, setSelectedTab] = useState('network_new_common_btn');
  const [activeSection, setActiveSection] = useState('common_outer');

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // 생성 팝업 상태
  const [selectedModalTab, setSelectedModalTab] = useState('common');
  // 탭 클릭 핸들러
  const handleTabModalClick = (tab) => {
    setSelectedModalTab(tab);
  };

  const [modals, setModals] = useState({
    edit: false,
    delete: false,
    pause: false,
    stop: false,
  });

  const toggleModal = (type, isOpen) => {
    setModals((prev) => ({
      ...prev,
      [type]: isOpen,
    }));
  };

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFooterContentVisible, setFooterContentVisibility] = useState(false);
  const [selectedFooterTab, setSelectedFooterTab] = useState('recent');
  const handleSectionClick = (name) => {
    setActiveSection(name);
    navigate(`/computing/vms/${id}/${name}`);
  };

  const toggleFooterContent = () => {
    setFooterContentVisibility(!isFooterContentVisible);
  };

  const handleFooterTabClick = (tab) => {
    setSelectedFooterTab(tab);
  };
  const [activeTab, setActiveTab] = useState('img');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [action, setAction] = useState(null); // 현재 동작
  const [selectedVm, setSelectedVm] = useState(null);

  const handleActionClick = (actionType) => {
    if (actionType === 'templates') {
      navigate('/computing/vms/templates');
    } else {
      setAction(actionType); // 현재 동작 설정
      setIsModalOpen(true); // 모달 열기
    }
  };

  const handleCreate = () => handleActionClick('create');
  const handleEdit = () => selectedVm?.id && handleActionClick('edit');


  const sections = [
    { id: 'general', label: '일반' },
    { id: 'disks', label: '디스크' },
    { id: 'snapshots', label: '스냅샷' },
    { id: 'network', label: '네트워크 인터페이스' },
    { id: 'applications', label: '애플리케이션' },
    { id: 'hostDevices', label: '호스트 장치' },
    { id: 'events', label: '이벤트' }
  ];

  // headerbutton 컴포넌트
  const buttons = [
    // { id: 'new_btn', label: '새로 만들기',onClick:() => openPopup('new')},
    { id: 'edit_btn', label: '편집', onClick: () => openPopup('edit') },
    { id: 'run_btn', label: <><i className="fa fa-play"></i> 실행</>, onClick: () => toggleModal('start', true) },
    { id: 'pause_btn', label: '일시중지', onClick: () => toggleModal('pause', true) },
    { id: 'stop_btn', label: <><i className="fa fa-stop"></i> 종료</>, onClick: () => toggleModal('stop', true) },
    { id: 'reboot_btn', label: <><i className="fa fa-repeat"></i> 재부팅</>, onClick: () => toggleModal.log('reboot', true) },
    { id: 'snapshot_btn', label: '스냅샷 생성', onClick: () => openPopup('snapshots') },
    { id: 'migration_btn', label: '마이그레이션', onClick: () => openPopup('migration') },
  ];
  const popupItems = [
    { id: 'import', label: '가져오기', onClick: () => openPopup('onExport') },
    { id: 'clone_vm', label: '가상 머신 복제', onClick: () => openPopup('vm_copy') },
    { id: 'delete', label: '삭제', onClick: () => openPopup('delete') },
    { id: 'create_template', label: '템플릿 생성', onClick: () => openPopup('addTemplate') },
    { id: 'export_ova', label: 'OVA로 내보내기', onClick: () => openPopup('exportova') }
  ];

  const [shouldRefresh, setShouldRefresh] = useState(false);
  const {
    data: vm,
    status: vmStatus,
    isRefetching: isVmRefetching,
    refetch: vmRefetch,
    isError: isVmError,
    error: vmError,
    isLoading: isVmLoading,
  } = useVmById(id);
  useEffect(() => {
    if (vm) {
      setSelectedVm(vm);
    }
  }, [vm]);
  useEffect(() => {
    if (shouldRefresh) {
      vmRefetch();
    }
  }, [shouldRefresh, vmRefetch]);


  const pathData = [vm?.name, sections.find(section => section.id === activeNavTab)?.label];
  const renderSectionContent = () => {
    switch (activeNavTab) {
      case 'general':
        return <VmGeneral vm={vm} />;
      case 'disks':
        return <VmDisk vm={vm} />;
      case 'network':
        return <VmNetwork vm={vm} />;
      case 'snapshots':
        return <VmSnapshot vm={vm} />;
      case 'applications':
        return <VmApplication vm={vm} />;
      case 'events':
        return <VmEvent vm={vm} />;
      case 'hostDevices':
        return <VmHostDevice vm={vm} />;
      default:
        return <VmGeneral vm={vm} />;
    }
  };

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faMicrochip}
        title={vm?.name}
        buttons={buttons}
        popupItems={popupItems}
      />

      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeNavTab}
          handleSectionClick={handleNavTabClick}
        />
        <div className="host-btn-outer">
          {activeNavTab !== 'general' && <Path pathElements={pathData} />}
          {renderSectionContent()}
        </div>
      </div>

      <VmModals
        isModalOpen={isModalOpen}
        action={action}
        onRequestClose={closePopup}
        selectedVm={vm}
      />
      {Object.keys(modals).map((key) => {
        const label = buttons.find((item) => item.id === `${key}_btn`)?.label || key;
        return (
          modals[key] && (
            <VmActionModal
              key={key}
              isOpen={modals[key]}
              action={key}
              onRequestClose={() => toggleModal(key, false)}
              contentLabel={label}
              data={vm}
            />
          )
        );
      })}
      <Footer />
      {/*새로만들기(생성)추가팝업 */}
      {/* <Modal
       isOpen={isCreatePopupOpen}
       onRequestClose={() => setIsCreatePopupOpen(false)}
      contentLabel="새 가상 디스크"
      className="Modal"
      overlayClassName="modalOverlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage_disk_new_popup">
        <div className="popup_header">
          <h1>새 가상 디스크</h1>
          <button onClick={() => setIsCreatePopupOpen(false)}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
        </div>
        <div className="disk_new_nav">
          <div
            id="storage_img_btn"
            onClick={() => handleTabClick('img')}
            className={activeTab === 'img' ? 'active' : ''}
          >
            이미지
          </div>
          <div
            id="storage_directlun_btn"
            onClick={() => handleTabClick('directlun')}
            className={activeTab === 'directlun' ? 'active' : ''}
          >
            직접LUN
          </div>
          
        </div>
 
        {activeTab === 'img' && (
          <div className="disk_new_img">
            <div className="disk_new_img_left">
              <div className="img_input_box">
                <span>크기(GIB)</span>
                <input type="text" />
              </div>
              <div className="img_input_box">
                <span>별칭</span>
                <input type="text" />
              </div>
              <div className="img_input_box">
                <span>설명</span>
                <input type="text" />
              </div>
              <div className="img_select_box">
                <label htmlFor="os">데이터 센터</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">스토리지 도메인</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">할당 정책</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">디스크 프로파일</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
            </div>
            <div className="disk_new_img_right">
              <div>
                <input type="checkbox" id="reset_after_deletion" checked/>
                <label htmlFor="reset_after_deletion">부팅 가능</label>
              </div>
              <div>
                <input type="checkbox" className="shareable" />
                <label htmlFor="shareable">공유 가능</label>
              </div>
              <div>
                <input type="checkbox" id="incremental_backup" defaultChecked />
                <label htmlFor="incremental_backup">읽기 전용</label>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'directlun' && (
          <div id="storage_directlun_outer">
            <div id="storage_lun_first">
              <div className="disk_new_img_left">
                <div className="img_input_box">
                  <span>별칭</span>
                  <input type="text" />
                </div>
                <div className="img_input_box">
                  <span>설명</span>
                  <input type="text" />
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">데이터 센터</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">호스트</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">스토리지 타입</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
              </div>
              <div className="disk_new_img_right">
                <div>
                  <input type="checkbox" className="shareable" />
                  <label htmlFor="shareable">공유 가능</label>
                </div>
              </div>
            </div>
          </div>
        )}
      
        <div className="edit_footer">
          <button style={{ display: 'none' }}></button>
          <button>OK</button>
          <button onClick={() => setIsCreatePopupOpen(false)}>취소</button>
        </div>
      </div>
        </Modal> */}

      {/*...버튼 가상머신복제 팝업 */}
      {/* <Modal
        isOpen={activePopup === 'vm_copy'}
        onRequestClose={closePopup}
        contentLabel="디스크 업로드"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="vm_copy_popup">
            <div className="popup_header">
                <h1>가상머신 복제</h1>
                <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
            </div>
         
            <div className="edit_first_content">
                          <div>
                                <label htmlFor="cluster">클러스터</label>
                                <select id="cluster">
                                    <option value="default">Default</option>
                                </select>
                                <div className='datacenter_span'>데이터센터 Default</div>
                            </div>

                            <div className='disabled'>
                                <label htmlFor="template" style={{ color: 'gray' }}>템플릿에 근거</label>
                                <select id="template" disabled>
                                    <option value="test02">test02</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="os">운영 시스템</label>
                                <select id="os">
                                    <option value="linux">Linux</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="firmware">칩셋/펌웨어 유형</label>
                                <select id="firmware">
                                    <option value="bios">BIOS의 Q35 칩셋</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '2%' }}>
                                <label htmlFor="optimization">최적화 옵션</label>
                                <select id="optimization">
                                    <option value="server">서버</option>
                                </select>
                            </div>
            </div>

            <div className='template_edit_texts'>
                <div className='host_textbox'>
                    <label htmlFor="user_name">이름</label>
                    <input type="text" id="user_name" value={'#'} />
                </div>
                <div className='host_textbox'>
                    <label htmlFor="description">설명</label>
                    <input type="text" id="description" />
                </div>
                <div className='host_textbox'>
                    <label htmlFor="comment">코멘트</label>
                    <input type="text" id="comment" />
                </div>
            </div>

            <div className='flex mb-1.5'>
            <div className="vnic_new_checkbox">
                <input type="checkbox" id="stateless" />
                <label htmlFor="stateless">상태 비저장</label>
            </div>
            <div className="vnic_new_checkbox">
                <input type="checkbox" id="start_in_pause_mode" />
                <label htmlFor="start_in_pause_mode">일시정지 모드에서 시작</label>
            </div>
            <div className="vnic_new_checkbox">
                <input type="checkbox" id="prevent_deletion" />
                <label htmlFor="prevent_deletion">삭제 방지</label>
            </div>
            </div>

            <span className='edit_fourth_span'>vNIC 프로파일을 선택하여 가상 머신 네트워크 인터페이스를 인스턴스화합니다.</span>
            <div className="edit_fourth_content" style={{ borderTop: 'none' }}>
                
                <div className='edit_fourth_content_select flex'>
                    <label htmlFor="network_adapter">네트워크 어댑터 1</label>
                    <select id="network_adapter">
                        <option value="default">Default</option>
                    </select>
                </div>
                <div className='flex'>
                    <button>+</button>
                    <button>-</button>
                </div>
            </div>
        

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
        </Modal> */}
    </div>
  );
};

export default VmDetail;

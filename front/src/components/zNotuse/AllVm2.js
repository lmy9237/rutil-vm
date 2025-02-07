import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import HeaderButton from '../button/HeaderButton';
import './css/Vm.css';
import Footer from '../../footer/Footer';
import {useAllVMs } from '../../api/RQHook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDesktop, faInfoCircle, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';
import VmDu from '../../duplication/VmDu';
import { Tooltip } from 'react-tooltip';
import TableColumnsInfo from '../table/TableColumnsInfo';
import VmDupl from '../../duplication/VmDupl';

// React Modal 설정
Modal.setAppElement('#root');

const AllVm = () => {
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('common');
  const openModal = () => setIsModalOpen(true);


 // 모달 관련 상태 및 함수
 const openPopup = (popupType) => {
    setActivePopup(popupType);
    setActiveSection('common'); // 팝업을 열 때 항상 '일반' 섹션으로 설정
    setSelectedModalTab('common'); // '일반' 탭이 기본으로 선택되게 설정
    setIsModalOpen(true); // 모달 창 열림
};

const closeModal = () => {
    setIsModalOpen(false); // 모달 창 닫힘
    setActivePopup(null);  // 팝업 상태 초기화
    setActiveSection('common'); // 모달 닫을 때 '일반' 섹션으로 초기화
    setSelectedModalTab('common'); // 편집모달창 초기화
};

// 추가모달
const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false); // 연결 팝업 상태
const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false); // 생성 팝업 상태
const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // 생성 팝업 상태


 

   // 탭 상태 정의 (기본 값: 'ipv4')
   const [selectedModalTab, setSelectedModalTab] = useState('common');
   // 탭 클릭 핸들러

 
   const [selectedVms, setSelectedVms] = useState(null);

   const { 
    data: vms, 
    status: vmsStatus,
  } = useAllVMs((e) => {
    return {
      ...e,
      status: e?.status,
      host: e?.hostVo?.name,
      hostId: e?.hostVo?.id,
      cluster: e?.clusterVo?.name,
      clusterId: e?.clusterVo?.id,
      dataCenter: e?.dataCenterVo?.name,
      dataCenterId: e?.dataCenterVo?.id,
      memoryUsage: e?.usageDto.memoryPercent === null ? '' : e?.usageDto.memoryPercent + '%',
      cpuUsage: e?.usageDto.cpuPercent === null ? '' : e?.usageDto.cpuPercent + '%',
      networkUsage: e?.usageDto.networkPercent === null ? '' : e?.usageDto.networkPercent + '%',
    }
  });
  const renderStatusIcon = (status) => {
    if (status === 'UP') {
      return <FontAwesomeIcon icon={faPlay} fixedWidth style={{ color: 'lime', fontSize: '0.3rem', transform: 'rotate(270deg)' }} />;
    } else if (status === 'DOWN') {
      return <FontAwesomeIcon icon={faPlay} fixedWidth style={{ color: 'red', fontSize: '0.3rem', transform: 'rotate(90deg)' }} />;
    }
    return status;
  };
  return (
    <div id="section">
      <HeaderButton
        titleIcon={faDesktop}
        title="가상머신"
        subtitle=""
        buttons={[]}
        popupItems={[]}
        openModal={openModal}
        togglePopup={() => {}}
      />
      <div className="host_btn_outer">
      <>
      <VmDupl
        vms={vms || []}
        columns={TableColumnsInfo.VMS}
      />
    </>
      </div>  
  
      
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
        {/* 편집팝업 */}
        {/* <Modal
            isOpen={activePopup === 'edit'}
    onRequestClose={closeModal}
    contentLabel="가상머신 편집"
    className="Modal"
    overlayClassName="Overlay"
            shouldCloseOnOverlayClick={false}
          >
        <div className="vm_edit_popup">
            <div className="popup_header">
                <h1>가상머신 편집</h1>
                <button onClick={closeModal}>
                    <FontAwesomeIcon icon={faTimes} fixedWidth />
                </button>
            </div>
            <div className='vm_edit_popup_content'>
                <div className='vm_new_nav' style={{
                    fontSize: '0.33rem',
                    height: '71vh',
                    width: '30%',
                    backgroundColor: '#FAFAFA',
                    borderRight: '1px solid #ddd',
                    boxShadow: '1px 0 5px rgba(0, 0, 0, 0.1)',
                    fontWeight: 800
                }}>
                    <div
                    id="common_tab"
                    className={selectedModalTab === 'common' ? 'active-tab' : 'inactive-tab'}
                    onClick={() => setSelectedModalTab('common')}
                    >
                    일반
                    </div>
                    <div
                    id="system_tab"
                    className={selectedModalTab === 'system' ? 'active-tab' : 'inactive-tab'}
                    onClick={() => setSelectedModalTab('system')}
                    >
                    시스템
                    </div>
                    <div
                    id="host_tab"
                    className={selectedModalTab === 'host' ? 'active-tab' : 'inactive-tab'}
                    onClick={() => setSelectedModalTab('host')}
                    >
                    호스트
                    </div>
                    <div
                    id="ha_mode_tab"
                    className={selectedModalTab === 'ha_mode' ? 'active-tab' : 'inactive-tab'}
                    onClick={() => setSelectedModalTab('ha_mode')}
                    >
                    고가용성
                    </div>
                    <div
                    id="res_alloc_tab"
                    className={selectedModalTab === 'res_alloc' ? 'active-tab' : 'inactive-tab'}
                    onClick={() => setSelectedModalTab('res_alloc')}
                    >
                    리소스 할당
                    </div>
                    <div
                    id="boot_option_tab"
                    className={selectedModalTab === 'boot_outer' ? 'active-tab' : 'inactive-tab'}
                    onClick={() => setSelectedModalTab('boot_outer')}
                    >
                    부트 옵션
                    </div>

                </div>

            
            <div className="vm_edit_select_tab">
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
                {selectedModalTab === 'common' && 
                <>
                        <div className="edit_second_content mb-1">
                            <div>
                                <label htmlFor="name">이름</label>
                                <input type="text" id="name" value="test02" />
                            </div>
                            <div>
                                <label htmlFor="description">설명</label>
                                <input type="text" id="description" />
                            </div>
                            <div>
                                <label htmlFor="comment">코멘트</label>
                                <input type="text" id="comment" />
                            </div>
                        </div>

                        <div className="instance_image">
                            <span>인스턴스 이미지</span><br/>
                            <div>
                                <div>on20-apm_Disk1_c1: (2 GB) 기존</div>
                                <div className='flex'>
                                    <button className='mr-1' onClick={() => setIsEditPopupOpen(true)}>편집</button>
                                    <button>+</button>
                                    <button>-</button>
                                </div>
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
                </>
                }
                {selectedModalTab === 'system' && 
                <>
                  
                    <div className="edit_second_content">
                            <div>
                                <label htmlFor="memory_size">메모리 크기</label>
                                <input type="text" id="memory_size" value="2048 MB" readOnly />
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="max_memory">최대 메모리</label>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/>
                                </div>
                                <input type="text" id="max_memory" value="8192 MB" readOnly />
                            </div>

                            <div>
                                <div>
                                    <label htmlFor="actual_memory">할당할 실제 메모리</label>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/>
                                </div>
                                <input type="text" id="actual_memory" value="2048 MB" readOnly />
                            </div>

                            <div>
                                <div>
                                    <label htmlFor="total_cpu">총 가상 CPU</label>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/>
                                </div>
                                <input type="text" id="total_cpu" value="1" readOnly />
                            </div>
                            
                    </div>
                </>
                }
                {selectedModalTab === 'host' && 
                <>
              
                  <div id="host_second_content">
                            <div style={{ fontWeight: 600 }}>실행 호스트:</div>
                            <div className="form_checks">
                                <div>
                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked />
                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                        클러스터 내의 호스트
                                    </label>
                                </div>
                                <div>
                                    <div>
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                            특정 호스트
                                        </label>
                                    </div>
                                    <div>
                                        <select id="specific_host_select" disabled>
                                            <option value="host02.ititinfo.com">host02.ititinfo.com</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                  </div>
                  <div id="host_third_content">
                            <div style={{ fontWeight: 600 }}>마이그레이션 옵션:</div>
                            <div>
                                <div>
                                    <span>마이그레이션 모드</span>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                                </div>
                                <select id="migration_mode">
                                    <option value="수동 및 자동 마이그레이션 허용">수동 및 자동 마이그레이션 허용</option>
                                </select>
                            </div>
                            <div>
                                <div>
                                    <span>마이그레이션 정책</span>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                                </div>
                                <select id="migration_policy">
                                    <option value="클러스터 기본값(Minimal downtime)">클러스터 기본값(Minimal downtime)</option>
                                </select>
                            </div>
                            <div>
                                <div>
                                    <span>마이그레이션 암호화 사용</span>
                                </div>
                                <select id="migration_encryption">
                                    <option value="클러스터 기본값(Minimal downtime)">클러스터 기본값(암호화하지 마십시오)</option>
                                </select>
                            </div>
                            <div>
                                <div>
                                    <span>Parallel Migrations</span>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                                </div>
                                <select id="parallel_migrations" readOnly>
                                    <option value="클러스터 기본값(Disabled)">클러스터 기본값(Disabled)</option>
                                </select>
                            </div>
                            <div className='network_checkbox_type1 disabled'>
                                <label htmlFor="memory_size">Number of VM Migration Connections</label>
                                <input type="text" id="memory_size" value="" readOnly disabled/>
                            </div>
                            
                  </div>
                </>
                }
                {selectedModalTab === 'ha_mode' && 
                <>
                
                  <div id="ha_mode_second_content">
                            <div className="checkbox_group">
                                <input className="check_input" type="checkbox" value="" id="ha_mode_box" />
                                <label className="check_label" htmlFor="ha_mode_box">
                                    고가용성
                                </label>
                            </div>
                            <div>
                                <div>
                                    <span>가상 머신 임대 대상 스토리지 도메인</span>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                                </div>
                                <select id="no_lease" disabled>
                                    <option value="가상 머신 임대 없음">가상 머신 임대 없음</option>
                                </select>
                            </div>
                            <div>
                                <div>
                                    <span>재개 동작</span>
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                                </div>
                                <select id="force_shutdown">
                                    <option value="강제 종료">강제 종료</option>
                                </select>
                            </div>
                            <div className="ha_mode_article">
                                <span>실행/마이그레이션 큐에서 우선순위 : </span>
                                <div>
                                    <span>우선 순위</span>
                                    <select id="priority">
                                        <option value="낮음">낮음</option>
                                    </select>
                                </div>
                            </div>

                            
                        </div>
                </>
                }
                {selectedModalTab === 'res_alloc' && 
                <>
        <div className="res_second_content">
                            <div className="cpu_res">
                                <span style={{ fontWeight: 600 }}>CPU 할당:</span>
                                <div className='cpu_res_box'>
                                    <span>CPU 프로파일</span>
                                    <select id="watchdog_action">
                                        <option value="없음">Default</option>
                                    </select>
                                </div>
                                <div className='cpu_res_box'>
                                    <span>CPU 공유</span>
                                    <div id="cpu_sharing">
                                        <select id="watchdog_action" style={{ width: '63%' }}>
                                            <option value="없음">비활성화됨</option>
                                        </select>
                                        <input type="text" value="0" disabled />
                                    </div>
                                </div>
                                <div className='cpu_res_box'>
                                    <span>CPU Pinning Policy</span>
                                    <select id="watchdog_action">
                                        <option value="없음">None</option>
                                    </select>
                                </div>
                                <div className='cpu_res_box'>
                                    <div>
                                        <span>CPU 피닝 토폴로지</span>
                                        <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/>
                                    </div>
                                    <input type="text" disabled />
                                </div>
                            </div>

                            

                            <span style={{ fontWeight: 600 }}>I/O 스레드:</span>
                            <div id="threads">
                                <div className='checkbox_group'>
                                    <input type="checkbox" id="enableIOThreads" name="enableIOThreads" />
                                    <label htmlFor="enableIOThreads">I/O 스레드 활성화</label>
                                </div>
                                <div className='text_icon_box'>
                                    <input type="text" />
                                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/>
                                </div>
                            </div>

                                
                        </div>

                </>
                }
                {selectedModalTab === 'boot_outer' && 
                <>  
                  <div className='boot_outer_content'>
                    <div className="cpu_res">
                                <span style={{ fontWeight: 600 }}>부트순서:</span>
                                <div className='cpu_res_box'>
                                    <span>첫 번째 장치</span>
                                    <select id="watchdog_action">
                                        <option value="없음">하드디스크</option>
                                    </select>
                                </div>
                                <div className='cpu_res_box'>
                                    <span>두 번째 장치</span>
                                    <select id="watchdog_action">
                                        <option value="없음">Default</option>
                                    </select>
                                </div>
                    </div>
                    <div id="boot_checkboxs">
                        <div>
                            <div className='checkbox_group'>
                                <input type="checkbox" id="connectCdDvd" name="connectCdDvd" />
                                <label htmlFor="connectCdDvd">CD/DVD 연결</label>
                            </div>
                            <div className='text_icon_box'>
                                <input type="text" disabled />
                                <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                            </div>
                        </div>

                        <div className='checkbox_group mb-1.5'>
                            <input type="checkbox" id="enableBootMenu" name="enableBootMenu" />
                            <label htmlFor="enableBootMenu">부팅 메뉴를 활성화</label>
                        </div>
                    </div>
                  </div>
                </>
                }
            </div>
            </div>

            <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closeModal}>취소</button>
            </div>
        </div>
        </Modal> */}
        {/*편집(편집)추가팝업 */}
        {/* <Modal
       isOpen={isEditPopupOpen}
       onRequestClose={() => setIsEditPopupOpen(false)}
      contentLabel="새 가상 디스크"
      className="Modal"
      overlayClassName="modalOverlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage_disk_new_popup" >
        <div className="popup_header">
          <h1>새 가상 디스크</h1>
          <button onClick={() => setIsEditPopupOpen(false)}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>
        <div className="disk_new_nav">
          <div
            id="storage_img_btn"
            // onClick={() => handleTabClick('img')}
            className='disabled'
            // className={activeTab === 'img' ? 'active' : ''}
          >
            이미지
          </div>
          <div
            id="storage_directlun_btn"
            // onClick={() => handleTabClick('directlun')}
            className='disabled'
            // className={activeTab === 'directlun' ? 'active' : ''}
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
          <button onClick={() => setIsEditPopupOpen(false)}>취소</button>
        </div>
      </div>
        </Modal>  */}
        {/*삭제 팝업 */}
        {/* <Modal
    isOpen={activePopup === 'delete'}
    onRequestClose={closeModal}
    contentLabel="디스크 업로드"
    className="Modal"
    overlayClassName="Overlay"
    shouldCloseOnOverlayClick={false}
  >
    <div className="storage_delete_popup">
      <div className="popup_header">
        <h1>디스크 삭제</h1>
        <button onClick={closeModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
      </div>
      
      <div className='disk_delete_box'>
        <div>
          <FontAwesomeIcon style={{marginRight:'0.3rem'}} icon={faExclamationTriangle} />
          <span>다음 항목을 삭제하시겠습니까?</span>
        </div>
      </div>


      <div className="edit_footer">
        <button style={{ display: 'none' }}></button>
        <button>OK</button>
        <button onClick={closeModal}>취소</button>
      </div>
    </div>
        </Modal> */}

        {/*스냅샷 팝업(default) */}
        {/* <Modal
        isOpen={activePopup === 'snapshot'}
          onRequestClose={closeModal}
          contentLabel="마이그레이션"
          className="Modal"
          overlayClassName="Overlay"
          shouldCloseOnOverlayClick={false}
        >
        <div className="snapshot_new_popup">
          <div className="popup_header">
            <h1>스냅샷 생성</h1>
            <button onClick={closeModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
         
          <div className='p-1'>
            <div className='host_textbox mb-1'>
                <label htmlFor="snapshot_set">설정</label>
                <input type="text" id="snapshot_set" />
            </div>
            <div>
              <div className='font-bold'>포함할 디스크 :</div>
              <div className='snapshot_new_table'>
                <TableOuter 
                    columns={TableColumnsInfo.SNAPSHOT_NEW}
                    data={[]}
                    onRowClick={() => console.log('Row clicked')}
                  />
              </div>
            </div>
            <div className="checkbox_group">
              <input className="check_input" type="checkbox" value="" id="memory_save" />
              <label className="check_label" htmlFor="memory_save">
                  메모리 저장
              </label>
            </div>
          </div>
          

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closeModal}>취소</button>
          </div>
        </div>
        </Modal>
         */}
        {/* 마이그레이션 팝업*/}
        <Modal
        isOpen={activePopup === 'migration'}
          onRequestClose={closeModal}
          contentLabel="마이그레이션"
          className="Modal"
          overlayClassName="Overlay"
          shouldCloseOnOverlayClick={false}
        >
          <div className='migration_popup_content'>
            <div className="popup_header">
              <h1>가상머신 마이그레이션</h1>
              <button onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} fixedWidth />
              </button>
            </div>
            <div id="migration_article_outer">
              <span>1대의 가상 머신이 마이그레이션되는 호스트를 선택하십시오.</span>
              
              <div id="migration_article">
                <div>
                  <div id="migration_dropdown">
                    <label htmlFor="host">대상 호스트 <FontAwesomeIcon icon={faInfoCircle} fixedWidth /></label>
                  
                    <select name="host_dropdown" id="host">
                      <option value="">호스트 자동 선택</option>
                      <option value="php">PHP</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                </div>

                <div className="checkbox_group">
                    <input className="check_input" type="checkbox" value="" id="ha_mode_box" />
                    <label className="check_label" htmlFor="ha_mode_box">
                    선택한 가상 머신을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 마이그레이션합니다.
                    </label>
                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/>
                </div>

                <div>
                  <div className='font-bold'>가상머신</div>
                  <div>on20-ap02</div>
                </div>
              </div>
            
            </div>
            
      <div className="edit_footer">
        <button style={{ display: 'none' }}></button>
        <button>OK</button>
        <button onClick={closeModal}>취소</button>
      </div>
          </div>
        </Modal>
        {/*...버튼 가져오기 팝업 */}
        {/* <Modal
        isOpen={activePopup === 'bring'}
        onRequestClose={closeModal}
        contentLabel="디스크 업로드"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="vm_bring_popup">
          <div className="popup_header">
            <h1>가상머신 가져오기</h1>
            <button onClick={closeModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
         
          <div className="border-b border-gray-400">
            <div className="vm_select_box">
                <label htmlFor="host_action">데이터 센터</label>
                <select id="host_action">
                    <option value="none">Default</option>
                </select>
            </div>
            <div className="vm_select_box">
                <label htmlFor="host_action">소스</label>
                <select id="host_action">
                    <option value="none">가상 어플라이언스(OVA)</option>
                </select>
            </div>
          </div>

          <div>
            <div className="vm_select_box">
                <label htmlFor="host_action">호스트</label>
                <select id="host_action">
                    <option value="none">Default</option>
                </select>
            </div>
            <div className="vm_select_box">
                <label htmlFor="host_action">파일 경로</label>
                <input type='text'/>
            </div>
          </div>
          <div className='px-1.5'>
            <div className='load_btn'>로드</div>
          </div>

        <div className='vm_bring_table'>

            <div>
                <div className='font-bold'>소스 상의 가상 머신</div>
                <TableOuter 
                    columns={TableColumnsInfo.VM_BRING_POPUP}
                    data={[]}
                    onRowClick={() => console.log('Row clicked')}
                />
            </div>
            <div>
                <div className='font-bold'>가져오기할 가상 머신</div>
                <TableOuter 
                    columns={TableColumnsInfo.VM_BRING_POPUP}
                    data={[]}
                    onRowClick={() => console.log('Row clicked')}
                />
            </div>

        </div>

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closeModal}>취소</button>
          </div>
        </div>
        </Modal> */}

        {/*...버튼 가상머신복제 팝업 */}
        {/* <Modal
        isOpen={activePopup === 'vm_copy'}
        onRequestClose={closeModal}
        contentLabel="디스크 업로드"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="vm_copy_popup">
            <div className="popup_header">
                <h1>가상머신 복제</h1>
                <button onClick={closeModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
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
            <button onClick={closeModal}>취소</button>
          </div>
        </div>
        </Modal> */}
        {/*...버튼 OVA로내보내기 팝업 */}
        {/* <Modal
        isOpen={activePopup === 'OVA'}
        onRequestClose={closeModal}
        contentLabel="디스크 업로드"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="vm_ova_popup">
            <div className="popup_header">
                <h1>가상 어플라이언스로 가상 머신 내보내기</h1>
                <button onClick={closeModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
            </div>
         
            <div className='py-1'>
                <div className="vnic_new_box">
                    <label htmlFor="host_select">호스트</label>
                    <select id="host_select">
                        <option value="#">#</option>
                    </select>
                </div>
                <div className='vnic_new_box'>
                    <label htmlFor="directory">디렉토리</label>
                    <input type="text" id="directory" value={'#'} />
                </div>
                <div className='vnic_new_box'>
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" value={'#'} />
                </div>

                     
            </div>

       
        

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closeModal}>취소</button>
          </div>
        </div>
        </Modal> */}
               
      <Footer/>
    </div>
  );
};

export default AllVm;

import React, { Suspense, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlassWhiskey, faCaretUp, faEllipsisV, faSearch, faChevronCircleRight
  , faTimes, faPencil, faArrowUp,
  faDatabase,
  faPlay
} from '@fortawesome/free-solid-svg-icons'
import { adjustFontSize } from '../../UIEvent';
import HeaderButton from '../button/HeaderButton';
import TableOuter from '../table/TableOuter';
import TableColumnsInfo from '../table/TableColumnsInfo';
import Footer from '../footer/Footer';
import Permission from '../Modal/Permission';
import './css/AllDomain.css';
import Table from '../table/Table';
import { useAllStorageDomains } from '../../api/RQHook';
import TableColumnsInfo from '../table/TableColumnsInfo';
import DomainsModal from '../Modal/DomainModal';

import DeleteModal from '../Modal/DeleteModal';

Modal.setAppElement('#root'); // React 16 이상에서는 필수

const AllDomain = () => {
  const navigate = useNavigate();
  // 모달창 옵션에따라 화면변경
  const [storageType, setStorageType] = useState('NFS'); // 기본값은 NFS로 설정

  // 스토리지 유형 변경 핸들러
  const handleStorageTypeChange = (e) => {
    setStorageType(e.target.value); // 선택된 옵션의 값을 상태로 저장
  };
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 버튼 클릭 시 팝업의 열림/닫힘 상태를 토글하는 함수
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const [activeLunTab, setActiveLunTab] = useState('target_lun'); 
  const handleLunTabClick = (tab) => {
    setActiveLunTab(tab); 
  };




  // 팝업 테이블 컴포넌트
  const data = [
    {
      alias: (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.target.style.fontWeight = 'bold')}
          onMouseLeave={(e) => (e.target.style.fontWeight = 'normal')}
        >
          he_metadata
        </span>
      ),
      id: '289137398279301798',
      icon1: '',
      icon2: <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth/>,
      connectionTarget: 'on20-ap01',
      storageDomain: 'VirtIO-SCSI',
      virtualSize: '/dev/sda',
      status: 'OK',
      type: '이미지',
      description: '',
    },
    {
      alias: (
        <span
          style={{ color: 'blue', cursor: 'pointer'}}
          onMouseEnter={(e) => (e.target.style.fontWeight = 'bold')}
          onMouseLeave={(e) => (e.target.style.fontWeight = 'normal')}
        >
          디스크2
        </span>
      ),
      id: '289137398279301798',
      icon1: '',
      icon2: <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth/>,
      connectionTarget: 'on20-ap01',
      storageDomain: 'VirtIO-SCSI',
      virtualSize: '/dev/sda',
      status: 'OK',
      type: '이미지',
      description: '',
    },
    {
      alias: (
        <span
          style={{ color: 'blue', cursor: 'pointer'}}
          onMouseEnter={(e) => (e.target.style.fontWeight = 'bold')}
          onMouseLeave={(e) => (e.target.style.fontWeight = 'normal')}
        >
          디스크3
        </span>
      ),
      id: '289137398279301798',
      icon1: '',
      icon2: <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth/>,
      connectionTarget: 'on20-ap01',
      storageDomain: 'VirtIO-SCSI',
      virtualSize: '/dev/sda',
      status: 'OK',
      type: '이미지',
      description: '',
    },
  ];



// 도메인 테이블 컴포넌트 
const { 
  data: domaindata, 
  status: domainStatus,
  isRefetching: isDomainsRefetching,
  refetch: refetchDomains, 
  isError: isDomainsError, 
  error: domainsError, 
  isLoading: isDomainsLoading,
} = useAllStorageDomains(toTableItemPredicateDomains);

function toTableItemPredicateDomains(domaindata) {
  const status = domaindata?.status ?? '';
  const icon = status === 'ACTIVE' 
  ? <FontAwesomeIcon icon={faPlay} fixedWidth style={{ color: 'lime', fontSize: '0.3rem',transform: 'rotate(270deg)' }} />
  : <FontAwesomeIcon icon={faPlay} fixedWidth  style={{ color: 'red', fontSize: '0.3rem', transform: 'rotate(90deg)'}}/>

  return {
    icon: icon,
    id: domaindata?.id ?? '',
    dataCenterId: domaindata?.dataCenterVo?.id ?? '',
    dataCenterName: domaindata?.dataCenterVo?.name ?? '',
    status: domaindata?.status ?? '',
    name: domaindata?.name ?? 'Unknown',
    comment: domaindata?.comment ?? '',
    domainType: domaindata?.domainType ?? 'Unknown',
    storageType: domaindata?.storageType ?? 'Unknown',
    format: domaindata?.format ?? 'Unknown',
    dataCenterStatus: domaindata?.dataCenterStatus ?? 'Unknown',
    diskSize: domaindata?.diskSize 
    ? ((domaindata.diskSize / (1024 ** 3)) % 1 === 0 
        ? (domaindata.diskSize / (1024 ** 3)).toFixed(0) 
        : (domaindata.diskSize / (1024 ** 3)).toFixed(2)) + ' GiB' 
    : 'Unknown',

availableSize: domaindata?.availableSize 
    ? ((domaindata.availableSize / (1024 ** 3)) % 1 === 0 
        ? (domaindata.availableSize / (1024 ** 3)).toFixed(0) 
        : (domaindata.availableSize / (1024 ** 3)).toFixed(2)) + ' GiB' 
    : 'Unknown',

    
    reservedSpace: domaindata?.reservedSpace ?? 'Unknown',
    description: domaindata?.description ?? '',
    HostName: domaindata?.hostVo?.name ?? '',
  };
}

const [modals, setModals] = useState({ create: false, bring:false, manage:false, edit: false, delete: false });
const [selectedDomain, setSelectedDomain] = useState(null);
const toggleModal = (type, isOpen) => {
  setModals((prev) => ({ ...prev, [type]: isOpen }));
};

console.log("selectedDomain아아아아:", selectedDomain);
  // 팝업 외부 클릭 시 닫히도록 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      const popupBox = document.querySelector(".content_header_popup"); // 팝업 컨테이너 클래스
      const popupBtn = document.querySelector(".content_header_popup_btn"); // 팝업 버튼 클래스
      if (
        popupBox &&
        !popupBox.contains(event.target) &&
        popupBtn &&
        !popupBtn.contains(event.target)
      ) {
        setIsPopupOpen(false); // 팝업 외부 클릭 시 팝업 닫기
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside); // 이벤트 리스너 추가
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);
  
  //
  useEffect(() => {
    window.addEventListener('resize', adjustFontSize);
    adjustFontSize();
    return () => { window.removeEventListener('resize', adjustFontSize); };
  }, []);

  // State for active section
  const [activeSection, setActiveSection] = useState('disk');
  const [isFooterContentVisible, setFooterContentVisibility] = useState(false);
  const [selectedFooterTab, setSelectedFooterTab] = useState('recent');
  const [activeTab, setActiveTab] = useState('img');

  const toggleFooterContent = () => setFooterContentVisibility(!isFooterContentVisible);
  const handleFooterTabClick = (tab) => setSelectedFooterTab(tab);
  const handleSectionClick = (section) => setActiveSection(section);
  const handleTabClick = (tab) => setActiveTab(tab);

  const [activePopup, setActivePopup] = useState(null);
  const openPopup = (popupType) => setActivePopup(popupType);
  const closePopup = () => setActivePopup(null);
  const [isPopupBoxVisible, setPopupBoxVisibility] = useState(false);
  
  const togglePopupBox = () => setPopupBoxVisibility(!isPopupBoxVisible);
  const handlePopupBoxItemClick = (e) => e.stopPropagation();

  const [isDomainHiddenBoxVisible, setDomainHiddenBoxVisible] = useState(false);
  const toggleDomainHiddenBox = () => {
    setDomainHiddenBoxVisible(!isDomainHiddenBoxVisible);
  };
  const [isDomainHiddenBox2Visible, setDomainHiddenBox2Visible] = useState(false);
  const toggleDomainHiddenBox2 = () => {
    setDomainHiddenBox2Visible(!isDomainHiddenBox2Visible);
  };
 
  const [isDomainHiddenBox4Visible, setDomainHiddenBox4Visible] = useState(false);
  const toggleDomainHiddenBox4 = () => {
    setDomainHiddenBox4Visible(!isDomainHiddenBox4Visible);
  };
  const [isDomainHiddenBox5Visible, setDomainHiddenBox5Visible] = useState(false);
  const toggleDomainHiddenBox5 = () => {
    setDomainHiddenBox5Visible(!isDomainHiddenBox5Visible);
  };


  // const sectionHeaderButtons = [
  //   { id: 'new_domain_btn', label: '도메인 생성', onClick : () => openPopup('newDomain')}, 
  //   { id: 'get_domain_btn', label: '도메인 가져오기', onClick : () => openPopup('newDomain')},   
  //   { id: 'administer_domain_btn', label: '도메인 관리', onClick : () => openPopup('manageDomain')},       
  //   { id: 'delete_btn', label: '삭제', onClick: () => openPopup('delete') }, 
  //   { id: 'delete_btn', label: 'LUN 새로고침'}, 
  //   { id: 'disk_btn', label: '디스크',onClick: () => navigate('/storages/disks') }, 
  // ];



  return (
    <div id="storage_section">
      <div>
        <HeaderButton
          titleIcon={faDatabase}
          title="스토리지 도메인"
          subtitle=""
          buttons={[]}
          popupItems={[]}
        />
        
        <div className="host_btn_outer">
              <>
              <div className="header_right_btns">
                <button onClick={() => toggleModal('create', true)}>도메인 생성</button>
                <button onClick={() => toggleModal('bring', true)}>도메인 가져오기</button>
                <button onClick={() => selectedDomain?.id && toggleModal('edit', true)} disabled={!selectedDomain?.id}>도메인 관리</button>
                <button onClick={() => selectedDomain?.id && toggleModal('delete', true)} disabled={!selectedDomain?.id}>제거</button>
                <button>LUN 새로고침</button>
                <button onClick={() => navigate('/storages/disks')}>디스크</button>
                <button className="content_header_popup_btn" onClick={togglePopup}>
                <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
                {isPopupOpen && (
                    <div className="content_header_popup">
                      <div onClick={(e) => { handlePopupBoxItemClick(e); openPopup(); }}>파괴</div>
                      <div onClick={(e) => { handlePopupBoxItemClick(e); openPopup(''); }}>마스터 스토리지 도메인으로 선택</div>
                    </div>
                  )}
                </button>
              </div>

                <span>id = {selectedDomain?.id || ''}</span><br/>
                <span>datacenter = {selectedDomain?.dataCenterName || ''}</span><br/>
                <span>스토리지유형 = {selectedDomain?.storageType|| ''}</span><br/>
                <span>호스트이름 = {selectedDomain?.HostName|| ''}</span>

                {/* Table 컴포넌트를 이용하여 테이블을 생성합니다. */}
                <TableOuter
                  columns={TableColumnsInfo.STORAGE_DOMAINS} 
                  data={domaindata} 
                  onRowClick={(row, column, colIndex) => {
                    setSelectedDomain(row);
                   if (colIndex === 1) {
                     navigate(`/storages/domains/${row.id}`);
                   } 
                 }}
                  clickableColumnIndex={[1]}
                  showSearchBox={true} 
                  onContextMenuItems={() => [
                    <div key="도메인 생성" onClick={() => console.log()}>도메인 생성</div>,
                    <div key="도메인 가져오기" onClick={() => console.log()}>도메인 가져오기</div>,
                    <div key="도메인 관리" onClick={() => console.log()}>도메인 관리</div>,
                    <div key="삭제" onClick={() => console.log()}>삭제</div>,
                    <div key="디스크" onClick={() => console.log()}>디스크</div>,
                  ]}
                />
              </>
        </div>

        <Footer/>

        <Suspense>
                {(modals.create || modals.edit || modals.bring) && (
                  <DomainsModal
                    isOpen={modals.create || modals.edit || modals.bring}
                    onRequestClose={() => toggleModal(modals.create ? 'create' : modals.edit ? 'edit' : 'bring', false)}
                    storageType={storageType} 
                    domainId={selectedDomain?.id || null}
                    domainData={selectedDomain}
                    editMode={modals.edit}
                    bringMode={modals.bring} 
                    handleStorageTypeChange={handleStorageTypeChange}
                    isDomainHiddenBoxVisible={isDomainHiddenBoxVisible}
                    toggleDomainHiddenBox={toggleDomainHiddenBox}
                    isDomainHiddenBox2Visible={isDomainHiddenBox2Visible}
                    toggleDomainHiddenBox2={toggleDomainHiddenBox2}
                  />
                )}
                {modals.delete && selectedDomain && (
                <DeleteModal
                    isOpen={modals.delete}
                    type='Domain'
                    onRequestClose={() => toggleModal('delete', false)}
                    contentLabel={'스토리지 도메인'}
                    data={selectedDomain}
                />
                )}
            </Suspense>
      </div> 


      {/*도메인생성 팝업 */}
      <Modal
    isOpen={activePopup === 'newDomain'}
    onRequestClose={closePopup}
    contentLabel="도메인 관리"
    className="Modal"
    overlayClassName="Overlay"
    shouldCloseOnOverlayClick={false}
      >
        <div className="storage_domain_administer_popup">
          <div className="popup_header">
            <h1>도메인 생성</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>

          <div className="storage_domain_new_first">
                    <div className="domain_new_left">
                    <div className="domain_new_select">
                        <label htmlFor="data_hub_location">데이터 센터</label>
                        <select id="data_hub_location">
                        <option value="linux">Default(VS)</option>
                        </select>
                    </div>
                    <div className="domain_new_select">
                        <label htmlFor="domain_feature_set">도메인 기능</label>
                        <select id="domain_feature_set">
                            <option value="data">데이터</option>
                            <option value="iso">ISO</option>
                            <option value="export">내보내기</option>
                        </select>
                    </div>
                    <div className="domain_new_select">
                        <label htmlFor="storage_option_type">스토리지 유형</label>
                        <select 
                        id="storage_option_type"
                        value={storageType}
                        onChange={handleStorageTypeChange} // 선택된 옵션에 따라 상태 변경
                        >
                        <option value="NFS">NFS</option>
                
                        <option value="iSCSI">iSCSI</option>
                        <option value="fc">파이버 채널</option>
                        </select>
                    </div>
                    <div className="domain_new_select" style={{ marginBottom: 0 }}>
                        <label htmlFor="host_identifier">호스트</label>
                        <select id="host_identifier">
                        <option value="linux">host02.ititinfo.com</option>
                        </select>
                    </div>
                    </div>
                    <div className="domain_new_right">
                    <div className="domain_new_select">
                        <label>이름</label>
                        <input type="text" />
                    </div>
                    <div className="domain_new_select">
                        <label>설명</label>
                        <input type="text" />
                    </div>
                    <div className="domain_new_select">
                        <label>코멘트</label>
                        <input type="text" />
                    </div>
                    </div>
                </div>

                {storageType === 'NFS' && (
                <div className="storage_popup_NFS">
                    <div className ="network_form_group">
                    <label htmlFor="data_hub">NFS 서버 경로</label>
                    <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
                    </div>

                  
                   
                    <div id="domain_hidden_box">
                  
                        <div className="domain_new_select">
                        <label htmlFor="nfs_version">NFS 버전</label>
                        <select id="nfs_version">
                            <option value="host02_ititinfo_com">host02.ititinfo.com</option>
                        </select>
                        </div>
                        {/* <div className="domain_new_select">
                        <label htmlFor="data_hub">재전송</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label htmlFor="data_hub">제한 시간(데시세컨드)</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label htmlFor="data_hub">추가 마운트 옵션</label>
                        <input type="text" />
                        </div> */}
                    </div>
                
               
                   
                    <div id="domain_hidden_box2">
                        <div className="domain_new_select">
                        <label>디스크 공간 부족 경고 표시(%)</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
                        <input type="text" />
                        </div>
                        {/* <div className="domain_new_select">
                        <label>디스크 공간 부족 경고 표시(%)</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label htmlFor="format_type_selector" style={{ color: 'gray' }}>포맷</label>
                        <select id="format_type_selector" disabled>
                            <option value="linux">V5</option>
                        </select>
                        </div>
                        <div className="hidden_checkbox">
                        <input type="checkbox" id="reset_after_deletion"/>
                        <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
                        </div>
                        <div className="hidden_checkbox">
                        <input type="checkbox" id="backup_vault"/>
                        <label htmlFor="backup_vault">백업</label>
                        </div> */}

                    </div>
                   
                </div>
                )}

                

                {storageType === 'iSCSI' && (
                <div className="storage_popup_NFS">
                    <div className='target_btns flex'> 
                    <button 
                        className={`target_lun ${activeLunTab === 'target_lun' ? 'active' : ''}`}
                        onClick={() => handleLunTabClick('target_lun')}
                    >
                        대상 - LUN
                    </button>
                    <button 
                        className={`lun_target ${activeLunTab === 'lun_target' ? 'active' : ''}`}
                        onClick={() => handleLunTabClick('lun_target')}
                    > 
                        LUN - 대상
                    </button>
                    </div>


                
                    {activeLunTab === 'target_lun' &&(
                    <div className='target_lun_outer'>
                        <div className="search_target_outer">
                        <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn4" onClick={toggleDomainHiddenBox4}fixedWidth/>
                        <span>대상 검색</span>
                        <div id="domain_hidden_box4" style={{ display: isDomainHiddenBox4Visible ? 'block' : 'none' }}>
                            <div className="search_target ">

                            <div>
                                <div className ="network_form_group">
                                <label htmlFor="data_hub">내보내기 경로</label>
                                <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
                                </div>
                                <div className ="network_form_group">
                                <label htmlFor="data_hub">내보내기 경로</label>
                                <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
                                </div>
                            </div>

                            <div>
                                <div className='input_checkbox'>
                                <input type="checkbox" id="reset_after_deletion"/>
                                <label htmlFor="reset_after_deletion">사용자 인증 :</label>
                                </div>
                                <div className ="network_form_group">
                                <label htmlFor="data_hub">내보내기 경로</label>
                                <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
                                </div>
                                <div className ="network_form_group">
                                <label htmlFor="data_hub">내보내기 경로</label>
                                <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
                                </div>
                            </div>

                            
                            </div>
                            <button>검색</button>
                        </div>
                        </div>
                    

                        <div>
                        <button className='all_login'>전체 로그인</button>
                        <div className='section_table_outer'>
                            <Table
                            columns={TableColumnsInfo.CLUSTERS_ALT} 
                            data={data} 
                            onRowClick={[]}
                            shouldHighlight1stCol={true}
                            />
                        </div>
                        </div>
                    </div>
                    )}      

                    {activeLunTab === 'lun_target' && (
                    <div className='lun_target_outer'>
                        <div className='section_table_outer'>
                            <Table
                            columns={TableColumnsInfo.CLUSTERS_ALT} 
                            data={data} 
                            onRowClick={[]}
                            shouldHighlight1stCol={true}
                            />
                        </div>
                    </div>
                    )}
                    <div>
                    <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn5" onClick={toggleDomainHiddenBox5}fixedWidth/>
                    <span>고급 매개 변수</span>
                    <div id="domain_hidden_box5" style={{ display: isDomainHiddenBox5Visible ? 'block' : 'none' }}>
                        <div className="domain_new_select">
                        <label>디스크 공간 부족 경고 표시(%)</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
                        <input type="text" />
                        </div>

                        {/* <div className="domain_new_select">
                        <label>디스크 공간 부족 경고 표시(%)</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label htmlFor="format_type_selector" style={{ color: 'gray' }}>포맷</label>
                        <select id="format_type_selector" disabled>
                            <option value="linux">V5</option>
                        </select>
                        </div>
                        <div className="hidden_checkbox">
                        <input type="checkbox" id="reset_after_deletion"/>
                        <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
                        </div>
                        <div className="hidden_checkbox">
                        <input type="checkbox" id="backup_vault"/>
                        <label htmlFor="backup_vault">백업</label>
                        </div>
                        <div className="hidden_checkbox">
                        <input type="checkbox" id="backup_vault"/>
                        <label htmlFor="backup_vault">삭제 후 폐기</label>
                        </div> */}
                    </div>
                    </div>

                </div>
                )}

                {storageType === 'fc' && (
                <div className="storage_popup_NFS">
                    <div className='section_table_outer'>
                        <Table
                        columns={TableColumnsInfo.CLUSTERS_ALT} 
                        data={data} 
                        onRowClick={[]}
                        shouldHighlight1stCol={true}
                        />
                    </div>
                    <div>
                    <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn5" onClick={toggleDomainHiddenBox5}fixedWidth/>
                    <span>고급 매개 변수</span>
                    <div id="domain_hidden_box5" style={{ display: isDomainHiddenBox5Visible ? 'block' : 'none' }}>
                        <div className="domain_new_select">
                        <label>디스크 공간 부족 경고 표시(%)</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label>디스크 공간 부족 경고 표시(%)</label>
                        <input type="text" />
                        </div>
                        <div className="domain_new_select">
                        <label htmlFor="format_type_selector" style={{ color: 'gray' }}>포맷</label>
                        <select id="format_type_selector" disabled>
                            <option value="linux">V5</option>
                        </select>
                        </div>
                        <div className="hidden_checkbox">
                        <input type="checkbox" id="reset_after_deletion"/>
                        <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
                        </div>
                        <div className="hidden_checkbox">
                        <input type="checkbox" id="backup_vault"/>
                        <label htmlFor="backup_vault">백업</label>
                        </div>
                        <div className="hidden_checkbox">
                        <input type="checkbox" id="backup_vault"/>
                        <label htmlFor="backup_vault">삭제 후 폐기</label>
                        </div>
                    </div>
                    </div>
                </div>
                )}

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal>

      {/*도메인(도메인 가져오기)팝업  위와동일 일단 버튼을 눌렀을때 위 팝업이 열리게해놓음*/}
      {/* <Modal
        isOpen={activePopup === 'getDomain'}
        onRequestClose={closePopup}
        contentLabel="도메인 가져오기"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="storage_domain_get_popup">
          <div className="popup_header">
            <h1>사전 구성된 도메인 가져오기</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>

          <div className="storage_domain_new_first">
            <div className="domain_new_left">
              <div className="domain_new_select">
                <label htmlFor="data_hub_location">데이터 센터</label>
                <select id="data_hub_location">
                  <option value="linux">Default(VS)</option>
                </select>
              </div>
              <div className="domain_new_select">
                <label htmlFor="domain_feature_set">도메인 기능</label>
                <select id="domain_feature_set">
                  <option value="linux">데이터</option>
                </select>
              </div>
              <div className="domain_new_select">
                <label htmlFor="storage_option_type">스토리지 유형</label>
                <select id="storage_option_type">
                  <option value="linux">NFS</option>
                  <option value="linux">POSIX 호환 FS</option>
                  <option value="linux">GlusterFS</option>
                  <option value="linux">iSCSI</option>
                  <option value="linux">파이버 채널</option>
                </select>
              </div>
              <div className="domain_new_select" style={{ marginBottom: 0 }}>
                <label htmlFor="host_identifier">호스트</label>
                <select id="host_identifier">
                  <option value="linux">host02.ititinfo.com</option>
                </select>
              </div>
            </div>
            <div className="domain_new_right">
              <div className="domain_new_select">
                <label>이름</label>
                <input type="text" />
              </div>
              <div className="domain_new_select">
                <label>설명</label>
                <input type="text" />
              </div>
              <div className="domain_new_select">
                <label>코멘트</label>
                <input type="text" />
              </div>
            </div>
          </div>

          <div className="storage_popup_NFS">
            <div>
              <label htmlFor="data_hub">내보내기 경로</label>
              <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
            </div>

            <div>
              <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn" onClick={toggleDomainHiddenBox}fixedWidth/>
              <span>사용자 정의 연결 매개 변수</span>
              <div id="domain_hidden_box" style={{ display: isDomainHiddenBoxVisible ? 'block' : 'none' }}>
                <span>아래 필드에서 기본값을 변경하지 않을 것을 권장합니다.</span>
                <div className="domain_new_select">
                  <label htmlFor="nfs_version">NFS 버전</label>
                  <select id="nfs_version">
                    <option value="host02_ititinfo_com">host02.ititinfo.com</option>
                  </select>
                </div>
                <div className="domain_new_select">
                  <label htmlFor="data_hub">재전송</label>
                  <input type="text" />
                </div>
                <div className="domain_new_select">
                  <label htmlFor="data_hub">제한 시간(데시세컨드)</label>
                  <input type="text" />
                </div>
                <div className="domain_new_select">
                  <label htmlFor="data_hub">추가 마운트 옵션</label>
                  <input type="text" />
                </div>
              </div>
            </div>
            <div>
              <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn6" onClick={toggleDomainHiddenBox6}fixedWidth/>
              <span>고급 매개 변수</span>
                <div id="domain_hidden_box6" style={{ display: isDomainHiddenBox6Visible ? 'block' : 'none' }}>
                  <div className="domain_new_select">
                    <label>디스크 공간 부족 경고 표시(%)</label>
                    <input type="text" />
                  </div>
                  <div className="domain_new_select">
                    <label>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
                    <input type="text" />
                  </div>
                  <div className="domain_new_select">
                    <label>디스크 공간 부족 경고 표시(%)</label>
                    <input type="text" />
                  </div>
                  <div className="domain_new_select">
                    <label htmlFor="format_type_selector" style={{ color: 'gray' }}>포맷</label>
                    <select id="format_type_selector" disabled>
                      <option value="linux">V5</option>
                    </select>
                  </div>
                  <div className="hidden_checkbox">
                    <input type="checkbox" id="reset_after_deletion"/>
                    <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
                  </div>
                  <div className="hidden_checkbox">
                    <input type="checkbox" id="backup_vault"/>
                    <label htmlFor="backup_vault">백업</label>
                  </div>
                  <div className="hidden_checkbox">
                    <input type="checkbox" id="activate_domain"/>
                    <label htmlFor="activate_domain">데이터 센터에 있는 도메인을 활성화</label>
                  </div>
                </div>
            </div>
          </div>
          <div className>
            ㅇㅇ
          </div>

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal> */}

      {/*도메인(도메인 관리)팝업 */}
      <Modal
        isOpen={activePopup === 'manageDomain'}
        onRequestClose={closePopup}
        contentLabel="도메인 관리"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="storage_domain_administer_popup">
          <div className="popup_header">
            <h1>도메인 관리</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>

          <div className="storage_domain_new_first">
            <div className="domain_new_left">
              <div className="domain_new_select">
                <label htmlFor="data_hub_location">데이터 센터</label>
                <select id="data_hub_location">
                  <option value="linux">Default(VS)</option>
                </select>
              </div>
              <div className="domain_new_select">
                <label htmlFor="domain_feature_set">도메인 기능</label>
                <select id="domain_feature_set">
                  <option value="linux">데이터</option>
                </select>
              </div>
              <div className="domain_new_select">
                <label htmlFor="storage_option_type">스토리지 유형</label>
                <select id="storage_option_type">
                  <option value="linux">NFS</option>
                  <option value="linux">POSIX 호환 FS</option>
                  <option value="linux">GlusterFS</option>
                  <option value="linux">iSCSI</option>
                  <option value="linux">파이버 채널</option>
                </select>
              </div>
              <div className="domain_new_select" style={{ marginBottom: 0 }}>
                <label htmlFor="host_identifier">호스트</label>
                <select id="host_identifier">
                  <option value="linux">host02.ititinfo.com</option>
                </select>
              </div>
            </div>
            <div className="domain_new_right">
              <div className="domain_new_select">
                <label>이름</label>
                <input type="text" />
              </div>
              <div className="domain_new_select">
                <label>설명</label>
                <input type="text" />
              </div>
              <div className="domain_new_select">
                <label>코멘트</label>
                <input type="text" />
              </div>
            </div>
          </div>

          <div className="storage_popup_NFS">
            <div>
              <label htmlFor="data_hub">내보내기 경로</label>
              <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
            </div>

            <div>
              <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn" onClick={toggleDomainHiddenBox}fixedWidth/>
              <span>사용자 정의 연결 매개 변수</span>
              <div id="domain_hidden_box" style={{ display: isDomainHiddenBoxVisible ? 'block' : 'none' }}>
                <span>아래 필드에서 기본값을 변경하지 않을 것을 권장합니다.</span>
                <div className="domain_new_select">
                  <label htmlFor="nfs_version">NFS 버전</label>
                  <select id="nfs_version" disabled style={{cursor:'no-drop'}}>
                    <option value="host02_ititinfo_com" >자동 협상(기본)</option>
                  </select>
                </div>
                <div className="domain_new_select">
                  <label htmlFor="data_hub">재전송(#)</label>
                  <input type="text" />
                </div>
                <div className="domain_new_select">
                  <label htmlFor="data_hub">제한 시간(데시세컨드)</label>
                  <input type="text" />
                </div>
                <div className="domain_new_select">
                  <label htmlFor="data_hub">추가 마운트 옵션</label>
                  <input type="text" />
                </div>
              </div>
            </div>
            <div>
              <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn2" onClick={toggleDomainHiddenBox2}fixedWidth/>
              <span>고급 매개 변수</span>
              <div id="domain_hidden_box2" style={{ display: isDomainHiddenBox2Visible ? 'block' : 'none' }}>
                <div className="domain_new_select">
                  <label>디스크 공간 부족 경고 표시(%)</label>
                  <input type="text" />
                </div>
                <div className="domain_new_select">
                  <label>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
                  <input type="text" />
                </div>
                <div className="domain_new_select">
                  <label>디스크 공간 부족 경고 표시(%)</label>
                  <input type="text" />
                </div>
                <div className="domain_new_select">
                  <label htmlFor="format_type_selector" style={{ color: 'gray' }}>포맷</label>
                  <select id="format_type_selector" disabled>
                    <option value="linux">V5</option>
                  </select>
                </div>
                <div className="hidden_checkbox">
                  <input type="checkbox" id="reset_after_deletion"/>
                  <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
                </div>
                <div className="hidden_checkbox">
                  <input type="checkbox" id="backup_vault"/>
                  <label htmlFor="backup_vault">백업</label>
                </div>
              </div>
            </div>
          </div>

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal>


      {/* 모달 컴포넌트 */}
      <Permission isOpen={activePopup === 'permission'} onRequestClose={closePopup} />
    </div>
  );
};

export default AllDomain;

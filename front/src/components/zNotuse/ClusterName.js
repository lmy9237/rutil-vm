import React, { useState,useEffect } from 'react';
import {useParams, useNavigate, useLocation } from 'react-router-dom';
import NavButton from '../navigation/NavButton';
import HeaderButton from '../button/HeaderButton';
import Modal from 'react-modal';
import TableColumnsInfo from '../table/TableColumnsInfo';
import NetworkDetail from '../Network/NetworkDetail';
import { useCluster, useEventFromCluster, useHostFromCluster, useLogicalFromCluster, usePermissionFromCluster, useVMFromCluster } from '../../api/RQHook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCrown, faUser,
  faTimes,
  faInfoCircle,
  faExclamationTriangle,
  faEarthAmericas,
} from '@fortawesome/free-solid-svg-icons'
import './css/ClusterName.css';
import './vmjs/VmDisk.js';
import TableOuter from '../table/TableOuter';
import Path from '../Header/Path';
import ClusterGeneral from './clusterjs/ClusterGeneral.js';
import ClusterHost from './clusterjs/ClusterHost.js';
import ClusterVm from './clusterjs/ClusterVm.js';
import ClusterNetwrok from './clusterjs/ClusterNetwrok.js';
import ClusterEvent from './clusterjs/ClusterEvent.js';

function ClusterName() {
    const { id , section} = useParams();
    const [activeTab, setActiveTab] = useState('general');
    const navigate = useNavigate();
    const location = useLocation();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab !== 'general') {
          navigate(`/computing/clusters/${id}/${tab}`); 
        } else {
          navigate(`/computing/clusters/${id}`); 
        }
      };
      useEffect(() => {
        if (!section) {
          setActiveTab('general'); 
        } else {
          setActiveTab(section);
        }
      }, [section]);

    const locationState = location.state; 
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [showNetworkDetail, setShowNetworkDetail] = useState(false);
    const [activePopup, setActivePopup] = useState(null);
    const [selectedTab, setSelectedTab] = useState('network_new_common_btn');
    const [selectedPopupTab, setSelectedPopupTab] = useState('cluster_common_btn');
    const [secondModalOpen, setSecondModalOpen] = useState(false); // 추가 모달 상태


    // 모달 관련 상태 및 함수
    const openPopup = (popupType) => {
        setActivePopup(popupType);
        setSelectedPopupTab('cluster_common_btn'); // 모달을 열 때마다 '일반' 탭을 기본으로 설정
    };

    const closePopup = () => {
        setActivePopup(null);
    };
    const handleTabClickModal = (tab) => {
        setSelectedTab(tab);
    };
    const handlePermissionFilterClick = (filter) => {
        setActivePermissionFilter(filter);
      };
      const [activePermissionFilter, setActivePermissionFilter] = useState('all');
      const handleRowClick = (row, column) => {
        if (column.accessor === 'name') {
          navigate(`/networks/${row.name.props.children}`);  
        }
    };
    // const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false); // 권한 모달 상태
    // const [isAffinityGroupModalOpen, setIsAffinityGroupModalOpen] = useState(false); // 선호도 그룹 모달 상태

    // // 권한 모달 핸들러
    // const openPermissionModal = () => setIsPermissionModalOpen(true);
    // const closePermissionModal = () => setIsPermissionModalOpen(false);
    // // 기존의 openPopup 함수 수정

    // // 선호도 그룹 모달 핸들러
    // const openAffinityGroupModal = () => setIsAffinityGroupModalOpen(true);
    // const closeAffinityGroupModal = () => setIsAffinityGroupModalOpen(false);
    // const [showTooltip, setShowTooltip] = useState(false); // hover하면 설명창 뜨게하기

    // ...버튼 클릭
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const togglePopup = () => {
      setIsPopupOpen(!isPopupOpen);
    };

    const [activeSection, setActiveSection] = useState('common_outer');
    const handleSectionChange = (section) => {
        setActiveSection(section);
      };
    

    const { 
        data: cluster,
        status: networkStatus,
        isRefetching: isNetworkRefetching,
        refetch: clusterRefetch, 
        isError: isNetworkError,
        error: networkError, 
        isLoading: isNetworkLoading,
      } = useCluster(id);
      
      useEffect(() => {
        clusterRefetch();  // 함수 이름을 일치시킴
      }, [setShouldRefresh, clusterRefetch]);

    // 논리네트워크

    // 호스트
    const { 
        data: hosts, 
        status: hostsStatus, 
        isLoading: isHostsLoading, 
        isError: isHostsError 
      } = useHostFromCluster(cluster?.id, toTableItemPredicateHosts);
      function toTableItemPredicateHosts(host) {
        return {
          icon: '', 
          name: host?.name ?? 'Unknown',  // 호스트 이름, 없으면 'Unknown'
          hostNameIP: host?.name ?? 'Unknown',
          status: host?.status ?? 'Unknown',  
          loading: `${host?.vmCount ?? 0} 대의 가상머신`, // 0으로 기본값 설정
          displayAddress: host?.displayAddress ?? '아니요',
        };
      }
    // 가상머신


    // 스토리지
    const storagedata = [
        {
          icon: '👑', 
          icon2: '👑',
          domainName: (
            <span
              style={{ color: 'blue', cursor: 'pointer'}}
              onMouseEnter={(e) => (e.target.style.fontWeight = 'bold')}
              onMouseLeave={(e) => (e.target.style.fontWeight = 'normal')}
            >
            hosted_storage
            </span>
          ),
          domainType: '데이터 (마스터)',
          status: '활성화',
          freeSpace: '83 GiB',
          usedSpace: '16 GiB',
          totalSpace: '99 GiB',
          description: '',
        },
      ];





    // HeaderButton 컴포넌트
    const buttons = [
        { id: 'edit_btn', label: '클러스터 편집', onClick:() => openPopup('cluster_detail_edit') },
        { id: 'delete_btn', label: '삭제', onClick: () => openPopup('delete')},
    ];


    // nav 컴포넌트
    const sections = [
        { id: 'general', label: '일반' },
        { id: 'hosts', label: '호스트' },     
        { id: 'vms', label: '가상 머신' },
        { id: 'networks', label: '논리 네트워크' },
        { id: 'events', label: '이벤트' }
    ];


    const pathData = [
        cluster?.name,
        activeTab === 'virtual_machine' || activeTab === 'template' ? '가상머신' : 
        activeTab === 'storage' || activeTab === 'storage_disk' ? '스토리지' :
        sections.find(section => section.id === activeTab)?.label,
        activeTab === 'template' ? '템플릿' : 
        activeTab === 'storage_disk' ? '디스크' : ''  ,
        location.pathname.includes('/templates') ? '템플릿' : ''  // '/templates'가 URL에 포함되어 있으면 추가
    ].filter(Boolean);
    console.log(location.pathname); // 현재 경로 출력
    console.log(location.pathname.includes('/templates')); // 조건 확인
    const renderSectionContent = () => {
        switch (activeTab) {
          case 'general':
            return <ClusterGeneral cluster={cluster} />;
          case 'hosts':
            return <ClusterHost cluster={cluster} />;
          case 'vms':
            return <ClusterVm cluster={cluster} />;
          case 'networks':
            return <ClusterNetwrok cluster={cluster} />;
          case 'events':
            return <ClusterEvent cluster={cluster} />;
          default:
            return <ClusterGeneral cluster={cluster} />;
        }
      };
    
    
  // 클러스터 팝업데이터(보류)
  const clusterPopupData = [
    {
      id: id,
      name: 'Default',
      allAssigned: (
        <>
          <input type="checkbox" checked /> <label>할당</label>
        </>
      ),
      allRequired: (
        <>
          <input type="checkbox" checked/> <label>필요</label>
        </>
      ),
      vmNetMgmt: (
        <>
          <i class="fa-solid fa-star" style={{ color: 'green'}}fixedWidth/>
        </>
      ),
      networkOutput: <input type="checkbox" />,
      migrationNetwork: <input type="checkbox"/>,
      glusterNetwork: <input type="checkbox"/>,
      defaultRouting: <input type="checkbox"/>,
    },
  ];

    return (
        <div id='section'>
            {showNetworkDetail ? (
                <NetworkDetail />
            ) : (
                <>
                    <HeaderButton
                        titleIcon={faEarthAmericas}
                        title={cluster?.name}
                        additionalText="목록이름"
                        buttons={buttons}
                        popupItems={[]}
                        uploadOptions={[]}
                    />
    
                    <div className="content_outer">
                        <NavButton
                            sections={sections}
                            activeSection={activeTab}
                            handleSectionClick={handleTabClick}
                        />
                        <div className="host_btn_outer">
                            <Path pathElements={pathData}/>
                            {renderSectionContent()}
                      
                            {/* {activeTab === 'general' && (
                            )}
                            {activeTab === 'hosts' && (
                                <>
                                 <HostDu 
                                data={hosts} 
                                columns={TableColumnsInfo.HOSTS_ALL_DATA} 
                                handleRowClick={handleRowClick}
                                openPopup={openPopup}
                              />
                                </>
                            )}
                            {activeTab === 'vms' && (
                          
                            <VmDu 
                        
                                columns={TableColumnsInfo.VM_CHART} 
                                handleRowClick={handleRowClick} 
                                openPopup={openPopup}
                                setActiveTab={setActiveTab}
                                togglePopup={togglePopup}
                                isPopupOpen={isPopupOpen}
                                />
                            )}
              
                            {activeTab === 'networks' && (
                                <>
                              <div className="header_right_btns">
                                    <button onClick={() => openPopup('newNetwork')}>새로 만들기</button>
                                    <button onClick={() => openPopup('editNetwork')}>편집</button>
                                    <button onClick={() => openPopup('delete')}> 삭제</button>
                                </div>
                                <TableOuter
                                  columns={TableColumnsInfo.LUNS} 
                                  data={networks} 
                                  onRowClick={handleRowClick} /> 
                                </>

                            )}
                             {activeTab === 'events' && (
                                <EventDu 
                                    columns={TableColumnsInfo.EVENTS}
                                    data={events}
                                    handleRowClick={() => console.log('Row clicked')}
                                />
                            )}  */}
                        </div>
                    </div>
                </>
            )}

       
            {/* 클러스터 편집 팝업*/}
            <Modal
                isOpen={activePopup === 'cluster_detail_edit'}
                onRequestClose={closePopup}
                contentLabel="새로 만들기"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
            >
                <div className="cluster_new_popup">
                    <div className="popup_header">
                        <h1>새 클러스터</h1>
                        <button onClick={() =>closePopup('cluster_new')}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                    </div>

                    <form className="cluster_common_form py-1">
                        <div className="network_form_group">
                        <label htmlFor="data_center">데이터 센터</label>
                        <select id="data_center">
                            <option value="default">Default</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <div>
                            <label htmlFor="name">이름</label>
                        </div>
                        <input type="text" id="name" />
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="description">설명</label>
                        <input type="text" id="description" />
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="comment">코멘트</label>
                        <input type="text" id="comment" />
                        </div>
                
                        <div className="network_form_group">
                        <label htmlFor="management_network">관리 네트워크</label>
                        <select id="management_network">
                            <option value="ovirtmgmt">ovirtmgmt</option>
                            <option value="ddd">ddd</option>
                            <option value="hosted_engine">hosted_engine</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="cpu_architecture">CPU 아키텍처</label>
                        <select id="cpu_architecture">
                            <option value="정의되지 않음">정의되지 않음</option>
                            <option value="x86_64">x86_64</option>
                            <option value="ppc64">ppc64</option>
                            <option value="s390x">s390x</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="cpu_type">CPU 유형</label>
                        <select id="cpu_type">
                            <option value="default">Default</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="chipset_firmware_type">침셋/펌웨어 유형<FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/></label>
                        <select id="chipset_firmware_type">
                            <option value="default">Default</option>
                        </select>
                        </div>
                    
                        <div className="network_checkbox_type2">
                        <input type="checkbox" id="bios_change" name="bios_change" />
                        <label htmlFor="bios_change">BIOS를 사용하여 기존 가상 머신/템플릿을 1440fx에서 Q35 칩셋으로 변경</label>
                        </div>

                        <div>
                        <div className='font-bold px-1.5 py-0.5'>복구 정책<FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/></div>
                        <div className='host_text_radio_box px-1.5 py-0.5'>
                            <input type="radio" id="migration_option" name="recovery_policy" checked/>
                            <label htmlFor="migration_option">가상 머신을 마이그레이션함</label>
                        </div>

                        <div className='host_text_radio_box px-1.5 py-0.5'>
                            <input type="radio" id="high_usage_migration_option" name="recovery_policy" />
                            <label htmlFor="high_usage_migration_option">고가용성 가상 머신만 마이그레이션</label>
                        </div>

                        <div className='host_text_radio_box px-1.5 py-0.5'>
                            <input type="radio" id="no_migration_option" name="recovery_policy" />
                            <label htmlFor="no_migration_option">가상 머신은 마이그레이션 하지 않음</label>
                        </div>
                        </div>
        
                    </form>

                    <div className="edit_footer">
                        <button style={{ display: 'none' }}></button>
                        <button>OK</button>
                        <button onClick={() =>closePopup('cluster_new')}>취소</button>
                    </div>
                </div>
            </Modal>
            {/*클러스터(네트워크 관리)팝업*/}
            <Modal
                isOpen={activePopup === 'cluster_network_popup'}
                onRequestClose={closePopup}
                contentLabel="네트워크 관리"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
            >
                <div className="manage_network_popup">
                <div className="popup_header">
                    <h1>네트워크 관리</h1>
                    <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                </div>
                
                <TableOuter 
                    columns={TableColumnsInfo.CLUSTERS_POPUP} 
                    data={clusterPopupData} 
                    onRowClick={() => console.log('Row clicked')} 
                />
                
                <div className="edit_footer">
                    <button style={{ display: 'none' }}></button>
                    <button>OK</button>
                    <button onClick={closePopup}>취소</button>
                </div>
                </div>
            </Modal>
            {/*삭제 팝업 */}
            <Modal
                isOpen={activePopup === 'delete'}
                onRequestClose={closePopup}
                contentLabel="디스크 업로드"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
            >
                <div className="storage_delete_popup">
                <div className="popup_header">
                    <h1>삭제</h1>
                    <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
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
                    <button onClick={closePopup}>취소</button>
                </div>
                </div>
            </Modal>
        </div>

    
    );
}

export default ClusterName;

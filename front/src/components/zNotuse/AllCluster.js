import {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import HeaderButton from '../button/HeaderButton';
import TableOuter from '../table/TableOuter';
import TableColumnsInfo from '../table/TableColumnsInfo';
import { useAllClusters } from '../../api/RQHook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowUp,
    faInfoCircle,
    faPencil,
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import './css/Cluster.css';
import Localization from '../../utils/Localization';

Modal.setAppElement('#root');

const AllCluster = () => {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false); // hover하면 설명창 뜨게하기

  const closeModal = () => setIsModalOpen(false);
  const [selectedTab, setSelectedTab] = useState('cluster_common_btn');
  const [activePopup, setActivePopup] = useState(null);


    // 모달 관련 상태 및 함수
    const openPopup = (popupType) => {
      setActivePopup(popupType);
      setSelectedTab('cluster_common_btn'); // 모달을 열 때마다 '일반' 탭을 기본으로 설정
    };

    const closePopup = () => {
        setActivePopup(null);
    };

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };
  const sectionHeaderButtons = [
    { id: 'new_btn', label: '새로 만들기', onClick: () => openPopup('newNetwork') },
    { id: 'edit_btn', label: '편집', icon: faPencil, onClick: () => openPopup('newNetwork')  },
    { id: 'delete_btn', label: '삭제', icon: faArrowUp, onClick: () => {} }
  ];
  /* 
  const [data, setData] = useState(DEFAULT_VALUES.FIND_ALL_CLUSTERS);
  useEffect(() => {
    const fetchData = async () => {
        const res = await ApiManager.findAllClusters()
        const items = res.map((e) => toTableItemPredicate(e))
        setData(items)
    }
    fetchData()
  }, [])
  */
  const { 
    data: clusters, 
    status: clustersStatus,
    isRefetching: isClustersRefetching,
    refetch: refetchClusters, 
    isError: isClustersError, 
    error: clustersError, 
    isLoading: isClustersLoading,
  } = useAllClusters((e) => {
    //CLUSTERS_ALT
    return {
      id: e?.id ?? '',
      name: e?.name ?? '',
      version: e?.version ?? '0.0',
      cpuType: e?.cpuType ?? 'CPU 정보 없음',
      hostCount: e?.hostCnt ?? 0,
      vmCount: e?.vmCnt ?? 0,
      comment: e?.comment ?? '',
      description: e?.description ?? '설명없음',
    }
  });

  const handleRowClick = (row, column) => {
    if (column.accessor === 'name') { // 이름 컬럼일 때만 네비게이션
        navigate(
          `/computing/clusters/${row.id}`,
          { state: { name: row.name } }
        );
      }
    };

  return (
    <div id="section">
      <HeaderButton
        title="DataCenter > "
        subtitle="Cluster"
        buttons={sectionHeaderButtons}
        popupItems={[]}
        openModal={openPopup}
        togglePopup={() => {}}
      />
      <div className="content_outer">
        <div className="empty_nav_outer">
          <TableOuter 
              columns={TableColumnsInfo.CLUSTERS_ALT} 
              data={clusters} 
              onRowClick={handleRowClick}
              shouldHighlight1stCol={true}
          />
        </div>
      </div>

        {/* 새로 만들기 팝업 */}
            <Modal
                isOpen={activePopup === 'newNetwork'}
                onRequestClose={closePopup}
                contentLabel="새로 만들기"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
            >
                <div className="cluster_new_popup">
                    <div className="popup_header">
                        <h1 class="text-sm">새 클러스터</h1>
                        <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                    </div>
                    
                    <div className='flex'>
                    <div className="network_new_nav">
                        <div
                            id="cluster_common_btn"
                            className={selectedTab === 'cluster_common_btn' ? 'active-tab' : 'inactive-tab'}
                            onClick={() => handleTabClick('cluster_common_btn')}
                        >
                            일반
                        </div>
                        <div
                            id="cluster_migration_btn"
                            className={selectedTab === 'cluster_migration_btn' ? 'active-tab' : 'inactive-tab'}
                            onClick={() => handleTabClick('cluster_migration_btn')}
                        >
                           마이그레이션 정책
                        </div>
                    </div>

                    {/* 일반 */}
                    {selectedTab === 'cluster_common_btn' && (
                        <form className="cluster_common_form py-1">
                            <div className="network_form_group">
                            <label htmlFor="data_center">{Localization.kr.DATA_CENTER}</label>
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
                      
                            {/* id 편집 */}
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
                            <label htmlFor="chipset_firmware_type">침셋/펌웨어 유형</label>
                            <select id="chipset_firmware_type">
                                <option value="default">Default</option>
                            </select>
                            </div>
                        
                            <div className="network_checkbox_type2">
                            <input type="checkbox" id="bios_change" name="bios_change" />
                            <label htmlFor="bios_change">BIOS를 사용하여 기존 가상 머신/템플릿을 1440fx에서 Q35 칩셋으로 변경</label>
                            </div>
                        
                            <div className="network_form_group">
                            <label htmlFor="fips_mode">FIPS 모드</label>
                            <select id="fips_mode">
                                <option value="자동 감지">자동 감지</option>
                                <option value="비활성화됨">비활성화됨</option>
                                <option value="활성화됨">활성화됨</option>
                            </select>
                            </div>
                        
                            <div className="network_form_group">
                            <label htmlFor="compatibility_version">호환 버전</label>
                            <select id="compatibility_version">
                                <option value="4.7">4.7</option>
                            </select>
                            </div>
                        
                            <div className="network_form_group">
                            <label htmlFor="switch_type">스위치 유형</label>
                            <select id="switch_type">
                                <option value="Linux Bridge">Linux Bridge</option>
                                <option value="OVS (기술 프리뷰)">OVS (기술 프리뷰)</option>
                            </select>
                            </div>
                        
                            <div className="network_form_group">
                            <label htmlFor="firewall_type">방화벽 유형</label>
                            <select id="firewall_type">
                                <option value="iptables">iptables</option>
                                <option value="firewalld">firewalld</option>
                            </select>
                            </div>
                        
                            <div className="network_form_group">
                            <label htmlFor="default_network_provider">기본 네트워크 공급자</label>
                            <select id="default_network_provider">
                                <option value="기본 공급자가 없습니다.">기본 공급자가 없습니다.</option>
                                <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
                            </select>
                            </div>
                        
                            <div className="network_form_group">
                            <label htmlFor="max_memory_limit">로그인 최대 메모리 한계</label>
                            <select id="max_memory_limit">
                                <option value="default">Default</option>
                            </select>
                            </div>
                        
                            <div className="network_checkbox_type2">
                            <input type="checkbox" id="virt_service_enabled" name="virt_service_enabled" />
                            <label htmlFor="virt_service_enabled">Virt 서비스 활성화</label>
                            </div>
                        
                            <div className="network_checkbox_type2">
                            <input type="checkbox" id="gluster_service_enabled" name="gluster_service_enabled" />
                            <label htmlFor="gluster_service_enabled">Gluster 서비스 활성화</label>
                            </div>
                        
                            <div className="network_checkbox_type2">
                            <span>추가 난수 생성기 소스:</span>
                            </div>
                        
                            <div className="network_checkbox_type2">
                            <input type="checkbox" id="dev_hwrng_source" name="dev_hwrng_source" />
                            <label htmlFor="dev_hwrng_source">/dev/hwrng 소스</label>
                            </div>
                        </form>
                      
                    )}

                    {/* 마이그레이션 정책 */}
                    {selectedTab === 'cluster_migration_btn' && (
                        <form className="py-2">
                            <div className="network_form_group">
                            <label htmlFor="migration_policy">마이그레이션 정책</label>
                            <select id="migration_policy">
                                <option value="default">Default</option>
                            </select>
                            </div>
                        
                            <div class="p-1.5">
                            <span class="font-bold">최소 다운타임</span>
                            <div>
                                일반적인 상황에서 가상 머신을 마이그레이션할 수 있는 정책입니다. 가상 머신에 심각한 다운타임이 발생하면 안 됩니다. 가상 머신 마이그레이션이 오랫동안 수렴되지 않으면 마이그레이션이 중단됩니다. 게스트 에이전트 후크 메커니즘을 사용할 수 있습니다.
                            </div>
                            </div>
                        
                            <div class="p-1.5 mb-1">
                            <span class="font-bold">대역폭</span>
                            <div className="cluster_select_box">
                                <div class="flex">
                                <label htmlFor="bandwidth_policy">마이그레이션 정책</label>
                                <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'blue', margin: '0.1rem', cursor: 'pointer' }} />
                                </div>
                                <select id="bandwidth_policy">
                                <option value="default">Default</option>
                                </select>
                            </div>
                            </div>
                        
                            <div className="px-1.5 flex relative">
                            <span className="font-bold">복구정책</span>
                            <FontAwesomeIcon
                                icon={faInfoCircle}
                                style={{ color: 'blue', margin: '0.1rem', cursor: 'pointer' }}
                                onMouseEnter={() => setShowTooltip(true)} // 마우스를 올리면 툴팁을 보여줌
                                onMouseLeave={() => setShowTooltip(false)} // 마우스를 떼면 툴팁을 숨김
                            />
                            {showTooltip && (
                                <div className="tooltip-box">
                                마이그레이션 암호화에 대한 설명입니다.
                                </div>
                            )}
                            </div>
                      
                            <div className='host_text_radio_box px-1.5 py-0.5'>
                            <input type="radio" id="password_option" name="encryption_option" />
                            <label htmlFor="password_option">암호</label>
                            </div>
                        
                            <div className='host_text_radio_box px-1.5 py-0.5'>
                            <input type="radio" id="certificate_option" name="encryption_option" />
                            <label htmlFor="certificate_option">암호</label>
                            </div>
                        
                            <div className='host_text_radio_box px-1.5 py-0.5 mb-2'>
                            <input type="radio" id="none_option" name="encryption_option" />
                            <label htmlFor="none_option">암호</label>
                            </div>
                        
                            <div class="m-1.5">
                            <span class="font-bold">추가 속성</span>
                            <div className="cluster_select_box">
                                <label htmlFor="encryption_usage">마이그레이션 암호화 사용</label>
                                <select id="encryption_usage">
                                <option value="default">시스템 기본값 (암호화하지 마십시오)</option>
                                <option value="encrypt">암호화</option>
                                <option value="no_encrypt">암호화하지 마십시오</option>
                                </select>
                            </div>
                            
                            <div className="cluster_select_box">
                                <label htmlFor="parallel_migration">마이그레이션 암호화 사용</label>
                                <select id="parallel_migration">
                                <option value="default">Disabled</option>
                                <option value="auto">Auto</option>
                                <option value="auto_parallel">Auto Parallel</option>
                                <option value="custom">Custom</option>
                                </select>
                            </div>
                        
                            <div className="cluster_select_box">
                                <label htmlFor="migration_encryption_text">마이그레이션 암호화 사용</label>
                                <input type="text" id="migration_encryption_text" />
                            </div>
                            </div>
                        </form>
                      
                    )}
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
};

export default AllCluster;

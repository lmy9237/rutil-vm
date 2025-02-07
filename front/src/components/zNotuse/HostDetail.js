import React, { useState , useEffect} from 'react';
import {useParams, useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import NavButton from '../../navigation/NavButton.js';
import HeaderButton from '../../button/HeaderButton.js';
import Footer from '../../footer/Footer.js';
import Table from '../../zNotuse/Table.js';
import TableColumnsInfo from '../../table/TableColumnsInfo.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TemplateDu from '../duplication/TemplateDu.js';
import {
  faCaretUp, faDesktop, faUniversity, faWrench, faUser
  , faCheckCircle, faExclamation, faFilm, faArrowCircleUp,
  faTimes,
  faInfoCircle,
  faArrowUp,
  faArrowDown,
  faMinus,
  faPlus,
  faCircle,
  faArrowsAltH,
  faCheck,
  faBan,
  faFan,
  faExclamationTriangle,
  faPencilAlt,
  faCaretDown,
  faNetworkWired,
  faTag,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import './css/HostDetail.css';
import TableOuter from '../table/TableOuter';
import { useEventFromHost, useHost, useHostdeviceFromHost, usePermissionFromHost, useVmFromHost } from '../../api/RQHook.js';
import PagingTableOuter from '../../table/PagingTableOuter.js';
import Path from '../../Header/Path.js';
import VmDu from '../../pages/computing/vm/VmDu.js';
import EventDu from '../duplication/EventDu.js';
import HostGeneral from './hostjs/HostGenerals.js';
import HostVm from './hostjs/HostVm.js';
import HostNics from './hostjs/HostNics.js';
import HostDevice from './hostjs/HostDevice.js';
import HostEvent from './hostjs/HostEvent.js';
import HostNetwork from './hostjs/HostNetwork.js';



function HostDetail() {
  const { id,section } = useParams();
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab !== 'general') {
      navigate(`/computing/hosts/${id}/${tab}`); 
    } else {
      navigate(`/computing/hosts/${id}`); 
    }
  };
  useEffect(() => {
    if (!section) {
      setActiveTab('general'); 
    } else {
      setActiveTab(section);
    }
  }, [section]);

  //클릭한 이름 받아오기
  const handlePermissionFilterClick = (filter) => {
    setActivePermissionFilter(filter);
  };
  const [areAllBoxesVisible, setAreAllBoxesVisible] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [활성화된섹션, set활성화된섹션] = useState('일반_섹션');
  const [activeButton, setActiveButton] = useState('network');
  const [isLabelVisible, setIsLabelVisible] = useState(false); // 라벨 표시 상태 관리
  const [isInstallBoxVisible, setIsInstallBoxVisible] = useState(false); // 설치 드롭다운 상태

// 설치 드롭다운 클릭 핸들러
const handleInstallClick = () => {
  setIsInstallBoxVisible(!isInstallBoxVisible);
};
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  
  const openPopup = (type) => {
    setActivePopup(type); // 'new' 또는 'edit' 등으로 설정
  };

  const closePopup = () => {
    setActivePopup(null); // 모달을 닫을 때 상태 초기화
  };
  const [isHiddenParameterVisible, setHiddenParameterVisible] = useState(false);

  const toggleHiddenParameter = () => {
    setHiddenParameterVisible(!isHiddenParameterVisible);
  };
  
  const handleButtonClick = (button) => {
    setActiveButton(button);
    setIsLabelVisible(button === 'label'); // 'label' 버튼을 클릭하면 라벨을 표시
  };




  useEffect(() => {
    const 기본섹션 = document.getElementById('일반_섹션_btn');
    if (기본섹션) {
      기본섹션.style.backgroundColor = '#EDEDED';
      기본섹션.style.color = '#1eb8ff';
      기본섹션.style.borderBottom = '1px solid blue';
    }
  }, []);

  const 섹션변경 = (section) => {
    set활성화된섹션(section);
    const 모든섹션들 = document.querySelectorAll('.edit_aside > div');
    모든섹션들.forEach((el) => {
      el.style.backgroundColor = '#FAFAFA';
      el.style.color = 'black';
      el.style.borderBottom = 'none';
    });

    const 선택된섹션 = document.getElementById(`${section}_btn`);
    if (선택된섹션) {
      선택된섹션.style.backgroundColor = '#EDEDED';
      선택된섹션.style.color = '#1eb8ff';
      선택된섹션.style.borderBottom = '1px solid blue';
    }
  };

  const { 
    data: host,
    status: networkStatus,
    isRefetching: isNetworkRefetching,
    refetch: hostRefetch, 
    isError: isNetworkError,
    error: networkError, 
    isLoading: isNetworkLoading,
  } = useHost(id);

  const [activePermissionFilter, setActivePermissionFilter] = useState('all');
    //테이블컴포넌트

    
    // 가상머신 
  //   const { 
  //   data: vms, 
  //   status: hostsStatus, 
  //   isLoading: isHostsLoading, 
  //   isError: isHostsError 
  // } = useVmFromHost(host?.id, toTableItemPredicateHosts);
  // function toTableItemPredicateHosts(host) {
  //   return {
  //     icon: <FontAwesomeIcon icon={faUniversity} fixedWidth />,
  //     name: host?.name ?? 'Unknown', 
  //     cluster: host?.clusterVo?.name ?? 'Default', 
  //     ipv4: host?.ipv4 ?? 'Unknown',
  //     fqdn: host?.fqdn ?? 'Unknown', 
  //     memory: host?.memoryUsage ? `${host.memoryUsage}%` : 'Unknown', 
  //     cpu: host?.cpuUsage ? `${host.cpuUsage}%` : 'Unknown', 
  //     network: host?.networkUsage ? `${host.networkUsage}%` : 'Unknown', 
  //     statusDetail: host?.statusDetail ?? 'Unknown', 
  //     upTime: host?.upTime ?? 'Unknown', 
  //   };
  // }
    


  // 네트워크인터페이스 박스열고닫기
  const [visibleBoxes, setVisibleBoxes] = useState([]);

  const toggleHiddenBox = (index) => {
    setVisibleBoxes((prevVisibleBoxes) => {
      if (prevVisibleBoxes.includes(index)) {
        return prevVisibleBoxes.filter((i) => i !== index); // 이미 열려 있으면 닫기
      } else {
        return [...prevVisibleBoxes, index]; // 아니면 열기
      }
    });
  };

  // 모든 박스를 확장 또는 숨기기
  const toggleAllBoxes = () => {
    if (visibleBoxes.length === networkInterfaceData.length) {
      setVisibleBoxes([]); // 모두 닫기
    } else {
      setVisibleBoxes(networkInterfaceData.map((_, index) => index)); // 모두 열기
    }
  };
  // 네트워크(임시데이터)
  const networkInterfaceData = [
    {
      icon: <FontAwesomeIcon icon={faWrench} fixedWidth />,
      name: 'Network 1',
      mac: 'AA:BB:CC:DD:EE:11',
      rx: '100',
      allRx: '1,000,000',
      tx: '200',
      allTx: '2,000,000',
      mbps: '100',
      pkts: '10,000',
    },{
      icon: <FontAwesomeIcon icon={faWrench} fixedWidth />,
      name: 'Network 1',
      mac: 'AA:BB:CC:DD:EE:11',
      rx: '100',
      allRx: '1,000,000',
      tx: '200',
      allTx: '2,000,000',
      mbps: '100',
      pkts: '10,000',
    },
  ];
  const networkdata = [
    {
      icon: <FontAwesomeIcon icon={faUniversity} fixedWidth />,
      unmanaged: <FontAwesomeIcon icon={faWrench} fixedWidth />,
      vlan: 'VLAN',
      networkName: 'ovirtmgmt',
      ipv4: '192.168.0.81',
      ipv6: '',
    },
  ];

  // 호스트 장치
  // const { 
  //   data: hostDevices,     
  //   status: hostDevicesStatus,  
  //   isLoading: isHostDevicesLoading,  
  //   isError: isHostDevicesError       
  // } = useHostdeviceFromHost(host?.id, toTableItemPredicateHostDevices);  
  // function toTableItemPredicateHostDevices(device) {
  //   return {
  //     name: device?.name ?? 'Unknown',
  //     capability: device?.capability ?? 'Unknown',
  //     vendorName: device?.vendorName ?? 'Unknown',
  //     productName: device?.productName ?? 'Unknown',
  //     driver: device?.driver ?? 'Unknown',
  //     currentlyUsed: device?.currentlyUsed ?? 'Unknown',
  //     connectedToVM: device?.connectedToVM ?? 'Unknown',
  //     iommuGroup: device?.iommuGroup ?? '해당 없음',
  //     mdevType: device?.mdevType ?? '해당 없음',
  //   };
  // }


  // 토글 방식으로 열고 닫기(관리)
  const [isManageBoxVisible, setIsManageBoxVisible] = useState(false);

  const handleManageClick = () => {
    setIsManageBoxVisible(!isManageBoxVisible);
  };

  // 팝업 외부 클릭 시 닫히도록 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      const manageBox = document.getElementById('manage_box');
      const manageBtn = document.getElementById('manage_btn');
      
      // 클릭한 요소가 manage_box 내부의 li인지 확인
      const isLiElement = event.target.tagName === 'LI';

      // manage_box, manage_btn, 그리고 manage_box 내부의 li가 아닌 곳을 클릭했을 때만 팝업 닫기
      if (
        manageBox && !manageBox.contains(event.target) &&
        manageBtn && !manageBtn.contains(event.target) &&
        !isLiElement // li 요소를 클릭한 경우는 제외
      ) {
        setIsManageBoxVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

// 팝업 외부 클릭 시 설치 드롭다운 닫히기
// useEffect(() => {
//   const handleClickOutside = (event) => {
//     const installBox = document.getElementById('install_box');
//     const installBtn = document.getElementById('install_btn');
//     if (
//       installBox && !installBox.contains(event.target) &&
//       installBtn && !installBtn.contains(event.target)
//     ) {
//       setIsInstallBoxVisible(false);
//     }
//   };

//   document.addEventListener('mousedown', handleClickOutside);
//   return () => {
//     document.removeEventListener('mousedown', handleClickOutside);
//   };
// }, []);


  // 연필 추가모달
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  useEffect(() => {
    if (isSecondModalOpen) {
      handleTabModalClick('ipv4');
    }
  }, [isSecondModalOpen]);
   const [selectedModalTab, setSelectedModalTab] = useState('ipv4');
   const handleTabModalClick = (tab) => {
     setSelectedModalTab(tab);
   };
  // 추가 모달 닫기 핸들러
  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
    setSelectedModalTab('ipv4'); // 모달이 닫힐 때 첫 번째 탭으로 초기화
  };

  
  

    //headerbutton 컴포넌트
      const buttons = [
        { id: 'edit_btn', label: '호스트 편집', onClick: () => openPopup('host_edit') },
        { id: 'delete_btn', label: '삭제', onClick: () => openPopup('delete')},
        {
          id: 'manage_btn',
          label: (
            <div className="manage_container">
              <div id="manage_btn" onClick={handleManageClick} className="btn">
                관리 <FontAwesomeIcon icon={faChevronDown} />
              </div>
            
              {isManageBoxVisible && (
                <ul id="manage_box" className="dropdown-menu">
                  <li onClick={() => openPopup('maintenance')}>유지보수</li>
                  <li>활성</li>
                  <li>기능을 새로 고침</li>
                  <li style={{borderTop:'1px solid #DDDDDD'}}>다시 설치</li>
                  <li style={{borderBottom:'1px solid #DDDDDD'}}>인증서 등록</li>
                  <li>재시작</li>
                  <li>중지</li>
                </ul>
              )}
            </div>
          ),
         
        },
        // {
        //   id: 'install_btn',
        //   label: (
        //     <div className="install_container">
        //       <div id="install_btn" onClick={handleInstallClick} className="btn">
        //         설치 <FontAwesomeIcon icon={faChevronDown} />
        //       </div>
        //       {isInstallBoxVisible && (
        //         <ul id="install_box" className="dropdown-menu">
        //           <li>설치 옵션 1</li>
        //           <li>설치 옵션 2</li>
        //           <li>설치 옵션 3</li>
        //         </ul>
        //       )}
        //     </div>
        //   ),
        // }
      ];
      
    
      const popupItems = [    
        { id: 'checkReboot', label: '호스트가 재부팅 되어 있는지 확인',onClick: () => openPopup('reboot_check') } ,
        { id: 'approve', label: '승인' },
        { id: 'enableGlobalHA', label: '글로벌 HA 유지 관리를 활성화' },
        { id: 'disableGlobalHA', label: '글로벌 HA 유지 관리를 비활성화' },
      ];
      
      const uploadOptions = []; // 현재 업로드 옵션이 없으므로 빈 배열로 설정
    // nav컴포넌트
    const sections = [
        { id: 'general', label: '일반' },
        { id: 'vms', label: '가상머신' },
        { id: 'nics', label: '네트워크 인터페이스' },
        { id: 'devices', label: '호스트 장치' },
        { id: 'events', label: '이벤트' }
      ];
      const pathData = [
        host?.name || 'Default',  // 호스트 이름이 없으면 'Default'로 대체
        activeTab === 'machine' || activeTab === 'template' ? '가상머신' : sections.find(section => section.id === activeTab)?.label,
        activeTab === 'template' ? '템플릿' : '' // 템플릿일 때만 '템플릿' 추가
      ].filter(Boolean);
      
      const renderSectionContent = () => {
        switch (activeTab) {
          case 'general':
            return <HostGeneral host={host} />; // 일반 탭인 경우 래퍼 없이 반환
          case 'vms':
            return <HostVm host={host} />;
          case 'nics':
            return <HostNetwork host={host} />;
          case 'devices':
            return <HostDevice host={host} />;
          case 'events':
            return <HostEvent host={host} />;
          default:
            return <HostGeneral host={host} />;
        }
      };
      
    
      
    return (
        <div id='section'>
             <HeaderButton
      titleIcon={faUser}
      title={host?.name}
      additionalText="목록이름"
      buttons={buttons}
      popupItems={popupItems}
      uploadOptions={uploadOptions}
    />



            <div className="content_outer">
           
                <NavButton
                    sections={sections}   
                    activeSection={activeTab} 
                    handleSectionClick={handleTabClick} 
                />
                 
                  
                  {activeTab === 'general' ? (
                    // 일반 탭인 경우
                    <>
                  
                    {renderSectionContent()}
                    </>
                  ) : (
                    // 다른 탭인 경우
                    <div className="host_btn_outer">
                      <Path pathElements={pathData} />
                      {renderSectionContent()}
                    </div>
                  )}
                
                {/* 일반 */}
                {/* {activeTab === 'general' && (
                
                <div className="host_content_outer">
                    <div className='ml-2'>
                      <Path pathElements={pathData}/>
                    </div>
                    <div className="host_tables">

                        <div className="table_container_left" style={{paddingTop:0}}>
                            <h2 className='font-bold'>호스트</h2>
                            <table className="host_table">
                              <tbody>
                                  <tr>
                                      <th>호스트이름/IP:</th>
                                      <td>{host?.name}</td>
                                  </tr>
                                  <tr>
                                      <th>SPM 우선순위:</th>
                                      <td>중간</td>
                                  </tr>
                                  <tr>
                                      <th>활성 가상 머신:</th>
                                      <td>1</td>
                                  </tr>
                                  <tr>
                                      <th>논리 CPU 코어 수:</th>
                                      <td>8</td>
                                  </tr>
                                  <tr>
                                      <th>온라인 논리 CPU 코어 수:</th>
                                      <td>0, 1, 2, 3, 4, 5, 6, 7</td>
                                  </tr>
                                  <tr>
                                      <th>부팅 시간:</th>
                                      <td>{host?.bootingTime}</td>
                                  </tr>
                                  <tr>
                                      <th>Hosted Engine HA:</th>
                                      <td>활성 (접속: 3400)</td>
                                  </tr>
                                  <tr>
                                      <th>iSCSI 개시자 이름:</th>
                                      <td>{host?.iscsi}</td>
                                  </tr>
                                  <tr>
                                      <th>Kdump Integration Status:</th>
                                      <td>비활성화됨</td>
                                  </tr>
                                  <tr>
                                      <th>물리적 메모리:</th>
                                      <td>19743 MB 한계, 15794 MB 사용됨, 3949 MB 사용가능</td>
                                  </tr>
                                  <tr>
                                      <th>Swap 크기:</th>
                                      <td>10063 MB 한계, 0 MB 사용됨, 10063 MB 사용가능</td>
                                  </tr>
                                  <tr>
                                      <th>공유 메모리:</th>
                                      <td>9%</td>
                                  </tr>
                                  <tr>
                                      <th>장치 통과:</th>
                                      <td>비활성화됨</td>
                                  </tr>
                                  <tr>
                                      <th>새로운 가상 머신의 스케줄링을 위한 최대 여유 메모리:</th>
                                      <td>2837 MB</td>
                                  </tr>
                                  <tr>
                                      <th>메모리 페이지 공유:</th>
                                      <td>활성</td>
                                  </tr>
                                  <tr>
                                      <th>자동으로 페이지를 크게:</th>
                                      <td>항상</td>
                                  </tr>
                                  <tr>
                                      <th>Huge Pages (size: free/total):</th>
                                      <td>2048: 0/0, 1048576: 0/0</td>
                                  </tr>
                                  <tr>
                                      <th>SELinux 모드:</th>
                                      <td>{host?.seLinux}</td>
                                  </tr>
                                  <tr>
                                      <th>클러스터 호환 버전:</th>
                                      <td>4.2, 4.3, 4.4, 4.5, 4.6, 4.7</td>
                                  </tr>
                                  <tr>
                                      <th><FontAwesomeIcon icon={faExclamation} fixedWidth/></th>
                                      <td>이 호스트는 전원 관리가 설정되어 있지 않습니다.</td>
                                  </tr>
                              </tbody>
                            </table>
                        </div>

                        <div className="table_container_left" style={{paddingTop:0}}>
                            <h2 className='font-bold'>하드웨어</h2>
                            <table className="host_table">
                              <tbody>
                                <tr>
                                    <th>제조사:</th>
                                    <td>Intel(R) Xeon(R) Gold 6354 CPU @ 3.00GHz</td>
                                </tr>
                                <tr>
                                    <th>버전:</th>
                                    <td>1</td>
                                </tr>
                                <tr>
                                    <th>CPU 모델:</th>
                                    <td>{host?.hostHwVo.cpuName}</td>
                                </tr>
                                <tr>
                                    <th>소켓당 CPU 코어:</th>
                                    <td>1</td>
                                </tr>
                                <tr>
                                    <th>제품군:</th>
                                    <td>Secure Intel Cascadelake Server Family</td>
                                </tr>
                                <tr>
                                    <th>UUID:</th>
                                    <td>Secure Intel Cascadelake Server Family</td>
                                </tr>
                                <tr>
                                    <th>CPU 유형:</th>
                                    <td> {host?.hostHwVo.cpuType}</td>
                                </tr>
                                <tr>
                                    <th>코어당 CPU의 스레드:</th>
                                    <td>1 (SMT 사용안함)</td>
                                </tr>
                                <tr>
                                    <th>제품 이름:</th>
                                    <td>Secure Intel Cascadelake Server Family</td>
                                </tr>
                                <tr>
                                    <th>일련 번호:</th>
                                    <td>Secure Intel Cascadelake Server Family</td>
                                </tr>
                                <tr>
                                    <th>CPU 소켓:</th>
                                    <td>8</td>
                                </tr>
                                <tr>
                                    <th>TSC 주파수:</th>
                                    <td>2992968000 (스케일링 비활성화)</td>
                                </tr>
                            </tbody>

                            </table>
                        </div>


                        <div  className="table_container_left" style={{paddingTop:0}}>
                            <h2 className='font-bold'>소프트웨어</h2>
                            <table className="host_table">
                              <tbody>
                                <tr>
                                  <th>OS 버전:</th>
                                  <td>{host?.hostSwVo.osVersion}</td>
                                </tr>
                                <tr>
                                  <th>OS 정보:</th>
                                  <td>{host?.hostSwVo.osInfo}</td>
                                </tr>
                                <tr>
                                  <th>커널 버전:</th>
                                  <td>{host?.hostSwVo.kernalVersion}</td>
                                </tr>
                                <tr>
                                  <th>KVM 버전:</th>
                                  <td>{host?.hostSwVo.kvmVersion}</td>
                                </tr>
                                <tr>
                                  <th>LIBVIRT 버전:</th>
                                  <td>{host?.hostSwVo.libvirtVersion}</td>
                                </tr>
                                <tr>
                                  <th>VDSM 버전:</th>
                                  <td>{host?.hostSwVo.vdsmVersion}</td>
                                </tr>
                                <tr>
                                  <th>SPICE 버전:</th>
                                  <td>{host?.hostSwVo.spiceVersion}</td>
                                </tr>
                                <tr>
                                  <th>GlusterFS 버전:</th>
                                  <td>{host?.hostSwVo.glustersfsVersion}</td>
                                </tr>
                                <tr>
                                  <th>CEPH 버전:</th>
                                  <td>{host?.hostSwVo.cephVersion}</td>
                                </tr>
                                <tr>
                                  <th>Open vSwitch 버전:</th>
                                  <td>{host?.hostSwVo.openVswitchVersion}</td>
                                </tr>
                                <tr>
                                  <th>Nmstate 버전:</th>
                                  <td>{host?.hostSwVo.nmstateVersion}</td>
                                </tr>
                                <tr>
                                  <th>커널 기능:</th>
                                  <td>
                                    MDS: (Not affected), L1TF: (Not affected), SRBDS: (Not affected), MELTDOWN: (Not affected), RETBLEED: (Not affected), SPECTRE_V1: (Mitigation: usercopy/swapgs barriers and __user pointer sanitization), SPECTRE_V2: (Mitigation: Enhanced / Automatic IBRS, IBPB: conditional, RSB filling, PBRSE-eIBRS: SW sequence), ITLB_MULTIHIT: (KVM: Mitigation: Split huge pages), MMIO_STALE_DATA: (Vulnerable: Clear CPU buffers attempted, no microcode; SMT Host state unknown), TSX_ASYNC_ABORT: (Not affected), SPEC_STORE_BYPASS: (Mitigation: Speculative Store Bypass disabled via prctl), GATHER_DATA_SAMPLING: (Unknown: Dependent on hypervisor status), SPEC_RSTACK_OVERFLOW: (Not affected)
                                  </td>
                                </tr>
                                <tr>
                                  <th>VNC 암호화:</th>
                                  <td>비활성화됨</td>
                                </tr>
                                <tr>
                                  <th>OVN configured:</th>
                                  <td>예</td>
                                </tr>
                              </tbody>
                            </table>

                        </div>

                    </div>
                   

                    
                </div>
               
                )} */}
                
                {/* 가상머신 */}
                {/* {activeTab === 'machine' && (
                <div className="host_btn_outer">
                    <Path pathElements={pathData}/>
                    <VmDu 
                      data={vms} 
                      columns={TableColumnsInfo.VM_CHART} 
                      handleRowClick={() => console.log("Row clicked")}  
                      openPopup={openPopup} 
                      setActiveTab={setActiveTab}
                      togglePopup={togglePopup} 
                      isPopupOpen={isPopupOpen} 
                    />
                </div>
                )} */}
                {/* 템플릿 */}
                {/* {activeTab === 'template' && (
                  <div className="host_btn_outer">
                    <Path pathElements={pathData}/>  
                    <TemplateDu 
                      data={['#']} 
                      columns={TableColumnsInfo.TEMPLATE_CHART} 
                      handleRowClick={() => console.log("Row clicked")}  
                    />
                   </div>
                  )} */}

                {/* 네트워크 인터페이스 */}
                {activeTab === 'networkinterface' && (
                    <div className="host_btn_outer">
                    <Path pathElements={pathData} />
                    <div className="header_right_btns">
                      <button>VF 보기</button>
                      <button onClick={toggleAllBoxes}>
                        {visibleBoxes.length === networkInterfaceData.length ? '모두 숨기기' : '모두 확장'}
                      </button>
                      <button onClick={() => openPopup('host_network_set')}>호스트 네트워크 설정</button>
                      <button className="disabled">네트워크 설정 저장</button>
                      <button className="disabled">모든 네트워크 동기화</button>
                    </div>
              
                    {networkInterfaceData.map((data, index) => (
                      <div className="host_network_boxs" key={index}>
                        <div
                          className="host_network_firstbox"
                          onClick={() => toggleHiddenBox(index)} // 클릭 시 해당 박스만 열리거나 닫힘
                        >
                          <div className="section_table_outer">
                            <Table
                              columns={TableColumnsInfo.HOST_NETWORK_INTERFACE}
                              data={networkInterfaceData}
                              onRowClick={() => console.log('Row clicked')}
                            />
                          </div>
                        </div>
                        {visibleBoxes.includes(index) && ( // 박스가 열려 있을 때만 보임
                          <div className="host_network_hiddenbox">
                            <div className="section_table_outer">
                              <Table
                                columns={TableColumnsInfo.NETWORKS_FROM_HOST}
                                data={networkdata}
                                onRowClick={() => console.log('Row clicked')}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* 호스트 장치 */}
                {/* {activeTab === 'hostdevice' && (
                <div className="host_btn_outer">
                  <Path pathElements={pathData}/>
                  <div className="host_empty_outer">
                    <PagingTableOuter
                      columns={TableColumnsInfo.DEVICE_FROM_HOST} 
                      data={hostDevices} 
                      onRowClick={() => console.log('Row clicked')} 
                      
                    />
                  </div>
                </div>
                )} */}
               
                {/* 권한(삭제예정) */}
                {/* {activeTab === 'permission' && (
              <div className="host_btn_outer">
                
              <div className="header_right_btns">
                <button>추가</button>
                <button>제거</button>
              </div>
              <div className="host_filter_btns">
                <span>Permission Filters:</span>
                <div>
                  <button
                    className={activePermissionFilter === 'all' ? 'active' : ''}
                    onClick={() => handlePermissionFilterClick('all')}
                  >
                    All
                  </button>
                  <button
                    className={activePermissionFilter === 'direct' ? 'active' : ''}
                    onClick={() => handlePermissionFilterClick('direct')}
                  >
                    Direct
                  </button>
                </div>
              </div>
              <TableOuter
                columns={TableColumnsInfo.PERMISSIONS}
                data={activePermissionFilter === 'all' ? permissions : []}
                onRowClick={() => console.log('Row clicked')}
              />
            </div>
                )} */}
          
                {/* 이벤트 */}
                {/* {activeTab === 'event' && (
                <div className="host_btn_outer">
                  <Path pathElements={pathData}/>
                  <EventDu 
                    columns={TableColumnsInfo.EVENTS}
                    data={events}
                    handleRowClick={() => console.log('Row clicked')}
                  />
                </div>
                )} */}
               
             </div>
  
            {/*관리(유지보수)*/}
            <Modal
                isOpen={activePopup === 'maintenance'}
                onRequestClose={closePopup}
                contentLabel="디스크 업로드"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
              >
                <div className="manage_maintenance_popup">
                  <div className="popup_header">
                    <h1>호스트 유지관리 모드</h1>
                    <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                  </div>
                
                  <div className='p-2'>
                    <div className='mb-2'>
                    다음 호스트를 유지관리 모드로 설정하시겠습니까?
                    </div>
                    <div class=" mb-1" >
                    #
                    </div>

                    <div className='host_textbox'>
                      <label htmlFor="user_name">사용자 이름</label>
                      <input type="text" id="user_name" />
                  </div>

                  </div>


                  <div className="edit_footer">
                    <button style={{ display: 'none' }}></button>
                    <button>OK</button>
                    <button onClick={closePopup}>취소</button>
                  </div>
                </div>
              </Modal>
            {/* 편집 팝업*/}
            <Modal
      isOpen={activePopup === 'host_edit'}
      onRequestClose={closePopup}
      contentLabel="새로 만들기"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}

    >
        <div className="host_new_add">
          <div className="popup_header">
            <h1>호스트 수정</h1>
            <button onClick={() =>closePopup('host_new')}>
              <FontAwesomeIcon icon={faTimes} fixedWidth/>
            </button>
          </div>

    
        
        <form action="#">
          <div className="edit_first_content">
                  <div>
                      <label htmlFor="host_cluster">호스트 클러스터</label>
                      <select id="cluster">
                          <option value="default">Default</option>
                      </select>
                  
                  </div>
                  <div>
                      <label htmlFor="name1">이름</label>
                      <input type="text" id="name1" />
                  </div>
                  <div>
                      <label htmlFor="comment">코멘트</label>
                      <input type="text" id="comment" />
                  </div>
                  <div>
                      <label htmlFor="hostname">호스트이름/IP<FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/></label>
                      <input type="text" id="hostname" />
                  </div>
                  <div>
                      <label htmlFor="ssh_port">SSH 포트</label>
                      <input type="text" id="ssh_port" value="22" />
                  </div>
            </div>

          <div className='py-1'>
            <div className='host_checkboxs'>
              <div className='host_checkbox'>
                  <input type="checkbox" id="memory_balloon" name="memory_balloon" />
                  <label htmlFor="headless_mode">설치 후 호스트를 활성화</label>
              </div>
              <div className='host_checkbox'>
                  <input type="checkbox" id="headless_mode_info" name="headless_mode_info" />
                  <label htmlFor="headless_mode_info">설치 후 호스트를 다시 시작</label>
                  <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }} fixedWidth/>
              </div>
            </div>

            <div className='host_checkboxs'>
              <span className='px-1'>인증</span>
              <div className='host_textbox' style={{paddingTop:'0'}}>
                  <label htmlFor="user_name">사용자 이름</label>
                  <input type="text" id="user_name" />
              </div>

              <div className='host_text_raido_box'>
                  <div>
                    <input type="radio" id="password" name="name_option" />
                    <label htmlFor="password">암호</label>
                  </div>
                  <input type="text" id="radio1_name" />
              </div>
            </div>

            <div className='vGPU_radiobox'>
              <div className='font-bold'>
                vGPU 배치<FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }} fixedWidth/>
              </div>
              <div>
                  <input type="radio" id="memory_balloon" name="memory_balloon" />
                  <label htmlFor="headless_mode">통합</label>
              </div>
              <div>
                  <input type="radio" id="memory_balloon" name="memory_balloon" />
                  <label htmlFor="headless_mode">분산</label>
              </div>
            </div>
            
            <div className="host_select_set">
                      <label htmlFor="host_related_action">호스트 연관 배포 작업 선택</label>
                      <select id="host_related_action">
                        <option value="none">없음</option>
                      </select>
            </div>
          </div>
        </form>
      

        <div className="edit_footer">
          <button>OK</button>
          <button onClick={() =>closePopup('host_new')}>취소</button>
        </div>
      </div>
            </Modal>
            {/*호스트(호스트 네트워크 설정)*/}
            <Modal
              isOpen={activePopup === 'host_network_popup'}
              onRequestClose={closePopup}
              contentLabel="호스트 네트워크 설정"
              className="Modal"
              overlayClassName="Overlay"
              shouldCloseOnOverlayClick={false}
            >
              <div className="vnic_new_content_popup">
                <div className="popup_header">
                  <h1>호스트 host01.ititinfo.com 네트워크 설정</h1>
                  <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                </div>
                
                <div className="host_network_outer px-1.5 text-sm">
                <div className="py-2 font-bold underline">드래그 하여 변경</div>

                <div className="host_network_separation">
            <div className="network_separation_left">
              <div>
                <div>인터페이스</div>
                <div>할당된 논리 네트워크</div>
              </div>

              <div className="separation_left_content">
                <div className="container gap-1">
                  <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.1rem', color: '#00FF00' }} />
                  <FontAwesomeIcon icon={faDesktop} />
                  <span>ens192</span>
                </div>
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faArrowsAltH} style={{ color: 'grey', width: '5vw', fontSize: '0.6rem' }} />
                </div>

                <div className="container">
                  <div className="left-section">
                    <FontAwesomeIcon icon={faCheck} className="icon green-icon" />
                    <span className="text">ovirtmgmt</span>
                  </div>
                  <div className="right-section">
                    <FontAwesomeIcon icon={faFan} className="icon" />
                    <FontAwesomeIcon icon={faDesktop} className="icon" />
                    <FontAwesomeIcon icon={faDesktop} className="icon" />
                    <FontAwesomeIcon icon={faBan} className="icon" />
                    <FontAwesomeIcon icon={faExclamationTriangle} className="icon" />
                    <FontAwesomeIcon icon={faPencilAlt} className="icon" />
                  </div>
                </div>
              </div>
            </div>

            <div className="network_separation_right">
            <div className="network_filter_btns">
        <button
          className={`btn ${activeButton === 'network' ? 'bg-gray-200' : ''}`}
          onClick={() => handleButtonClick('network')}
        >
          네트워크
        </button>
        <button
          className={`btn border-l border-gray-800 ${activeButton === 'label' ? 'bg-gray-200' : ''}`}
          onClick={() => handleButtonClick('label')}
        >
          레이블
        </button>
      </div>

        {/* unconfigured_network는 네트워크 버튼이 클릭된 경우만 보임 */}
        {!isLabelVisible && (
          <div className="unconfigured_network">
            <div>할당되지 않은 논리 네트워크</div>
            <div style={{ backgroundColor: '#d1d1d1' }}>필수</div>
            <div className="unconfigured_content flex items-center space-x-2">
              <div>
                <FontAwesomeIcon icon={faCaretDown} style={{ color: 'red', marginRight: '0.2rem' }} />
                <span>ddd</span>
              </div>
              <FontAwesomeIcon icon={faNetworkWired} style={{ color: 'green', fontSize: '20px' }} />
            </div>
            <div className="unconfigured_content flex items-center space-x-2">
              <div>
                <FontAwesomeIcon icon={faCaretDown} style={{ color: 'red', marginRight: '0.2rem' }} />
                <span>ddd</span>
              </div>
              <FontAwesomeIcon icon={faNetworkWired} style={{ color: 'green', fontSize: '20px' }} />
            </div>
            <div className="unconfigured_content flex items-center space-x-2">
              <div>
                <FontAwesomeIcon icon={faCaretDown} style={{ color: 'red', marginRight: '0.2rem' }} />
                <span>ddd</span>
              </div>
              <FontAwesomeIcon icon={faNetworkWired} style={{ color: 'green', fontSize: '20px' }} />
            </div>
            <div style={{ backgroundColor: '#d1d1d1' }}>필요하지 않음</div>
            <div>
              <span>외부 논리적 네트워크</span>
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }} fixedWidth />
            </div>
          </div>
        )}

        {/* lable_part는 레이블 버튼이 클릭된 경우만 보임 */}
        {isLabelVisible && (

            <div class="lable_part">
              <FontAwesomeIcon icon={faTag} style={{ color: 'orange', marginRight: '0.2rem' }} />
              <span>[새 레이블]</span>
            </div>

        )}
      </div>


              </div>

                  <div className="border-t-[1px] border-gray-500 mt-4">
                      <div className='py-1 checkbox_group'>
                        <input type="checkbox" id="checkHostConnection" checked />
                        <label htmlFor="checkHostConnection">호스트와 Engine간의 연결을 확인</label>
                        <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)', cursor: 'pointer' }} fixedWidth />
                      </div>
                      <div className='checkbox_group'>
                        <input type="checkbox" id="saveNetworkConfig" disabled />
                        <label htmlFor="saveNetworkConfig">네트워크 설정 저장</label>
                        <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)', cursor: 'pointer' }} fixedWidth />
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
            {/*호스트...박스(호스트가 재부팅되어있는지확인) 팝업 */}
            <Modal
                isOpen={activePopup === 'reboot_check'}
                onRequestClose={closePopup}
                contentLabel="디스크 업로드"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
              >
                <div className="reboot_check_popup">
                  <div className="popup_header">
                    <h1>정말로 진행하시겠습니까?</h1>
                    <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                  </div>
                
                  <div className='p-2'>
                    <div className='mb-2'>
                    호스트 ' rutilvm-test.host01 '이 수동으로 종료 또는 재부팅되어 있는지 확인하십시오.
                    </div>
                    <div class="text-red-500 mb-1" >
                    이 호스트는 SPM 입니다. 적절한 수동 재부팅이 이루어 지지 않은 이 호스트에 이 동작을 실행할 경우 스토리지의 데이터를 손실할 수 있습니다.<br/><br/>
                    만약 이 호스트가 수동으로 재부팅 되지 않았다면 '취소'를 눌러주십시오.
                    </div>

                    <div className='host_checkbox'>
                      <input type="checkbox" id="action_check" name="action_check" />
                      <label htmlFor="action_check">동작 확인</label>
                    </div>

                  </div>


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

            {/*호스트(호스트 네트워크 설정 After)*/}
            <Modal
              isOpen={activePopup === 'host_network_set'}
              onRequestClose={closePopup}
              contentLabel="호스트 네트워크 설정"
              className="Modal"
              overlayClassName="Overlay"
              shouldCloseOnOverlayClick={false}
            >
              <div className="vnic_new_content_popup">
                <div className="popup_header">
                  <h1>호스트 host01.ititinfo.com 네트워크 설정</h1>
                  <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                </div>
                
                <div className="host_network_outer px-1.5 pt-1.5 text-sm">
                

                <div className="host_network_separation">
            <div className="network_separation_left">
              <div>
                <div>인터페이스</div>
                <div>할당된 논리 네트워크</div>
              </div>

              <div className="separation_left_content">
                <div className="container gap-1">
                  <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.1rem', color: '#00FF00' }} />
                  <FontAwesomeIcon icon={faDesktop} />
                  <span>ens192</span>
                </div>
                <div className="flex items-center justify-center">
                  <FontAwesomeIcon icon={faArrowsAltH} style={{ color: 'grey', width: '5vw', fontSize: '0.6rem' }} />
                </div>

                <div className="container">
                  <div className="left-section">
                    <FontAwesomeIcon icon={faCheck} className="icon green-icon" />
                    <span className="text">ovirtmgmt</span>
                  </div>
                  <div className="right-section">
                    <FontAwesomeIcon icon={faFan} className="icon" />
                    <FontAwesomeIcon icon={faDesktop} className="icon" />
                    <FontAwesomeIcon icon={faDesktop} className="icon" />
                    <FontAwesomeIcon icon={faBan} className="icon" />
                    <FontAwesomeIcon icon={faExclamationTriangle} className="icon" />
                    <FontAwesomeIcon icon={faPencilAlt} className="icon" onClick={() => setIsSecondModalOpen(true)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="network_separation_right">


        {/* unconfigured_network는 네트워크 버튼이 클릭된 경우만 보임 */}
        {!isLabelVisible && (
          <div className="unconfigured_network">
            <div>할당되지 않은 논리 네트워크</div>
            <div style={{ backgroundColor: '#d1d1d1' }}>필수</div>
            <div className="unconfigured_content flex items-center space-x-2">
              <div>
                <FontAwesomeIcon icon={faCaretDown} style={{ color: 'red', marginRight: '0.2rem' }} />
                <span>ddd</span>
              </div>
              <FontAwesomeIcon icon={faNetworkWired} style={{ color: 'green', fontSize: '20px' }} />
            </div>
            <div className="unconfigured_content flex items-center space-x-2">
              <div>
                <FontAwesomeIcon icon={faCaretDown} style={{ color: 'red', marginRight: '0.2rem' }} />
                <span>ddd</span>
              </div>
              <FontAwesomeIcon icon={faNetworkWired} style={{ color: 'green', fontSize: '20px' }} />
            </div>
            <div className="unconfigured_content flex items-center space-x-2">
              <div>
                <FontAwesomeIcon icon={faCaretDown} style={{ color: 'red', marginRight: '0.2rem' }} />
                <span>ddd</span>
              </div>
              <FontAwesomeIcon icon={faNetworkWired} style={{ color: 'green', fontSize: '20px' }} />
            </div>
            <div style={{ backgroundColor: '#d1d1d1' }}>필요하지 않음</div>
            
          </div>
        )}


      </div>

      {/*연필아이콘 클릭하면 추가모달 */}
      <Modal
        isOpen={isSecondModalOpen}
        onRequestClose={closeSecondModal} // 모달 닫기 핸들러 연결
        contentLabel="추가"
        className="Modal"
        overlayClassName="Overlay newRolePopupOverlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="network_backup_edit">
          <div className="popup_header">
            <h1>관리 네트워크 인터페이스 수정:ovirtmgmt</h1>
            <button onClick={closeSecondModal}>
              <FontAwesomeIcon icon={faTimes} fixedWidth />
            </button>
          </div>

          <div className='flex'>
            <div className="network_backup_edit_nav">
              <div
                id="ipv4_tab"
                className={selectedModalTab === 'ipv4' ? 'active-tab' : 'inactive-tab'}
                onClick={() => setSelectedModalTab('ipv4')}
              >
                IPv4
              </div>
              <div
                id="ipv6_tab"
                className={selectedModalTab === 'ipv6' ? 'active-tab' : 'inactive-tab'}
                onClick={() => setSelectedModalTab('ipv6')}
              >
                IPv6
              </div>
              <div
                id="dns_tab"
                className={selectedModalTab === 'dns' ? 'active-tab' : 'inactive-tab'}
                onClick={() => setSelectedModalTab('dns')}
              >
                DNS 설정
              </div>
            </div>

            {/* 탭 내용 */}
            <div className="backup_edit_content">
              {selectedModalTab === 'ipv4' && 
              <>
                <div className="vnic_new_checkbox" style={{ borderBottom: '1px solid gray' }}>
                    <input type="checkbox" id="allow_all_users" checked />
                    <label htmlFor="allow_all_users">네트워크 동기화</label>
                </div>

                <div className='backup_edit_radiobox'>
                  <div className='font-bold'>부트 프로토콜</div>
                  <div className="radio_option">
                    <input type="radio" id="default_mtu" name="mtu" value="default" checked />
                    <label htmlFor="default_mtu">없음</label>
                  </div>
                  <div className="radio_option">
                    <input type="radio" id="dhcp_mtu" name="mtu" value="dhcp" />
                    <label htmlFor="dhcp_mtu">DHCP</label>
                  </div>
                  <div className="radio_option">
                    <input type="radio" id="static_mtu" name="mtu" value="static" />
                    <label htmlFor="static_mtu">정적</label>
                  </div>

                </div>

                <div>
                  <div className="vnic_new_box">
                    <label htmlFor="ip_address">IP</label>
                    <select id="ip_address" disabled>
                      <option value="#">#</option>
                    </select>
                  </div>
                  <div className="vnic_new_box">
                    <label htmlFor="netmask">넷마스크 / 라우팅 접두사</label>
                    <select id="netmask" disabled>
                      <option value="#">#</option>
                    </select>
                  </div>
                  <div className="vnic_new_box">
                    <label htmlFor="gateway">게이트웨이</label>
                    <select id="gateway" disabled>
                      <option value="#">#</option>
                    </select>
                  </div>
                </div>
                </>
              }
              {selectedModalTab === 'ipv6' && 
              <>
              <div className="vnic_new_checkbox" style={{ borderBottom: '1px solid gray' }}>
                  <input type="checkbox" id="allow_all_users" className='disabled' />
                  <label htmlFor="allow_all_users" className='disabled'>네트워크 동기화</label>
              </div>

              <div className='backup_edit_radiobox'>
                <div className='font-bold mb-0.5'>부트 프로토콜</div>
                <div className="radio_option mb-0.5">
                  <input type="radio" id="default_mtu" name="mtu" value="default" checked />
                  <label htmlFor="default_mtu">없음</label>
                </div>
                <div className="radio_option mb-0.5">
                  <input type="radio" id="dhcp_mtu" name="mtu" value="dhcp" />
                  <label htmlFor="dhcp_mtu">DHCP</label>
                </div>
                <div className="radio_option mb-0.5">
                  <input type="radio" id="slaac_mtu" name="mtu" value="slaac" />
                  <label htmlFor="slaac_mtu">상태 비저장 주소 자동 설정</label>
                </div>
                <div className="radio_option mb-0.5">
                  <input type="radio" id="dhcp_slaac_mtu" name="mtu" value="dhcp_slaac" />
                  <label htmlFor="dhcp_slaac_mtu">DHCP 및 상태 비저장 주소 자동 설정</label>
                </div>
                <div className="radio_option mb-0.5">
                  <input type="radio" id="static_mtu" name="mtu" value="static" />
                  <label htmlFor="static_mtu">정적</label>
                </div>
              </div>

              <div className='mt-3'>
                <div className="vnic_new_box">
                  <label htmlFor="ip_address" className='disabled'>IP</label>
                  <select id="ip_address" className='disabled' disabled>
                    <option value="#">#</option>
                  </select>
                </div>
                <div className="vnic_new_box">
                  <label htmlFor="netmask" className='disabled'>넷마스크 / 라우팅 접두사</label>
                  <select id="netmask"className='disabled' disabled>
                    <option value="#">#</option>
                  </select>
                </div>
                <div className="vnic_new_box">
                  <label htmlFor="gateway" className='disabled'>게이트웨이</label>
                  <select id="gateway"className='disabled' disabled>
                    <option value="#">#</option>
                  </select>
                </div>
              </div>
              </>
              }
              {selectedModalTab === 'dns' && 
              <>
              <div className="vnic_new_checkbox" style={{ borderBottom: '1px solid gray' }}>
                <input type="checkbox" id="network_sync" className='disabled' />
                <label htmlFor="network_sync" className='disabled'>네트워크 동기화</label>
              </div>
              <div className="vnic_new_checkbox">
                <input type="checkbox" id="qos_override"/>
                <label htmlFor="qos_override">QoS 덮어쓰기</label>
              </div>
              <div className='p-1 font-bold'>아웃바운드</div>
              <div className="network_form_group">
                <label htmlFor="weighted_share" className='disabled'>가중 공유</label>
                <input type="text" id="weighted_share" disabled />
              </div>
              <div className="network_form_group">
                <label htmlFor="rate_limit disabled">속도 제한 [Mbps]</label>
                <input type="text" id="rate_limit" disabled />
              </div>
              <div className="network_form_group">
                <label htmlFor="commit_rate disabled">커밋 속도 [Mbps]</label>
                <input type="text" id="commit_rate" disabled/>
              </div>

              </>
              }
            </div>
          </div>

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closeSecondModal}>취소</button>
          </div>
        </div>
      </Modal>

              </div>

                
                </div>
                


                <div className="edit_footer">
                  <button style={{ display: 'none' }}></button>
                  <button>OK</button>
                  <button onClick={closePopup}>취소</button>
                </div>
              </div>
            </Modal>
            <Footer/>
        </div>
    );
}

export default HostDetail;
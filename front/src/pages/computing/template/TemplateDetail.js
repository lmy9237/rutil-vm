import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NavButton from '../../navigation/NavButton';
import HeaderButton from '../../button/HeaderButton';
import Footer from '../../footer/Footer';
import Table from '../../zNotuse/Table';
import TableColumnsInfo from '../../table/TableColumnsInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretUp, faDesktop, faUniversity, faWrench, faUser
  , faCheckCircle, faExclamation, faFilm, faArrowCircleUp
} from '@fortawesome/free-solid-svg-icons'
import './css/HostDetail.css';
import TableOuter from '../table/TableOuter';


function TemplateDetail() {
  const { name } = useParams();
  //클릭한 이름 받아오기
  const handlePermissionFilterClick = (filter) => {
    setActivePermissionFilter(filter);
  };
  const [activePermissionFilter, setActivePermissionFilter] = useState('all');
    //테이블컴포넌트
     // 가상머신 
      const data = [
        {
          name: (
            <div>
              <FontAwesomeIcon icon={faCaretUp} style={{ color: 'green' }}fixedWidth/>
              HostedEngine
            </div>
          ),
          cluster: (
            <div>
              <FontAwesomeIcon icon={faDesktop} fixedWidth/>
              Default
            </div>
          ),
          ipAddress: '192.168.0.80 fe80::216:3eff:fe6c:208',
          fqdn: 'ovirt.ititinfo.com',
          memory: (
            <div>
              <span>52%</span>
              <div style={{ width: '52%', backgroundColor: 'green', height: '4px' }}></div>
            </div>
          ),
          cpu: (
            <div>
              <span>2%</span>
              <div style={{ width: '2%', backgroundColor: 'green', height: '4px' }}></div>
            </div>
          ),
          network: (
            <div>
              <span>0%</span>
              <div style={{ width: '0%', backgroundColor: 'green', height: '4px' }}></div>
            </div>
          ),
          status: '실행 중',
          uptime: '36 days',
        },
      ];
      

  const volumeData = [
    {
      name: 'block_sda',
      function: 'storage',
      vendor: 'VMware (null)',
      product: 'Virtual disk (null)',
      driver: '',
      currentlyUsed: '',
      connectedToVM: '',
      iommuGroup: '해당 없음',
      mdevType: '해당 없음',
    },
  ];

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

  
  const networkdata = [
    {
      icon: <FontAwesomeIcon icon={faUniversity} fixedWidth/>,
      unmanaged: <FontAwesomeIcon icon={faWrench} fixedWidth/>,
      vlan: 'VLAN',
      networkName: 'ovirtmgmt',
      ipv4: '192.168.0.81',
      ipv6: ''
    }
  ];
    // 권한

      const permissionData = [
        {
          icon: <FontAwesomeIcon icon={faUser} fixedWidth/>,
          user: 'ovirtmgmt',
          authProvider: '',
          namespace: '*',
          role: 'SuperUser',
          createdDate: '2023.12.29 AM 11:40:58',
          inheritedFrom: '(시스템)',
        },
      ];

      // 이벤트
      const eventData = [
        {
          icon: <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }}fixedWidth/>,
          time: '2024. 8. 7. PM 12:24:14',
          message: 'Check for available updates on host host01.ittinfo.com was completed successfully with message \'no updates available.\'',
          correlationId: '2568d791:c08...',
          source: 'oVirt',
          userEventId: '',
        },
      ];
      
    //
    const [activeTab, setActiveTab] = useState('general');
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    //headerbutton 컴포넌트
    const buttons = [
        { id: 'edit_btn', label: '편집', onClick: () => console.log('Edit button clicked') },
        { id: 'delete_btn', label: '삭제', onClick: () => console.log('Delete button clicked') },
        { id: 'manage_btn', label: '관리', onClick: () => console.log('Manage button clicked') },
        { id: 'install_btn', label: '설치', onClick: () => console.log('Install button clicked') }
      ];
    
      const popupItems = []; // 현재 팝업 아이템이 없으므로 빈 배열로 설정
      const uploadOptions = []; // 현재 업로드 옵션이 없으므로 빈 배열로 설정
    // nav컴포넌트
    const sections = [
        { id: 'general', label: '일반' },
        { id: 'machine', label: '가상머신' },
        { id: 'networkinterface', label: '네트워크 인터페이스' },
        { id: 'disk', label: '디스크' },
        { id: 'storage', label: '스토리지' },
        { id: 'permission', label: '권한' },
        { id: 'event', label: '이벤트' }
      ];

      
    return (
        <div id='section'>
             <HeaderButton
      title="템플릿"
      titleIcon={faDesktop}
      subtitle={name}
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
                <div className="host_btn_outer">
                {/* 일반 */}
                {activeTab === 'general' && (
                <div className="host_content_outer">

                    <div className="host_tables">

                        <div className="table_container_left">
                            <h2 style={{color:'white',border:'none'}}>하드웨어</h2>
                            <table className="host_table">
                              <tbody>
                                  <tr>
                                      <th>호스트이름/IP:</th>
                                      <td>{name}</td>
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
                                      <td>2024. 7. 2. AM 10:12:36</td>
                                  </tr>
                                  <tr>
                                      <th>Hosted Engine HA:</th>
                                      <td>활성 (접속: 3400)</td>
                                  </tr>
                                  <tr>
                                      <th>iSCSI 개시자 이름:</th>
                                      <td>iqn.1994-05.com.redhat:d33a11d7f51b</td>
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
                                      <td>강제 적용</td>
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

                        <div className="table_container_left">
                            <h2>하드웨어</h2>
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
                                    <td>Intel(R) Xeon(R) Gold 6354 CPU @ 3.00GHz</td>
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
                                    <td>Secure Intel Cascadelake Server Family</td>
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


                        <div  className="table_container_left">
                            <h2>소프트웨어</h2>
                            <table className="host_table">
                              <tbody>
                                <tr>
                                  <th>OS 버전:</th>
                                  <td>RHEL - 9.1.2206.0 - 23.el9</td>
                                </tr>
                                <tr>
                                  <th>OS 정보:</th>
                                  <td>oVirt Node 4.5.5</td>
                                </tr>
                                <tr>
                                  <th>커널 버전:</th>
                                  <td>5.14.0 - 388.el9.x86_64</td>
                                </tr>
                                <tr>
                                  <th>KVM 버전:</th>
                                  <td>8.1.0 - 4.el9</td>
                                </tr>
                                <tr>
                                  <th>LIBVIRT 버전:</th>
                                  <td>libvirt-9.5.0-6.el9</td>
                                </tr>
                                <tr>
                                  <th>VDSM 버전:</th>
                                  <td>vdsm-4.50.5-1.1.el9</td>
                                </tr>
                                <tr>
                                  <th>SPICE 버전:</th>
                                  <td></td>
                                </tr>
                                <tr>
                                  <th>GlusterFS 버전:</th>
                                  <td>glusterfs-10.5-1.el9s</td>
                                </tr>
                                <tr>
                                  <th>CEPH 버전:</th>
                                  <td>librbd1-16.2.14-1.el9</td>
                                </tr>
                                <tr>
                                  <th>Open vSwitch 버전:</th>
                                  <td>openvswitch-2.17-1.el9</td>
                                </tr>
                                <tr>
                                  <th>Nmstate 버전:</th>
                                  <td>nmstate-2.2-19.1.el9</td>
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
               
                )}
                {/* 가상머신 */}
                {activeTab === 'machine' && (
                <>
                    
                        <div className="content_header_right">
                            <button>실행</button>
                            <button>일시중지</button>
                            <button>종료</button>
                            <button>전원 끔</button>
                            <button>콘솔</button>
                            <button>마이그레이션</button>
                        </div>
                        <div className="host_filter_btns">
                            <span>가상 머신 필터:</span>
                            <div>
                                <button>현재 호스트에서 실행 중</button>
                                <button>현재 호스트에 고정</button>
                                <button>모두</button>
                            </div>
                        </div>
                        <TableOuter 
                          columns={TableColumnsInfo.VMS_FROM_HOST}
                          data={data}
                          onRowClick={() => console.log('Row clicked')}
                        />
                </>
                )}
             
                {/* 네트워크 인터페이스 */}
                {activeTab === 'networkinterface' && (
                <>
                  <div className="content_header_right">
                    <button>VF 보기</button>
                    <button>모두 확장</button>
                    <button>호스트 네트워크 설정</button>
                    <button>네트워크 설정 저장</button>
                    <button>모든 네트워크 동기화</button>
                  </div>

                  {[0, 1].map((index) => (
                    <div className='host_network_boxs' key={index}>
                      <div
                        className='host_network_firstbox'
                        onClick={() => toggleHiddenBox(index)}
                      >
                        <div>
                          <FontAwesomeIcon icon={faArrowCircleUp} fixedWidth/>
                          <FontAwesomeIcon icon={faFilm} fixedWidth/>
                          <span>ens192</span>
                        </div>
                        <div className='firstbox_flex'>
                          <div>
                            <div>MAC</div>
                            <span>00:4234324</span>
                          </div>
                        </div>
                        <div className='firstbox_flex'>
                          <div>
                            <div>Rx 속도(mbps)</div>
                            <span>103</span>
                          </div>
                          <div>
                            <div>총 Rx(바이트)</div>
                            <span>42,214,343,32,522</span>
                          </div>
                        </div>
                        <div className='firstbox_flex'>
                          <div>
                            <div>Rx 속도(mbps)</div>
                            <span>103</span>
                          </div>
                          <div>
                            <div>총 Rx(바이트)</div>
                            <span>42,214,343,32,522</span>
                          </div>
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faFilm} fixedWidth/>
                          <span>Mbps</span>
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faFilm} fixedWidth/>
                          <span>0 Pkts</span>
                        </div>
                      </div>
                      <div
                        className='host_network_hiddenbox'
                        style={{ display: visibleBoxes.includes(index) ? 'block' : 'none' }}
                      >
                         <TableOuter 
                           columns={TableColumnsInfo.NETWORKS_FROM_HOST}
                           data={networkdata}
                           onRowClick={() => console.log('Row clicked')}
                         />
                      </div>
                    </div>
                  ))}
                </>
                )}
                {/* 디스크 */}
                {activeTab === 'disk' && (
                <>
                  <div className="host_empty_outer">
                    <TableOuter 
                      columns={TableColumnsInfo.VOLUMES_FROM_HOST} 
                      data={volumeData} 
                      onRowClick={() => console.log('Row clicked')} 
                    />
                  </div>
                </>
                )}
                {/* 스토리지 */}
                {activeTab === 'storage' && (
                <>
                  <div className="host_empty_outer">
                    <TableOuter 
                      columns={TableColumnsInfo.VOLUMES_FROM_HOST} 
                      data={volumeData} 
                      onRowClick={() => console.log('Row clicked')} 
                    />
                  </div>
                </>
                )}
               
                {/* 권한 */}
                {activeTab === 'permission' && (
              <>
              <div className="content_header_right">
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
                data={activePermissionFilter === 'all' ? permissionData : []}
                onRowClick={() => console.log('Row clicked')}
              />
            </>
            )}
          
                {/* 이벤트 */}
                {activeTab === 'event' && (
                <div className="host_empty_outer">
                   <TableOuter
                     columns={TableColumnsInfo.EVENTS}
                     data={eventData}
                     onRowClick={() => console.log('Row clicked')} 
                    />
                </div>
                )}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default TemplateDetail;
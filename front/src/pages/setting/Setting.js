import React, { useEffect, useState } from 'react';
import {useParams, useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import Table from '../table/Table';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes,
  faUser,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import HeaderButton from '../../components/button/HeaderButton';
import Footer from '../footer/Footer';
import NavButton from '../navigation/NavButton';
import './css/Setting.css';
import { adjustFontSize } from '../../UIEvent';
import PagingTableOuter from '../../components/table/PagingTableOuter';
import Path from '../Header/Path';

const Setting = ({ }) => {
    const { section } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('user');
    const handleTabClick = (tab) => {
        setActiveTab(tab); 
        if (tab !== 'user') {
          navigate(`/settings/${tab}`); 
        } else {
          navigate('/settings'); 
        }
      };
    
      useEffect(() => {
        if (!section) {
          setActiveTab('user'); 
        } else {
          setActiveTab(section);
        }
      }, [section]);


    // 활성사용사세션 데이터
    const sessionData = [
      {
        sessionId: '3204',
        username: 'admin',
        authProvider: 'internal-authz',
        userId: 'b5e54b30-a5f3-11ee-81fa-00163...',
        sourceIp: '192.168.0.218',
        sessionStartTime: '2024. 1. 19. PM 1:04:09',
        lastSessionActive: '2024. 1. 19. PM 4:45:55',
      },
    ];
    // 사용자 데이터
    const userData = [
        {
            icon: <FontAwesomeIcon icon={faUser} fixedWidth/>, 
            name: '임시데이터',  
            lastName: '임시데이터',  
            username: '임시데이터', 
            provider: '임시데이터',  
            nameSpace: '임시데이터', 
            email: 'dfajkdf@3kfakdl', 
        },
    ];
    //스케줄링정책
    const userRadioData = [
        {
          icon: '3204',
          name: 'admin',
          description: 'internal-authz'
        },
      ];
    //인스턴스 데이터
    const instanceData = [
        {
          name: 'admin',
        },
      ];
    // 시스템권한
    const systemData = [
        {
            icon: <FontAwesomeIcon icon={faUser} fixedWidth/>, 
            user: 'admin',
            provider:'admin',  
            nameSpace:'admin', 
            role: 'admin'
        },
    ];


  const [showNetworkDetail, setShowNetworkDetail] = useState(false);
  const [settingPopupOpen, setSettingPopupOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [isNewRolePopupOpen, setIsNewRolePopupOpen] = useState(false);
  const [activeSettingForm, setActiveSettingForm] = useState('part');


  const openSettingPopup = () => setSettingPopupOpen(true);
  // 새로 만들기 버튼 클릭 시
  const openNewRolePopup = () => setIsNewRolePopupOpen(true); // 새 역할 팝업 열기
  const closeNewRolePopup = () => setIsNewRolePopupOpen(false); // 새 역할 팝업 닫기
  const closeSettingPopup = () => setActiveTab('user'); // 모달을 닫기 위해 'host'로 탭을 변경
  const handleSettingNavClick = (form) =>  setActiveSettingForm(form);
  const openPopup = (popupType) => setActivePopup(popupType);
  const closePopup = () => setActivePopup(null);

  useEffect(() => {
    window.addEventListener('resize', adjustFontSize);
    adjustFontSize();
    return () => { window.removeEventListener('resize', adjustFontSize); };
  }, []);

  // nav 컴포넌트
  const sections = [
    { id: 'user', label: '사용자' },
    { id: 'host', label: '활성 사용자 세션' },
    { id: 'licensing', label: '라이센싱' },
    { id: 'firewall', label: '방화벽' },
    { id: 'certificate', label: '인증서' }
    // { id: 'app_settings', label: '설정' },
    // { id: 'user_sessionInfo', label: '계정설정' },
  ];
  const pathData = ['관리', sections.find(section => section.id === activeTab)?.label];
  // HeaderButton 컴포넌트

      return (
        <div id="section">
          {showNetworkDetail ? (
            // <NetworkDetail />
            <></>
          ) : (
            <>
              <HeaderButton
                title="관리"
                subtitle=" > 사용자 세션"
                additionalText="목록이름"
                buttons={[]}
                popupItems={[]}
                uploadOptions={[]}
              />
  
            <div className="content-outer">
                <NavButton
                  sections={sections}
                  activeSection={activeTab}
                  handleSectionClick={handleTabClick}
                />
                 <div className="host-btn-outer">
                 <Path pathElements={pathData} />
                {/* 사용자 */}
                {activeTab === 'user' && (
                     <>
                     <div className="header_right_btns"> 
                         <button onClick={() => openPopup('uer_add')}>추가</button>
                         <button >편집</button>
                         <button onClick={() => openPopup('delete')}>삭제</button>
                         {/* <button onClick={() => openPopup('add_tag')}>태그설정</button> */}
                     </div>

                     <div className="section_table_outer">
                         <Table columns={TableColumnsInfo.SETTING_USER} data={userData}/>
                     </div>
                     <Modal
                        isOpen={activePopup === 'uer_add'}
                        onRequestClose={closePopup}
                        contentLabel="추가"
                        className="Modal"
                        overlayClassName="Overlay newRolePopupOverlay"
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="setting_system_new_popup">
                            <div className="popup_header">
                                <h1>사용자 및 그룹추가</h1>
                                <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>

                            <div className="power_radio_group">
                                <input type="radio" id="user" name="option" defaultChecked />
                                <label htmlFor="user">사용자</label>
                                
                                <input type="radio" id="group" name="option" />
                                <label htmlFor="group">그룹</label>
                            </div>

                            <div className="power_contents_outer">
                                <div>
                                    <label htmlFor="cluster">검색:</label>
                                    <select id="cluster">
                                        <option value="default">Default</option>   
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="cluster">네임스페이스:</label>
                                    <select id="cluster">
                                        <option value="default">Default</option>   
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: "white" }}>.</label>
                                    <input type="text" id="name" value="" />
                                </div>
                                <div>
                                    <div style={{ color: "white" }}>.</div>
                                    <input type="submit" value="검색" />
                                </div>
                            </div>

                            <div className="power_table">
                                <Table columns={TableColumnsInfo.SETTING_POPUP_USER} data={userData}/>
                            </div>

                            <div className="power_last_content" style={{ padding: "0.1rem 0.3rem" }}>
                                <label htmlFor="cluster">할당된 역할:</label>
                                <select id="cluster" style={{ width: "65%" }}>
                                    <option value="default">UserRole</option>   
                                </select>
                            </div>

                            <div className="edit_footer">
                                <button style={{ display: "none" }}></button>
                                <button>OK</button>
                                <button onClick={closePopup}>취소</button>
                            </div>
                        </div>
                    </Modal>  

                    {/*태그설정 팝업창 삭제예정 */}
                    {/* <Modal
                        isOpen={activePopup === 'add_tag'}
                        onRequestClose={closePopup}
                        contentLabel="추가"
                        className="Modal"
                        overlayClassName="Overlay newRolePopupOverlay"
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="setting_add_tag">
                            <div className="popup_header">
                                <h1>태그 설정</h1>
                                <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>
                            <div className='setting_add_tag_checkbox'>
                                <input type="checkbox" id="enable_forwarding" name="enable_forwarding" />
                                <label htmlFor="enable_forwarding">그리드 설정을 유지</label>
                            </div>
                            <div className="edit_footer">
                                <button style={{ display: "none" }}></button>
                                <button>OK</button>
                                <button onClick={closePopup}>취소</button>
                            </div>
                        </div>
                    </Modal>   */}
                   </>
                )}
                {/* 사용자 세션 */}
                {activeTab === 'host' && (
                    <>
                      <div className="header_right_btns"> 
                          <button className='disabled'>세션 종료</button>
                      </div>

                      <div className="section_table_outer">
                          <Table columns={TableColumnsInfo.ACTIVE_USER_SESSION} data={sessionData}/>
                      </div>
                            
                    </>
                )}

                {/* 라이센싱 */}
                {activeTab === 'licensing' && (
                    <>
                      <div className="header_right_btns"> 
                          <button>추가</button>
                          <button onClick={() => openPopup('delete')}>삭제</button>
                      </div>

                      
                    <PagingTableOuter 
                        columns={TableColumnsInfo.SETTING_LICENSING} 
                        data={sessionData}
                        showSearchBox={false}
                    />
                      
                            
                    </>
                )}

                    {/* 설정 */}
                    {/* {activeTab === 'app_settings' && !isNewRolePopupOpen &&(
                    <Modal
                        isOpen={true}
                        onRequestClose={closeSettingPopup}
                        contentLabel="설정"
                        className="Modal"
                        overlayClassName="Overlay"
                        shouldCloseOnOverlayClick={true}
                    >
                        <div className="setting_setting_popup">
                            <div className="popup_header">
                                <h1>설정</h1>
                                <button onClick={closeSettingPopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>

                        <div className='flex'>
                            <div className="network_new_nav">
                                <div id="setting_part_btn" className={activeSettingForm === 'part' ? 'active' : ''} onClick={() => handleSettingNavClick('part')}>역할</div>
                                <div id="setting_system_btn" className={activeSettingForm === 'system' ? 'active' : ''} onClick={() => handleSettingNavClick('system')}>시스템 권한</div>
                                <div id="setting_schedule_btn" className={activeSettingForm === 'schedule' ? 'active' : ''} onClick={() => handleSettingNavClick('schedule')}>스케줄링 정책</div>
                                <div id="setting_instant_btn" className={activeSettingForm === 'instant' ? 'active' : ''} onClick={() => handleSettingNavClick('instant')}>인스턴스 유형</div>
                                <div id="setting_mac_btn" className={activeSettingForm === 'mac' ? 'active' : ''} onClick={() => handleSettingNavClick('mac')}>MAC주소 풀</div>
                            </div>
            
                            {activeSettingForm === 'part' && (
                                <form id="setting_part_form">
                                    <div>보기</div>
                                    <div className="setting_part_nav">
                                        <div className="radio_toolbar">
                                            <div>
                                                <input type="radio" id="all_roles" name="roles" value="all" defaultChecked />
                                                <label htmlFor="all_roles">모든역할</label>
                                            </div>
                                            <div>
                                                <input type="radio" id="admin_roles" name="roles" value="admin" />
                                                <label htmlFor="admin_roles">관리자 역할</label>
                                            </div>
                                            <div>
                                                <input type="radio" id="user_roles" name="roles" value="user" />
                                                <label htmlFor="user_roles">사용자 역할</label>
                                            </div>
                                        </div>
            
                                        <div className="setting_buttons">
                                            <div id="setting_part_new_btn" onClick={() => openPopup('newRole')}>새로 만들기</div>
                                            <div>편집</div>
                                            <div>복사</div>
                                            <div>삭제</div>
                                        </div>
                                    </div>
            
                                    <div className="setting_part_table_outer" style={{ borderBottom: 'none' }}>
                                        <TableOuter
                                            columns={TableColumnsInfo.SETTING_ROLE}
                                            data={userRadioData}
                                            onRowClick={() => console.log('Row clicked')}
                                        />
                                    </div>
                                </form>
                            )}
            
                            {activeSettingForm === 'system' && (
                                <form id="setting_system_form">
                                    <div className="setting_part_nav">
                                        <div className="setting_buttons">
                                            <div id="setting_system_add_btn" onClick={() => openPopup('addSystemRole')}>추가</div>
                                            <div>제거</div>
                                        </div>
                                    </div>
            
                                    <div className="setting_part_table_outer" style={{ borderBottom: 'none' }}>
                                        <TableOuter
                                            columns={TableColumnsInfo.SETTING_SYSTEM}
                                            data={systemData}
                                            onRowClick={() => console.log('Row clicked')}
                                        />
                                    </div>
                                </form>
                            )}
            
                            {activeSettingForm === 'schedule' && (
                                <form id="setting_schedule_form">
                                    <div className="setting_part_nav">
                                        <div className="setting_buttons">
                                            <div id="setting_schedule_new_btn" onClick={() => openPopup('newSchedule')}>새로 만들기</div>
                                            <div>편집</div>
                                            <div>복사</div>
                                            <div>제거</div>
                                            <div id="setting_schedule_unit">정책 유닛 관리</div>
                                        </div>
                                    </div>
            
                                    <div className="setting_part_table_outer" style={{ borderBottom: 'none' }}>
                                        <TableOuter
                                            columns={TableColumnsInfo.SETTING_ROLE}
                                            data={userRadioData}
                                            onRowClick={() => console.log('Row clicked')}
                                        />
                                    </div>
                                </form>
                            )}
                    
                            {activeSettingForm === 'instant' && (
                                <form id="setting_instant_form">
                                    <div className="setting_part_nav">
                                        <div className="setting_buttons">
                                            <div id="setting_instant_new_btn">새로 만들기</div>
                                            <div>편집</div>
                                            <div>제거</div>
                                        </div>
                                    </div>
            
                                    <div className="setting_part_table_outer">
                                    <TableOuter
                                            columns={TableColumnsInfo.SETTING_INSTANCE}
                                            data={instanceData}
                                            onRowClick={() => console.log('Row clicked')}
                                        />
                                    </div>
                                </form>
                            )}
            
                            {activeSettingForm === 'mac' && (
                                <form id="setting_mac_form">
                                    <div className="setting_part_nav">
                                        <div className="setting_buttons">
                                            <div id="setting_mac_new_btn" onClick={() => openPopup('macNew')}>추가</div>
                                            <div id="setting_mac_edit_btn" onClick={() => openPopup('macEdit')}>편집</div>
                                            <div>제거</div>
                                        </div>
                                    </div>
                                
                                    <div className="setting_part_table_outer" style={{ borderBottom: 'none' }}>
                                        <TableOuter
                                            columns={TableColumnsInfo.SETTING_USER}
                                            data={userRadioData}
                                            onRowClick={() => console.log('Row clicked')}
                                        />
                                    </div>
            
                                    <div className="setting_part_table_outer">
                                        <TableOuter
                                            columns={TableColumnsInfo.SETTING_SYSTEM}
                                            data={systemData}
                                            onRowClick={() => console.log('Row clicked')}
                                        />
                                    </div>
                                </form>
                            )}
                        </div>
                            <div className="edit_footer">
                                <button style={{ display: 'none' }} onClick={closeSettingPopup}></button>
                                <button>OK</button>
                                <button onClick={closeSettingPopup}>취소</button>
                            </div>
            
                        </div>
                    </Modal>
                    )} */}

                    {/* 설정팝업 역할(새로만들기 팝업) */}
                    {/* <Modal

                        isOpen={activePopup === 'newRole'}
                        onRequestClose={closePopup}
                        contentLabel="새로 만들기"
                        className="Modal"
                        overlayClassName="Overlay newRolePopupOverlay"
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="setting_part_new_popup" >
                            <div className="popup_header">
                                <h1>새 역할</h1>
                                <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>

                            <div className="set_part_text">
                                <div>
                                    <div>
                                        <label htmlFor="new_role_name">이름</label><br />
                                        <input type="text" id="new_role_name" value="test02" />
                                    </div>
                                    <div>
                                        <label htmlFor="new_role_desc">설명</label><br />
                                        <input type="text" id="new_role_desc" value="test02" />
                                    </div>
                                </div>
                                <span>계정 유형:</span>
                                <div>
                                    <div>
                                        <input type="radio" id="new_role_user" name="new_role_type" value="user" checked />
                                        <label htmlFor="new_role_user" style={{ marginRight: '0.3rem' }}>사용자</label>
                                    </div>
                                    <div>
                                        <input type="radio" id="new_role_admin" name="new_role_type" value="admin" />
                                        <label htmlFor="new_role_admin">관리자</label>
                                    </div>
                                </div>
                            </div>

                            <div className="set_part_checkboxs">
                                <span>작업 허용을 위한 확인란</span>
                                <div className="set_part_buttons">
                                    <div>모두 확장</div>
                                    <div>모두 축소</div>
                                </div>
                                <div className="checkbox_toolbar">
                                    <div>
                                        <input type="checkbox" id="new_role_system" name="new_role_permissions" />
                                        <label htmlFor="new_role_system">시스템</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" id="new_role_network" name="new_role_permissions" />
                                        <label htmlFor="new_role_network">네트워크</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" id="new_role_template" name="new_role_permissions" />
                                        <label htmlFor="new_role_template">템플릿</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" id="new_role_vm" name="new_role_permissions" />
                                        <label htmlFor="new_role_vm">가상머신</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" id="new_role_vm_pool" name="new_role_permissions" />
                                        <label htmlFor="new_role_vm_pool">가상머신 풀</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" id="new_role_disk" name="new_role_permissions" />
                                        <label htmlFor="new_role_disk">디스크</label>
                                    </div>
                                </div>
                            </div>

                            <div className="edit_footer">
                                <button style={{ display: 'none' }}></button>
                                <button>OK</button>
                                <button onClick={closePopup}>취소</button>
                            </div>
                        </div>
                    </Modal> */}

                    {/* 설정팝업 시스템권한(추가 팝업) */}
                    {/* <Modal
                        isOpen={activePopup === 'addSystemRole'}
                        onRequestClose={closePopup}
                        contentLabel="추가"
                        className="Modal"
                        overlayClassName="Overlay newRolePopupOverlay"
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="setting_system_new_popup">
                            <div className="popup_header">
                                <h1>사용자에게 권한 추가</h1>
                                <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>

                            <div className="power_radio_group">
                                <input type="radio" id="user" name="option" defaultChecked />
                                <label htmlFor="user">사용자</label>
                                
                                <input type="radio" id="group" name="option" />
                                <label htmlFor="group">그룹</label>
                            </div>

                            <div className="power_contents_outer">
                                <div>
                                    <label htmlFor="cluster">검색:</label>
                                    <select id="cluster">
                                        <option value="default">Default</option>   
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="cluster">네임스페이스:</label>
                                    <select id="cluster">
                                        <option value="default">Default</option>   
                                    </select>
                                </div>
                                <div>
                                    <label style={{ color: "white" }}>.</label>
                                    <input type="text" id="name" value="test02" />
                                </div>
                                <div>
                                    <div style={{ color: "white" }}>.</div>
                                    <input type="submit" value="검색" />
                                </div>
                            </div>

                            <div className="power_table">
                                <Table columns={TableColumnsInfo.SETTING_POPUP_USER} data={userData}/>
                            </div>

                            <div className="power_last_content" style={{ padding: "0.1rem 0.3rem" }}>
                                <label htmlFor="cluster">할당된 역할:</label>
                                <select id="cluster" style={{ width: "65%" }}>
                                    <option value="default">UserRole</option>   
                                </select>
                            </div>

                            <div className="edit_footer">
                                <button style={{ display: "none" }}></button>
                                <button>OK</button>
                                <button onClick={closePopup}>취소</button>
                            </div>
                        </div>
                    </Modal>  */}
                    
                    {/* 설정팝업 스케줄링정책(새로만들기 팝업) */}
                    {/* <Modal
                        isOpen={activePopup === 'newSchedule'}
                        onRequestClose={closePopup}
                        contentLabel="새로 만들기"
                        className="Modal"
                        overlayClassName="Overlay newRolePopupOverlay"
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="setting_schedule_new_popup">
                            <div className="popup_header">
                                <h1>새 스케줄링 정책</h1>
                                <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>
                            
                            <div className="set_part_text" style={{ borderBottom: 'none' }}>
                                <div>
                                    <div>
                                        <label htmlFor="name">이름</label><br />
                                        <input type="text" id="name" defaultValue="test02" />
                                    </div>
                                    <div>
                                        <label htmlFor="name">설명</label><br />
                                        <input type="text" id="name" defaultValue="test02" />
                                    </div>
                                </div>
                            </div>

                            <div className="set_schedule_contents">
                                <div className="set_schedule_contents_left">
                                    <div>
                                        <h1>필터 모듈</h1>
                                        <div style={{ fontSize: '0.26rem' }}>드래그하거나 또는 컨텍스트 메뉴를 사용하여 변경 활성화된 필터</div>
                                        <div></div>
                                    </div>
                                    <div>
                                        <h1>필터 모듈</h1>
                                        <div style={{ fontSize: '0.26rem' }}>드래그하거나 또는 컨텍스트 메뉴를 사용하여 변경 활성화된 필터</div>
                                        <div></div>
                                    </div>
                                </div>
                                <div className="set_schedule_contents_right">
                                    <div>
                                        <span>비활성화된 필터</span>
                                        <div className="schedule_boxs">
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                        </div>
                                    </div>
                                    <div>
                                        <span>비활성화된 가중치</span>
                                        <div className="schedule_boxs">
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                            <div>Migration</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="set_schedule_balance">
                                <label htmlFor="network_port_security">
                                    비활성화된 필터<FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }}/>
                                </label>
                                <select>
                                    <option value="default">활성화</option>   
                                </select>
                            </div>

                            <div className="edit_footer">
                                <button style={{ display: 'none' }}></button>
                                <button>OK</button>
                                <button onClick={closePopup}>취소</button>
                            </div>
                        </div>

                    </Modal> */}

                    {/* 설정팝업 MAC주소 풀(추가 팝업) */}
                    {/* <Modal
                        isOpen={activePopup === 'macNew'}
                        onRequestClose={closePopup}
                        contentLabel="새로만들기"
                        className="Modal"
                            overlayClassName="Overlay newRolePopupOverlay"
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="setting_mac_new_popup">
                            <div className="popup_header">
                                <h1>새 MAC주소 풀</h1>
                                <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>
                            
                            <div className="setting_mac_textboxs">
                                <div>
                                    <span>이름</span>
                                    <input type="text" />
                                </div>
                                <div>
                                    <span>설명</span>
                                    <input type="text" />
                                </div>
                            </div>
                            <div className="setting_mac_checkbox flex">
                                <input type="checkbox" id="allow_duplicate" name="allow_duplicate" />
                                <label htmlFor="allow_duplicate">중복 허용</label>
                            </div>
                            
                            <div className="network_parameter_outer">
                                <span>MAC 주소 범위</span>
                                <div style={{ marginBottom: '0.2rem' }}>
                                    <div>
                                        <span style={{ marginRight: '0.3rem' }}>범위 시작</span>
                                        <input type="text" />
                                    </div>
                                    <div>
                                        <span>범위 끝</span>
                                        <input type="text" />
                                    </div>
                                    <div id="buttons">
                                        <button>+</button>
                                        <button>-</button>
                                    </div>
                                </div>
                                <div>
                                    MAC수 : 해당없음
                                </div>
                            </div>

                            <div className="edit_footer">
                                <button style={{ display: 'none' }}></button>
                                <button>OK</button>
                                <button onClick={closePopup}>취소</button>
                            </div>
                        </div>

                    </Modal> */}
                    {/* 설정팝업 MAC주소 풀(편집 팝업) */}
                    {/* <Modal
                        isOpen={activePopup === 'macEdit'}
                        onRequestClose={closePopup}
                        contentLabel="새로만들기"
                        className="Modal"
                            overlayClassName="Overlay newRolePopupOverlay"
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="setting_mac_new_popup">
                            <div className="popup_header">
                                <h1>새 MAC주소 풀</h1>
                                <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>
                            
                            <div className="setting_mac_textboxs">
                                <div>
                                    <span>이름</span>
                                    <input type="text" />
                                </div>
                                <div>
                                    <span>설명</span>
                                    <input type="text" />
                                </div>
                            </div>
                            <div className="setting_mac_checkbox flex">
                                <input type="checkbox" id="allow_duplicate" name="allow_duplicate" />
                                <label htmlFor="allow_duplicate">중복 허용</label>
                            </div>
                            
                            <div className="network_parameter_outer">
                                <span>MAC 주소 범위</span>
                                <div style={{ marginBottom: '0.2rem' }}>
                                    <div>
                                        <span style={{ marginRight: '0.3rem' }}>범위 시작</span>
                                        <input type="text" />
                                    </div>
                                    <div>
                                        <span>범위 끝</span>
                                        <input type="text" />
                                    </div>
                                    <div id="buttons">
                                        <button>+</button>
                                        <button>-</button>
                                    </div>
                                </div>
                                <div>
                                    MAC수 : 해당없음
                                </div>
                            </div>

                            <div className="edit_footer">
                                <button style={{ display: 'none' }}></button>
                                <button>OK</button>
                                <button onClick={closePopup}>취소</button>
                            </div>
                        </div>

                    </Modal> */}
              
                    {/* 계정설정 */}
                        {/* {activeTab === 'user_sessionInfo' && (
                        <Modal
                        isOpen={true}
                        onRequestClose={closeSettingPopup}
                        contentLabel="계정 설정"
                        className="Modal"
                        overlayClassName="Overlay"
                        shouldCloseOnOverlayClick={true}
                    >
                        <div className="user_sessionInfo_popup">
                            <div className="popup_header">
                                <h1>계정 설정</h1>
                                <button onClick={closeSettingPopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            </div>
            
                            <div className="network_new_nav">
                                <div id="setting_part_btn" className={activeSettingForm === 'part' ? 'active' : ''} onClick={() => handleSettingNavClick('part')}>일반</div>
                                <div id="setting_system_btn" className={activeSettingForm === 'system' ? 'active' : ''} onClick={() => handleSettingNavClick('system')}>Confirmations</div>
                            </div>
            
                            {activeSettingForm === 'part' && (
                                <form>
                                    <div className='setting_name_email'>
                                        <div>
                                            <span>사용자 이름</span>
                                            <span>admin</span>
                                        </div>
                                        <div>
                                            <span>이메일</span>
                                            <span>admin@localhost</span>
                                        </div>
                                    </div>
                                    <div className='setting_homepage'>
                                        <div className='font-extrabold'>Home Page</div>
                                        <div className='host_radiobox'>
                                            <input type="radio" id="ssh_key" name="name_option" />
                                            <label htmlFor="ssh_key">Default (#dashboard-main)</label>
                                        </div>
                                        <div className='host_radiobox'>
                                            <input type="radio" id="ssh_key" name="name_option" />
                                            <label htmlFor="ssh_key">Custom home page</label>
                                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                                        </div>
                                        <input type='text'/>
                                    </div>

                                    <div className='serial_console'>
                                        <div className='font-extrabold'>Serial Console</div>
                                        <div>
                                            사용자의 공개키
                                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                                        </div>
                                        <input className='serial_console_text' type='text'/>
                                    </div>
                                    <div className='serial_console'>
                                        <div className='font-extrabold'>Tables</div>
                                        <div className='flex'>
                                            <input type="checkbox" id="enable_forwarding" name="enable_forwarding" />
                                            <label htmlFor="enable_forwarding">그리드 설정을 유지</label>
                                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/> 
                                        </div>
                                        
                                    </div>
            
                                
                                </form>
                            )}
            
                            {activeSettingForm === 'system' && (
                            <div className='text-sm p-1.5 flex'>
                                <input type="checkbox" id="enable_forwarding" name="enable_forwarding" />
                                <label htmlFor="enable_forwarding">Show confirmation dialog on Suspend VM</label>
                            </div>
                            )}
            
                        
            
                            <div className="edit_footer">
                                <button style={{ display: 'none' }} onClick={closeSettingPopup}></button>
                                <button>OK</button>
                                <button onClick={closeSettingPopup}>취소</button>
                            </div>
            
                        </div>
                    </Modal>
                    )} */}



              </div>
    
              <Footer/>
              </div>

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
            <h1>디스크 삭제</h1>
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
    
            </>
          )}
        </div>
      );
    };
export default Setting;
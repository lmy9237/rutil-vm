import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch, faChevronDown, faEllipsisV, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import TableColumnsInfo from '../zNotuse/TableColumnsInfo';
import TablesOuter from '../table/TablesOuter';
import './css/HostDu.css';
import Modal from 'react-modal';

const HostDu = ({ data, columns, onRowClick,togglePopup,onContextMenuItems }) => {

  // 모달 관련 상태 및 함수
  const [activePopup, setActivePopup] = useState(null);
  const openPopup = (popupType) => {
    setActivePopup(popupType);
  };

const closePopup = () => {
    setActivePopup(null);
};
  // 토글 방식으로 열고 닫기(관리)
  const [isManageBoxVisible, setIsManageBoxVisible] = useState(false);

  // 관리버튼
  const handleManageClick = () => {
    setIsManageBoxVisible(!isManageBoxVisible);
  };
  // 설치 드롭다운 상태
const [isInstallBoxVisible, setIsInstallBoxVisible] = useState(false);

// 설치 버튼 핸들러
const handleInstallClick = () => {
  setIsInstallBoxVisible(!isInstallBoxVisible);
};
// 팝업 외부 클릭 시 닫히도록 처리
// 팝업 외부 클릭 시 닫히도록 처리
useEffect(() => {
  const handleClickOutside = (event) => {
    const manageBox = document.getElementById('manage_hidden_box');
    const manageBtn = document.getElementById('manage_btn');
    const installBox = document.getElementById('install_hidden_box');
    const installBtn = document.getElementById('install_btn');
    const installContainer = document.getElementById('install_container');
    const ellipsisBox = document.getElementById('ellipsis_hidden_box');
    const ellipsisBtn = document.getElementById('ellipsis_btn');
    
    // 클릭한 요소가 각 팝업 내부의 li인지 확인
    const isLiElement = event.target.tagName === 'LI';

    // 관리, 설치, ... 버튼과 해당 요소 외부 클릭 시 팝업 닫기
    if (
      !(
        (manageBox && manageBox.contains(event.target)) ||
        (manageBtn && manageBtn.contains(event.target)) ||
        (installBox && installBox.contains(event.target)) ||
        (installBtn && installBtn.contains(event.target)) ||
        (installContainer && installContainer.contains(event.target)) ||
        (ellipsisBox && ellipsisBox.contains(event.target)) ||
        (ellipsisBtn && ellipsisBtn.contains(event.target)) ||
        isLiElement // li 요소 클릭 시 제외
      )
    ) {
      setIsManageBoxVisible(false);
      setIsInstallBoxVisible(false); // 설치 드롭다운 닫기
      setPopupOpen(false); // ellipsis 팝업 닫기
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);



    // ...버튼
    const [popupOpen, setPopupOpen] = useState(false);
    const togglePopupMenu = () => {
      setPopupOpen(!popupOpen);
    };
  return (
    <>
      <div className="header_right_btns">
        <button onClick={() => openPopup('host_new')}>새로 만들기</button>
        <button onClick={() => openPopup('host_edit')}>편집</button>
        <button onClick={() => openPopup('delete')}>삭제</button>
        <div className="manage_container">
        <button id="manage_btn" onClick={handleManageClick} className="btn" >
            관리 <FontAwesomeIcon icon={faChevronDown} style={{marginLeft:'3px'}}/>
          </button>
          
          {isManageBoxVisible && (
            <ul id="manage_hidden_box" className="dropdown-menu">
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
        <div className="install_container">
          <button id="install_btn" onClick={handleInstallClick} className="btn">
            설치 <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '3px' }} />
          </button>

          {isInstallBoxVisible && (
            <ul id="install_hidden_box" className="dropdown-menu">
              <li>설치 옵션 1</li>
              <li>설치 옵션 2</li>
              <li style={{ borderTop: '1px solid #DDDDDD' }}>설치 옵션 3</li>
              <li style={{ borderBottom: '1px solid #DDDDDD' }}>설치 옵션 4</li>
            </ul>
          )}
        </div>
        <button>호스트 네트워크 복사</button>
        <div className="ellipsis_container">
          <button id="ellipsis_btn" onClick={togglePopupMenu} className="btn">
            <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
          </button>

          {popupOpen && (
            <ul id="ellipsis_hidden_box" className="dropdown-menu">
              <li className='disabled'>글로벌 HA 유지 관리를 활성화</li>
              <li>글로벌 HA 유지 관리를 비활성화</li>
            </ul>
          )}
        </div>
      </div>
      
      <TablesOuter
        columns={columns} 
        data={data} 
        onRowClick={onRowClick} 
        className="host_table"
        clickableColumnIndex={[0,3,4]} 
        onContextMenuItems={onContextMenuItems} 
      />

      {/* 호스트 새로 만들기 */}
      <Modal
      isOpen={activePopup === 'host_new'}
      onRequestClose={closePopup}
      contentLabel="새로 만들기"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}

    >
        <div className="host_new_add">
          <div className="popup_header">
            <h1>새 호스트</h1>
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

          <div className='px-0.5 py-0.5'>
            <div className='host_checkboxs'>
              <div className='host_checkbox'>
                  <input type="checkbox" id="memory_balloon" name="memory_balloon" checked/>
                  <label htmlFor="headless_mode">설치 후 호스트를 활성화</label>
              </div>
              <div className='host_checkbox'>
                  <input type="checkbox" id="headless_mode_info" name="headless_mode_info" checked/>
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
                    <input type="radio" id="password" name="name_option" checked />
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
                  <input type="radio" id="memory_balloon" name="memory_balloon" checked/>
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
      {/* 호스트 편집*/}
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
      {/*관리(유지보수) 팝업 */}
      <Modal
        isOpen={activePopup === 'maintenance'}
        onRequestClose={closePopup}
        contentLabel="디스크 업로드"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="host_maintenance_popup">
          <div className="popup_header">
            <h1>호스트 유지관리 모드</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
         
          <div className='maintenance_content'>
            <div>
             다음 호스트를 유지관리 모드로 설정하시겠습니까?
            </div>
            <div>
            - rutilvm-dev.host01
            </div>
            <div className="network_form_group">
                        <label htmlFor="description">설명</label>
                        <input type="text" id="description" />
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
    </>
    
  );
};

export default HostDu;

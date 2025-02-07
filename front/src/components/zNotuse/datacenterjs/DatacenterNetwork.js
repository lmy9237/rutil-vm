import {useNetworksFromDataCenter} from "../../../api/RQHook";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import TableOuter from "../../table/TableOuter";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

const DatacenterNetwork = ({ dataCenter }) => {
    const navigate = useNavigate();
    // 모달 관련 상태 및 함수
    const [activePopup, setActivePopup] = useState(null);
    const openPopup = (popupType) => setActivePopup(popupType);
    const closePopup = () => setActivePopup(null);

    const { 
        data: networks, 
        status: networksStatus, 
        isLoading: isNetworksLoading, 
        isError: isNetworksError 
      } = useNetworksFromDataCenter(dataCenter?.id, toTableItemPredicateNetworks);
      function toTableItemPredicateNetworks(network) {
        return {
          id: network?.id ?? '', 
          name: network?.name ?? '없음', // 네트워크 이름을 logicalName으로 매핑
          description: network?.description ?? '설명 없음', // 네트워크 설명
        };
      }

    return (
<>
              <div className="header_right_btns">
                <button onClick={() => openPopup('newNetwork')}>새로 만들기</button>
                <button onClick={() => openPopup('editNetwork')}>편집</button>
                <button onClick={() => openPopup('delete')}> 삭제</button>
              </div>
              <TableOuter 
                columns={TableColumnsInfo.LUN_SIMPLE}
                data={networks}
                onRowClick={(row, column, colIndex) => {
                  if (colIndex === 0) {
                    navigate(`/networks/${row.id}`); 
                  }
                }}
                clickableColumnIndex={[0]} 
                onContextMenuItems={() => [
                  <div key="새로 만들기" onClick={() => openPopup('newNetwork')}>새로 만들기</div>,
                  <div key="편집" onClick={() => openPopup('editNetwork')}>편집</div>,
                  <div key="삭제" onClick={() => openPopup('delete')}>삭제</div>
                ]}
              />
              {/* 새로 만들기 팝업(After) */}
            <Modal

isOpen={activePopup === 'newNetwork'}
onRequestClose={closePopup}
contentLabel="새로 만들기"
className="Modal"
overlayClassName="Overlay"
shouldCloseOnOverlayClick={false}
>
<div className="network_new_popup">
    <div className="popup_header">
        <h1>새 논리적 네트워크</h1>
        <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
    </div>

    <div>
      <form id="network_new_common_form">
          <div className="network_first_contents">
              <div className="network_form_group">
                  <label htmlFor="cluster">데이터 센터</label>
                  <select id="cluster">
                      <option value="default">Default</option>
                  </select>
              </div>
              <div className="network_form_group">
                  <div  className='checkbox_group'>
                      <label htmlFor="name">이름</label>
                      <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }}fixedWidth/>
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
          </div>

          <div className="network_second_contents">
            
              <div className="network_checkbox_type1">
                  <div className='checkbox_group'>
                      <input type="checkbox" id="valn_tagging" name="valn_tagging" />
                      <label htmlFor="valn_tagging">VALN 태깅 활성화</label>
                  </div>
                  <input type="text" id="valn_tagging_input" disabled />
              </div>
              <div className="network_checkbox_type2">
                  <input type="checkbox" id="vm_network" name="vm_network" checked/>
                  <label htmlFor="vm_network">가상 머신 네트워크</label>
              </div>
              <div className="network_checkbox_type2">
                  <input type="checkbox" id="photo_separation" name="photo_separation" />
                  <label htmlFor="photo_separation">포토 분리</label>
              </div>
              <div className="network_radio_group">
                  <div style={{ marginTop: '0.2rem' }}>MTU</div>
                  <div>
                      <div className="radio_option">
                          <input type="radio" id="default_mtu" name="mtu" value="default" checked />
                          <label htmlFor="default_mtu">기본값 (1500)</label>
                      </div>
                      <div className="radio_option">
                          <input type="radio" id="user_defined_mtu" name="mtu" value="user_defined" />
                          <label htmlFor="user_defined_mtu">사용자 정의</label>
                      </div>
                  </div>
              
              </div>
  
            
          
              <div className="network_checkbox_type2">
                  <input type="checkbox" id="dns_settings" name="dns_settings" />
                  <label htmlFor="dns_settings">DNS 설정</label>
              </div>
              <span>DNS서버</span>
              <div className="network_checkbox_type3">
                  <input type="text" id="name" disabled />
                  <div>
                      <button>+</button>
                      <button>-</button>
                  </div>
              </div>
              
          </div>
          <div id="network_new_cluster_form">
          <span>클러스터에서 네트워크를 연결/분리</span>
          <div>
              <table className="network_new_cluster_table">
                  <thead>
                      <tr>
                          <th>이름</th>
                          <th>
                              <div className="checkbox_group">
                                  <input type="checkbox" id="connect_all" />
                                  <label htmlFor="connect_all"> 모두 연결</label>
                              </div>
                          </th>
                          <th>
                              <div className="checkbox_group">
                                  <input type="checkbox" id="require_all" />
                                  <label htmlFor="require_all"> 모두 필요</label>
                              </div>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>Default</td>
                          <td className="checkbox-group">
                              <div className="checkbox_group">
                                  <input type="checkbox" id="connect_default" />
                                  <label htmlFor="connect_default"> 연결</label>
                              </div>
                          </td>
                          <td className="checkbox-group">
                              <div className="checkbox_group">
                                  <input type="checkbox" id="require_default" />
                                  <label htmlFor="require_default"> 필수</label>
                              </div>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
      </form>
    </div>

    <div className="edit_footer">
        <button style={{ display: 'none' }}></button>
        <button>OK</button>
        <button onClick={closePopup}>취소</button>
    </div>
</div>
            </Modal>
            {/* 편집 팝업(After) */}
            <Modal
                isOpen={activePopup === 'editNetwork'}
                onRequestClose={closePopup}
                contentLabel="편집"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
            >
                <div className="network_edit_popup">
                    <div className="popup_header">
                        <h1>논리 네트워크 수정</h1>
                        <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                    </div>
                    
                    <form id="network_new_common_form">
                    <div className="network_first_contents">
                                <div className="network_form_group">
                                    <label htmlFor="cluster">데이터 센터</label>
                                    <select id="cluster">
                                        <option value="default">Default</option>
                                    </select>
                                </div>
                                <div className="network_form_group">
                                    <div  className='checkbox_group'>
                                        <label htmlFor="name">이름</label>
                                        <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }}fixedWidth/>
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
                            </div>

                            <div className="network_second_contents">
                                
                                <div className="network_checkbox_type1">
                                    <div className='checkbox_group'>
                                        <input type="checkbox" id="valn_tagging" name="valn_tagging" />
                                        <label htmlFor="valn_tagging">VALN 태깅 활성화</label>
                                    </div>
                                    <input type="text" id="valn_tagging_input" disabled />
                                </div>
                                <div className="network_checkbox_type2">
                                    <input type="checkbox" id="vm_network" name="vm_network" checked/>
                                    <label htmlFor="vm_network">가상 머신 네트워크</label>
                                </div>
                                <div className="network_checkbox_type2">
                                    <input type="checkbox" id="photo_separation" name="photo_separation" />
                                    <label htmlFor="photo_separation">포토 분리</label>
                                </div>
                                <div className="network_radio_group">
                                    <div style={{ marginTop: '0.2rem' }}>MTU</div>
                                    <div>
                                        <div className="radio_option">
                                            <input type="radio" id="default_mtu" name="mtu" value="default" checked />
                                            <label htmlFor="default_mtu">기본값 (1500)</label>
                                        </div>
                                        <div className="radio_option">
                                            <input type="radio" id="user_defined_mtu" name="mtu" value="user_defined" />
                                            <label htmlFor="user_defined_mtu">사용자 정의</label>
                                        </div>
                                    </div>
                                   
                                </div>
                               
                                <div className="network_checkbox_type2">
                                    <input type="checkbox" id="dns_settings" name="dns_settings" />
                                    <label htmlFor="dns_settings">DNS 설정</label>
                                </div>
                                <span>DNS서버</span>
                                <div className="network_checkbox_type3">
                                    <input type="text" id="name" disabled />
                                    <div>
                                        <button>+</button>
                                        <button>-</button>
                                    </div>
                                </div>
                              
                            </div>
                        </form>
                   

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
    );
  };
  
  export default DatacenterNetwork;
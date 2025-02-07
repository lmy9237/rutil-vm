// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// const NetworkModal = ({ isOpen, onRequestClose, onSubmit }) => {
//   const [selectedTab, setSelectedTab] = useState('network_new_common_btn');
//   const [secondModalOpen, setSecondModalOpen] = useState(false);

//   const handleTabClick = (tab) => setSelectedTab(tab);

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(); // 부모 컴포넌트로 폼 데이터를 전달
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       contentLabel="새로 만들기"
//       className="Modal"
//       overlayClassName="Overlay"
//       shouldCloseOnOverlayClick={false}
//     >
//       <div className="network_new_popup">
//         <div className="popup_header">
//           <h1>새 논리적 네트워크</h1>
//           <button onClick={onRequestClose}>
//             <FontAwesomeIcon icon={faTimes} fixedWidth />
//           </button>
//         </div>

//         <div className="flex">
//           <div className="network_new_nav">
//             <div
//               id="network_new_common_btn"
//               className={selectedTab === 'network_new_common_btn' ? 'active-tab' : 'inactive-tab'}
//               onClick={() => handleTabClick('network_new_common_btn')}
//             >
//               일반
//             </div>
//             <div
//               id="network_new_cluster_btn"
//               className={selectedTab === 'network_new_cluster_btn' ? 'active-tab' : 'inactive-tab'}
//               onClick={() => handleTabClick('network_new_cluster_btn')}
//             >
//               클러스터
//             </div>
//             <div
//               id="network_new_vnic_btn"
//               className={selectedTab === 'network_new_vnic_btn' ? 'active-tab' : 'inactive-tab'}
//               onClick={() => handleTabClick('network_new_vnic_btn')}
//             >
//               vNIC 프로파일
//             </div>
//           </div>

//           {/* 일반 */}
//           {selectedTab === 'network_new_common_btn' && (
//             <form id="network_new_common_form" onSubmit={handleFormSubmit}>
//               <div className="network_first_contents">
//                 <div className="network_form_group">
//                   <label htmlFor="cluster">데이터 센터</label>
//                   <select id="cluster">
//                     <option value="default">Default</option>
//                   </select>
//                 </div>
//                 <div className="network_form_group">
//                   <div className="checkbox_group">
//                     <label htmlFor="name">이름</label>
//                     <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }} fixedWidth />
//                   </div>
//                   <input type="text" id="name" />
//                 </div>
//                 <div className="network_form_group">
//                   <label htmlFor="description">설명</label>
//                   <input type="text" id="description" />
//                 </div>
//                 <div className="network_form_group">
//                   <label htmlFor="comment">코멘트</label>
//                   <input type="text" id="comment" />
//                 </div>
//               </div>

//               <div className="network_second_contents">
//                 <span>네트워크 매개변수</span>
//                 <div className="network_form_group">
//                   <label htmlFor="network_label">네트워크 레이블</label>
//                   <input type="text" id="network_label" />
//                 </div>
//                 <div className="network_checkbox_type1">
//                   <div className="checkbox_group">
//                     <input type="checkbox" id="valn_tagging" name="valn_tagging" />
//                     <label htmlFor="valn_tagging">VALN 태깅 활성화</label>
//                   </div>
//                   <input type="text" id="valn_tagging_input" disabled />
//                 </div>
//                 <div className="network_checkbox_type2">
//                   <input type="checkbox" id="vm_network" name="vm_network" />
//                   <label htmlFor="vm_network">가상 머신 네트워크</label>
//                 </div>
//                 <div className="network_checkbox_type2">
//                   <input type="checkbox" id="photo_separation" name="photo_separation" />
//                   <label htmlFor="photo_separation">포토 분리</label>
//                 </div>
//                 <div className="network_radio_group">
//                   <div style={{ marginTop: '0.2rem' }}>MTU</div>
//                   <div>
//                     <div className="radio_option">
//                       <input type="radio" id="default_mtu" name="mtu" value="default" checked />
//                       <label htmlFor="default_mtu">기본값 (1500)</label>
//                     </div>
//                     <div className="radio_option">
//                       <input type="radio" id="user_defined_mtu" name="mtu" value="user_defined" />
//                       <label htmlFor="user_defined_mtu">사용자 정의</label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="network_form_group">
//                   <label htmlFor="host_network_qos">호스트 네트워크 QoS</label>
//                   <select id="host_network_qos">
//                     <option value="default">[제한없음]</option>
//                   </select>
//                 </div>
//                 <div className="popup_plus_btn">
//                   <div className="popup_plus" onClick={() => setSecondModalOpen(true)}>새로만들기</div>
//                 </div>

//                 {/* QoS 새로 만들기 모달 */}
//                 <Modal
//                   isOpen={secondModalOpen}
//                   onRequestClose={() => setSecondModalOpen(false)}
//                   contentLabel="추가 모달"
//                   className="SecondModal"
//                   overlayClassName="Overlay"
//                 >
//                   <div className="plus_popup_outer">
//                     <div className="popup_header">
//                       <h1>새 호스트 네트워크 Qos</h1>
//                       <button onClick={() => setSecondModalOpen(false)}>
//                         <FontAwesomeIcon icon={faTimes} fixedWidth />
//                       </button>
//                     </div>

//                     <div className="p-1" style={{ borderBottom: '1px solid #d3d3d3' }}>
//                       <div className="network_form_group">
//                         <label htmlFor="network_provider">네트워크 공급자</label>
//                         <select id="network_provider">
//                           <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
//                         </select>
//                       </div>
//                       <div className="network_form_group">
//                         <label htmlFor="qos_name">QoS 이름</label>
//                         <input type="text" id="qos_name" />
//                       </div>
//                       <div className="network_form_group">
//                         <label htmlFor="description">설명</label>
//                         <input type="text" id="description" />
//                       </div>
//                     </div>

//                     <div className="p-1">
//                       <span className="network_form_group font-bold">아웃바운드</span>
//                       <div className="network_form_group">
//                         <label htmlFor="weighted_share">가중 공유</label>
//                         <input type="text" id="weighted_share" />
//                       </div>
//                       <div className="network_form_group">
//                         <label htmlFor="speed_limit">속도 제한 [Mbps]</label>
//                         <input type="text" id="speed_limit" />
//                       </div>
//                       <div className="network_form_group">
//                         <label htmlFor="commit_rate">커밋 속도 [Mbps]</label>
//                         <input type="text" id="commit_rate" />
//                       </div>
//                     </div>

//                     <div className="edit_footer">
//                       <button>가져오기</button>
//                       <button onClick={() => setSecondModalOpen(false)}>취소</button>
//                     </div>
//                   </div>
//                 </Modal>

//                 <div className="network_checkbox_type2">
//                   <input type="checkbox" id="dns_settings" name="dns_settings" />
//                   <label htmlFor="dns_settings">DNS 설정</label>
//                 </div>
//               </div>
//             </form>
//           )}

//           {/* 클러스터 */}
//           {selectedTab === 'network_new_cluster_btn' && (
//             <form id="network_new_cluster_form" onSubmit={handleFormSubmit}>
//               <span>클러스터에서 네트워크를 연결/분리</span>
//               <div>
//                 <table className="network_new_cluster_table">
//                   <thead>
//                     <tr>
//                       <th>이름</th>
//                       <th>
//                         <div className="checkbox_group">
//                           <input type="checkbox" id="connect_all" />
//                           <label htmlFor="connect_all">모두 연결</label>
//                         </div>
//                       </th>
//                       <th>
//                         <div className="checkbox_group">
//                           <input type="checkbox" id="require_all" />
//                           <label htmlFor="require_all">모두 필요</label>
//                         </div>
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td>Default</td>
//                       <td className="checkbox-group">
//                         <div className="checkbox_group">
//                           <input type="checkbox" id="connect_default" />
//                           <label htmlFor="connect_default">연결</label>
//                         </div>
//                       </td>
//                       <td className="checkbox-group">
//                         <div className="checkbox_group">
//                           <input type="checkbox" id="require_default" />
//                           <label htmlFor="require_default">필수</label>
//                         </div>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </form>
//           )}

//           {/* vNIC 프로파일 */}
//           {selectedTab === 'network_new_vnic_btn' && (
//             <form id="network_new_vnic_form" onSubmit={handleFormSubmit}>
//               <span>vNIC 프로파일</span>
//               <div>
//                 <input type="text" id="vnic_profile" />
//                 <div className="checkbox_group">
//                   <input type="checkbox" id="public" disabled />
//                   <label htmlFor="public">공개</label>
//                   <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }} fixedWidth />
//                 </div>
//                 <label htmlFor="qos">QoS</label>
//                 <select id="qos">
//                   <option value="none">제한 없음</option>
//                 </select>
//                 <div className="network_new_vnic_buttons">
//                   <button>+</button>
//                   <button>-</button>
//                 </div>
//               </div>
//             </form>
//           )}
//         </div>

//         <div className="edit_footer">
//           <button>OK</button>
//           <button onClick={onRequestClose}>취소</button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default NetworkModal;





              {/* 네트워크(새로 만들기) */}
            //   <Modal
            //     isOpen={activePopup === 'makeNetwork'}
            //     onRequestClose={closePopup}
            //     contentLabel="새로 만들기"
            //     className="Modal"
            //     overlayClassName="Overlay"
            //     shouldCloseOnOverlayClick={false}
            // >
            //     <div className="network_new_popup">
            //         <div className="popup_header">
            //             <h1>새 논리적 네트워크</h1>
            //             <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
            //         </div>
                    
            //         <div className='flex'>
            //             <div className="network_new_nav">
            //                 <div
            //                     id="network_new_common_btn"
            //                     className={selectedTab === 'network_new_common_btn' ? 'active-tab' : 'inactive-tab'}
            //                     onClick={() => handleTabClick('network_new_common_btn')}
            //                 >
            //                     일반
            //                 </div>
            //                 <div
            //                     id="network_new_cluster_btn"
            //                     className={selectedTab === 'network_new_cluster_btn' ? 'active-tab' : 'inactive-tab'}
            //                     onClick={() => handleTabClick('network_new_cluster_btn')}
            //                 >
            //                     클러스터
            //                 </div>
            //                 <div
            //                     id="network_new_vnic_btn"
            //                     className={selectedTab === 'network_new_vnic_btn' ? 'active-tab' : 'inactive-tab'}
            //                     onClick={() => handleTabClick('network_new_vnic_btn')}
            //                     style={{ borderRight: 'none' }}
            //                 >
            //                     vNIC 프로파일
            //                 </div>
            //             </div>

                        {/* 일반 */}
                        {/* {selectedTab === 'network_new_common_btn' && (
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
                                    <span>네트워크 매개변수</span>
                                    <div className="network_form_group">
                                        <label htmlFor="network_label">네트워크 레이블</label>
                                        <input type="text" id="network_label" />
                                    </div>
                                    <div className="network_checkbox_type1">
                                        <div className='checkbox_group'>
                                            <input type="checkbox" id="valn_tagging" name="valn_tagging" />
                                            <label htmlFor="valn_tagging">VALN 태깅 활성화</label>
                                        </div>
                                        <input type="text" id="valn_tagging_input" disabled />
                                    </div>
                                    <div className="network_checkbox_type2">
                                        <input type="checkbox" id="vm_network" name="vm_network" />
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
                                    <div className="network_form_group">
                                        <label htmlFor="host_network_qos">호스트 네트워크 QoS</label>
                                        <select id="host_network_qos">
                                            <option value="default">[제한없음]</option>
                                        </select>
                                </div>
                                    <div className='popup_plus_btn'>
                                        <div className="popup_plus" onClick={() => setSecondModalOpen(true)}>새로만들기</div>
                                    </div>
                                    
                                        <Modal
                                            isOpen={secondModalOpen}
                                            onRequestClose={() => setSecondModalOpen(false)}
                                            contentLabel="추가 모달"
                                            className="SecondModal"
                                            overlayClassName="Overlay"
                                        >
                                                                
                                        <div className="plus_popup_outer">
                                            <div className="popup_header">
                                                <h1>새 호스트 네트워크 Qos</h1>
                                                <button  onClick={() => setSecondModalOpen(false)}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                                            </div>
                                            
                                            <div className='p-1' style={{ borderBottom: '1px solid #d3d3d3' }}>
                                                <div className="network_form_group">
                                                    <label htmlFor="network_provider">네트워크 공급자</label>
                                                    <select id="network_provider">
                                                    <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
                                                    </select>
                                                </div>
                                                <div className="network_form_group">
                                                    <label htmlFor="qos_name">QoS 이름</label>
                                                    <input type="text" id="qos_name" />
                                                </div>
                                                <div className="network_form_group">
                                                    <label htmlFor="description">설명</label>
                                                    <input type="text" id="description" />
                                                </div>
                                                </div>

                                                <div className='p-1'>
                                                <span className="network_form_group font-bold">아웃바운드</span>
                                                <div className="network_form_group">
                                                    <label htmlFor="weighted_share">가중 공유</label>
                                                    <input type="text" id="weighted_share" />
                                                </div>
                                                <div className="network_form_group">
                                                    <label htmlFor="speed_limit">속도 제한 [Mbps]</label>
                                                    <input type="text" id="speed_limit" />
                                                </div>
                                                <div className="network_form_group">
                                                    <label htmlFor="commit_rate">커밋 속도 [Mbps]</label>
                                                    <input type="text" id="commit_rate" />
                                                </div>
                                            </div>


                                            <div className="edit_footer">
                                                <button style={{ display: 'none' }}></button>
                                                <button>가져오기</button>
                                                <button onClick={() => setSecondModalOpen(false)}>취소</button>
                                            </div>
                                        </div>
                                        
                                        </Modal>
                                    <div className="network_checkbox_type2">
                                        <input type="checkbox" id="dns_settings" name="dns_settings" />
                                        <label htmlFor="dns_settings">DNS 설정</label>
                                    </div>
                                    <span>DB서버</span>
                                    <div className="network_checkbox_type3">
                                        <input type="text" id="name" disabled />
                                        <div>
                                            <button>+</button>
                                            <button>-</button>
                                        </div>
                                    </div>
                                    <div className="network_checkbox_type2">
                                        <input type="checkbox" id="external_vendor_creation" name="external_vendor_creation" />
                                        <label htmlFor="external_vendor_creation">외부 업체에서 작성</label>
                                    </div>
                                    <span>외부</span>
                                    <div className="network_form_group" style={{ paddingTop: 0 }}>
                                        <label htmlFor="external_provider">외부 공급자</label>
                                        <select id="external_provider">
                                            <option value="default">ovirt-provider-ovn</option>
                                        </select>
                                    </div>
                                    <div className="network_form_group">
                                        <label htmlFor="network_port_security">네트워크 포트 보안</label>
                                        <select id="network_port_security">
                                            <option value="default">활성화</option>
                                        </select>
                                    </div>
                                    <div className="network_checkbox_type2">
                                        <input type="checkbox" id="connect_to_physical_network" name="connect_to_physical_network" />
                                        <label htmlFor="connect_to_physical_network">물리적 네트워크에 연결</label>
                                    </div>
                                </div>
                            </form>
                        )} */}

                        {/* 클러스터 */}
                        {/* {selectedTab === 'network_new_cluster_btn' && (
                            <form id="network_new_cluster_form">
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
                            </form>
                        )} */}

                        {/* vNIC 프로파일 */}
                        {/* {selectedTab === 'network_new_vnic_btn' && (
                            <form id="network_new_vnic_form">
                                <span>vNIC 프로파일</span>
                                <div>
                                    <input type="text" id="vnic_profile" />
                                    <div className='checkbox_group'>
                                        <input type="checkbox" id="public" disabled />
                                        <label htmlFor="public">공개</label>
                                        <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/>
                                    </div>
                                    <label htmlFor="qos">QoS</label>
                                    <select id="qos">
                                        <option value="none">제한 없음</option>
                                    </select>
                                    <div className="network_new_vnic_buttons">
                                        <button>+</button>
                                        <button>-</button>
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
            </Modal> */}
























{/* 논리네트워크(네트워크추가) 팝업 */}
{/* <Modal
isOpen={activePopup === 'newNetwork'}
onRequestClose={closePopup}
contentLabel="새로 만들기"
className="Modal"
overlayClassName="Overlay"
shouldCloseOnOverlayClick={false}
>
<div className="network_new_popup">
    <div className="popup_header">
        <h1 class="text-sm">새 논리적 네트워크</h1>
        <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
    </div>

    <div className="network_new_nav">
        <div
            id="network_new_common_btn"
            className={selectedTab === 'network_new_common_btn' ? 'active-tab' : 'inactive-tab'}
            onClick={() => handleTabClickModal('network_new_common_btn')}
        >
            일반
        </div>
        <div
            id="network_new_cluster_btn"
            className={selectedTab === 'network_new_cluster_btn' ? 'active-tab' : 'inactive-tab'}
            onClick={() => handleTabClickModal('network_new_cluster_btn')}
        >
            클러스터
        </div>
        <div
            id="network_new_vnic_btn"
            className={selectedTab === 'network_new_vnic_btn' ? 'active-tab' : 'inactive-tab'}
            onClick={() => handleTabClickModal('network_new_vnic_btn')}
            style={{ borderRight: 'none' }}
        >
            vNIC 프로파일
        </div>
    </div>

    {/* 일반 */}
    // {selectedTab === 'network_new_common_btn' && (
    //     <form id="network_new_common_form">
    //         <div className="network_first_contents">
    //             <div className="network_form_group">
    //                 <label htmlFor="cluster">데이터 센터</label>
    //                 <select id="cluster">
    //                     <option value="default">Default</option>
    //                 </select>
    //             </div>
    //             <div className="network_form_group">
    //                 <div  className='checkbox_group'>
    //                     <label htmlFor="name">이름</label>
    //                     <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }}fixedWidth/>
    //                 </div>
    //                 <input type="text" id="name" />
    //             </div>
    //             <div className="network_form_group">
    //                 <label htmlFor="description">설명</label>
    //                 <input type="text" id="description" />
    //             </div>
    //             <div className="network_form_group">
    //                 <label htmlFor="comment">코멘트</label>
    //                 <input type="text" id="comment" />
    //             </div>
    //         </div>

    //         <div className="network_second_contents">
    //             <span>네트워크 매개변수</span>
    //             <div className="network_form_group">
    //                 <label htmlFor="network_label">네트워크 레이블</label>
    //                 <input type="text" id="network_label" />
    //             </div>
    //             <div className="network_checkbox_type1">
    //                 <div className='checkbox_group'>
    //                     <input type="checkbox" id="valn_tagging" name="valn_tagging" />
    //                     <label htmlFor="valn_tagging">VALN 태깅 활성화</label>
    //                 </div>
    //                 <input type="text" id="valn_tagging_input" disabled />
    //             </div>
    //             <div className="network_checkbox_type2">
    //                 <input type="checkbox" id="vm_network" name="vm_network" />
    //                 <label htmlFor="vm_network">가상 머신 네트워크</label>
    //             </div>
    //             <div className="network_checkbox_type2">
    //                 <input type="checkbox" id="photo_separation" name="photo_separation" />
    //                 <label htmlFor="photo_separation">포토 분리</label>
    //             </div>
    //             <div className="network_radio_group">
    //                 <div style={{ marginTop: '0.2rem' }}>MTU</div>
    //                 <div>
    //                     <div className="radio_option">
    //                         <input type="radio" id="default_mtu" name="mtu" value="default" checked />
    //                         <label htmlFor="default_mtu">기본값 (1500)</label>
    //                     </div>
    //                     <div className="radio_option">
    //                         <input type="radio" id="user_defined_mtu" name="mtu" value="user_defined" />
    //                         <label htmlFor="user_defined_mtu">사용자 정의</label>
    //                     </div>
    //                 </div>
                   
    //             </div>
    //             <div className="network_form_group">
    //                 <label htmlFor="host_network_qos">호스트 네트워크 QoS</label>
    //                 <select id="host_network_qos">
    //                     <option value="default">[제한없음]</option>
    //                 </select>
    //            </div>
    //             <div className='popup_plus_btn'>
    //                 <div className="popup_plus" onClick={() => setSecondModalOpen(true)}>새로만들기</div>
    //             </div>
                
    //                 <Modal
    //                     isOpen={secondModalOpen}
    //                     onRequestClose={() => setSecondModalOpen(false)}
    //                     contentLabel="추가 모달"
    //                     className="SecondModal"
    //                     overlayClassName="Overlay"
    //                 >
                                            
    //                 <div className="plus_popup_outer">
    //                     <div className="popup_header">
    //                         <h1>새 호스트 네트워크 Qos</h1>
    //                         <button  onClick={() => setSecondModalOpen(false)}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
    //                     </div>
                        
    //                     <div className='p-1' style={{ borderBottom: '1px solid #d3d3d3' }}>
    //                         <div className="network_form_group">
    //                             <label htmlFor="network_provider">네트워크 공급자</label>
    //                             <select id="network_provider">
    //                             <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
    //                             </select>
    //                         </div>
    //                         <div className="network_form_group">
    //                             <label htmlFor="qos_name">QoS 이름</label>
    //                             <input type="text" id="qos_name" />
    //                         </div>
    //                         <div className="network_form_group">
    //                             <label htmlFor="description">설명</label>
    //                             <input type="text" id="description" />
    //                         </div>
    //                         </div>

    //                         <div className='p-1'>
    //                         <span className="network_form_group font-bold">아웃바운드</span>
    //                         <div className="network_form_group">
    //                             <label htmlFor="weighted_share">가중 공유</label>
    //                             <input type="text" id="weighted_share" />
    //                         </div>
    //                         <div className="network_form_group">
    //                             <label htmlFor="speed_limit">속도 제한 [Mbps]</label>
    //                             <input type="text" id="speed_limit" />
    //                         </div>
    //                         <div className="network_form_group">
    //                             <label htmlFor="commit_rate">커밋 속도 [Mbps]</label>
    //                             <input type="text" id="commit_rate" />
    //                         </div>
    //                     </div>


    //                     <div className="edit_footer">
    //                         <button style={{ display: 'none' }}></button>
    //                         <button>가져오기</button>
    //                         <button onClick={() => setSecondModalOpen(false)}>취소</button>
    //                     </div>
    //                 </div>
                     
                    // </Modal>
//                 <div className="network_checkbox_type2">
//                     <input type="checkbox" id="dns_settings" name="dns_settings" />
//                     <label htmlFor="dns_settings">DNS 설정</label>
//                 </div>
//                 <span>DB서버</span>
//                 <div className="network_checkbox_type3">
//                     <input type="text" id="name" disabled />
//                     <div>
//                         <button>+</button>
//                         <button>-</button>
//                     </div>
//                 </div>
//                 <div className="network_checkbox_type2">
//                     <input type="checkbox" id="external_vendor_creation" name="external_vendor_creation" />
//                     <label htmlFor="external_vendor_creation">외부 업체에서 작성</label>
//                 </div>
//                 <span>외부</span>
//                 <div className="network_form_group" style={{ paddingTop: 0 }}>
//                     <label htmlFor="external_provider">외부 공급자</label>
//                     <select id="external_provider">
//                         <option value="default">ovirt-provider-ovn</option>
//                     </select>
//                 </div>
//                 <div className="network_form_group">
//                     <label htmlFor="network_port_security">네트워크 포트 보안</label>
//                     <select id="network_port_security">
//                         <option value="default">활성화</option>
//                     </select>
//                 </div>
//                 <div className="network_checkbox_type2">
//                     <input type="checkbox" id="connect_to_physical_network" name="connect_to_physical_network" />
//                     <label htmlFor="connect_to_physical_network">물리적 네트워크에 연결</label>
//                 </div>
//             </div>
//         </form>
//     )}

//     {/* 클러스터 */}
//     {selectedTab === 'network_new_cluster_btn' && (
//         <form id="network_new_cluster_form">
//             <span>클러스터에서 네트워크를 연결/분리</span>
//             <div>
//                 <table className="network_new_cluster_table">
//                     <thead>
//                         <tr>
//                             <th>이름</th>
//                             <th>
//                                 <div className="checkbox_group">
//                                     <input type="checkbox" id="connect_all" />
//                                     <label htmlFor="connect_all"> 모두 연결</label>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div className="checkbox_group">
//                                     <input type="checkbox" id="require_all" />
//                                     <label htmlFor="require_all"> 모두 필요</label>
//                                 </div>
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>Default</td>
//                             <td className="checkbox-group">
//                                 <div className="checkbox_group">
//                                     <input type="checkbox" id="connect_default" />
//                                     <label htmlFor="connect_default"> 연결</label>
//                                 </div>
//                             </td>
//                             <td className="checkbox-group">
//                                 <div className="checkbox_group">
//                                     <input type="checkbox" id="require_default" />
//                                     <label htmlFor="require_default"> 필수</label>
//                                 </div>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </form>
//     )}

//     {/* vNIC 프로파일 */}
//     {selectedTab === 'network_new_vnic_btn' && (
//         <form id="network_new_vnic_form">
//             <span>vNIC 프로파일</span>
//             <div>
//                 <input type="text" id="vnic_profile" />
//                 <div className='checkbox_group'>
//                     <input type="checkbox" id="public" disabled />
//                     <label htmlFor="public">공개</label>
//                     <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/>
//                 </div>
//                 <label htmlFor="qos">QoS</label>
//                 <select id="qos">
//                     <option value="none">제한 없음</option>
//                 </select>
//                 <div className="network_new_vnic_buttons">
//                     <button>+</button>
//                     <button>-</button>
//                 </div>
//             </div>
//         </form>
//     )}
//     <div className="edit_footer">
//         <button style={{ display: 'none' }}></button>
//         <button>OK</button>
//         <button onClick={closePopup}>취소</button>
//     </div>
// </div>
// </Modal> */}







            
              {/* 네트워크(편집) 팝업 */}
            //   <Modal
            //     isOpen={activePopup === 'editNetwork'}
            //     onRequestClose={closePopup}
            //     contentLabel="편집"
            //     className="Modal"
            //     overlayClassName="Overlay"
            //     shouldCloseOnOverlayClick={false}
            // >
            //     <div className="network_edit_popup">
            //         <div className="popup_header">
            //             <h1>논리 네트워크 편집</h1>
            //             <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
            //         </div>
                    
            //         <form id="network_new_common_form">
            //         <div className="network_first_contents">
            //                     <div className="network_form_group">
            //                         <label htmlFor="cluster">데이터 센터</label>
            //                         <select id="cluster">
            //                             <option value="default">Default</option>
            //                         </select>
            //                     </div>
            //                     <div className="network_form_group">
            //                         <div  className='checkbox_group'>
            //                             <label htmlFor="name">이름</label>
            //                             <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }}fixedWidth/>
            //                         </div>
            //                         <input type="text" id="name" />
            //                     </div>
            //                     <div className="network_form_group">
            //                         <label htmlFor="description">설명</label>
            //                         <input type="text" id="description" />
            //                     </div>
            //                     <div className="network_form_group">
            //                         <label htmlFor="comment">코멘트</label>
            //                         <input type="text" id="comment" />
            //                     </div>
            //                 </div>

            //                 <div className="network_second_contents">
            //                     <span>네트워크 매개변수</span>
            //                     <div className="network_form_group">
            //                         <label htmlFor="network_label">네트워크 레이블</label>
            //                         <input type="text" id="network_label" />
            //                     </div>
            //                     <div className="network_checkbox_type1">
            //                         <div className='checkbox_group'>
            //                             <input type="checkbox" id="valn_tagging" name="valn_tagging" />
            //                             <label htmlFor="valn_tagging">VALN 태깅 활성화</label>
            //                         </div>
            //                         <input type="text" id="valn_tagging_input" disabled />
            //                     </div>
            //                     <div className="network_checkbox_type2">
            //                         <input type="checkbox" id="vm_network" name="vm_network" />
            //                         <label htmlFor="vm_network">가상 머신 네트워크</label>
            //                     </div>
            //                     <div className="network_checkbox_type2">
            //                         <input type="checkbox" id="photo_separation" name="photo_separation" />
            //                         <label htmlFor="photo_separation">포토 분리</label>
            //                     </div>
            //                     <div className="network_radio_group">
            //                         <div style={{ marginTop: '0.2rem' }}>MTU</div>
            //                         <div>
            //                             <div className="radio_option">
            //                                 <input type="radio" id="default_mtu" name="mtu" value="default" checked />
            //                                 <label htmlFor="default_mtu">기본값 (1500)</label>
            //                             </div>
            //                             <div className="radio_option">
            //                                 <input type="radio" id="user_defined_mtu" name="mtu" value="user_defined" />
            //                                 <label htmlFor="user_defined_mtu">사용자 정의</label>
            //                             </div>
            //                         </div>
                                   
            //                     </div>
            //                     <div className="network_form_group">
            //                         <label htmlFor="host_network_qos">호스트 네트워크 QoS</label>
            //                         <select id="host_network_qos">
            //                             <option value="default">[제한없음]</option>
            //                         </select>
            //                    </div>
            //                     <div className='popup_plus_btn'>
            //                         <div className="popup_plus" onClick={() => setSecondModalOpen(true)}>새로만들기</div>
            //                     </div>
                                
            //                         <Modal
            //                             isOpen={secondModalOpen}
            //                             onRequestClose={() => setSecondModalOpen(false)}
            //                             contentLabel="추가 모달"
            //                             className="SecondModal"
            //                             overlayClassName="Overlay"
            //                         >
                                                            
            //                         <div className="plus_popup_outer">
            //                             <div className="popup_header">
            //                                 <h1>새 호스트 네트워크 Qos</h1>
            //                                 <button  onClick={() => setSecondModalOpen(false)}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
            //                             </div>
                                        
            //                             <div className='p-1' style={{ borderBottom: '1px solid #d3d3d3' }}>
            //                                 <div className="network_form_group">
            //                                     <label htmlFor="network_provider">네트워크 공급자</label>
            //                                     <select id="network_provider">
            //                                     <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
            //                                     </select>
            //                                 </div>
            //                                 <div className="network_form_group">
            //                                     <label htmlFor="qos_name">QoS 이름</label>
            //                                     <input type="text" id="qos_name" />
            //                                 </div>
            //                                 <div className="network_form_group">
            //                                     <label htmlFor="description">설명</label>
            //                                     <input type="text" id="description" />
            //                                 </div>
            //                                 </div>

            //                                 <div className='p-1'>
            //                                 <span className="network_form_group font-bold">아웃바운드</span>
            //                                 <div className="network_form_group">
            //                                     <label htmlFor="weighted_share">가중 공유</label>
            //                                     <input type="text" id="weighted_share" />
            //                                 </div>
            //                                 <div className="network_form_group">
            //                                     <label htmlFor="speed_limit">속도 제한 [Mbps]</label>
            //                                     <input type="text" id="speed_limit" />
            //                                 </div>
            //                                 <div className="network_form_group">
            //                                     <label htmlFor="commit_rate">커밋 속도 [Mbps]</label>
            //                                     <input type="text" id="commit_rate" />
            //                                 </div>
            //                             </div>


            //                             <div className="edit_footer">
            //                                 <button style={{ display: 'none' }}></button>
            //                                 <button>가져오기</button>
            //                                 <button onClick={() => setSecondModalOpen(false)}>취소</button>
            //                             </div>
            //                         </div>
                                     
            //                         </Modal>
            //                     <div className="network_checkbox_type2">
            //                         <input type="checkbox" id="dns_settings" name="dns_settings" />
            //                         <label htmlFor="dns_settings">DNS 설정</label>
            //                     </div>
            //                     <span>DB서버</span>
            //                     <div className="network_checkbox_type3">
            //                         <input type="text" id="name" disabled />
            //                         <div>
            //                             <button>+</button>
            //                             <button>-</button>
            //                         </div>
            //                     </div>
            //                     <div className="network_checkbox_type2">
            //                         <input type="checkbox" id="external_vendor_creation" name="external_vendor_creation" />
            //                         <label htmlFor="external_vendor_creation">외부 업체에서 작성</label>
            //                     </div>
            //                     <span>외부</span>
            //                     <div className="network_form_group" style={{ paddingTop: 0 }}>
            //                         <label htmlFor="external_provider">외부 공급자</label>
            //                         <select id="external_provider">
            //                             <option value="default">ovirt-provider-ovn</option>
            //                         </select>
            //                     </div>
            //                     <div className="network_form_group">
            //                         <label htmlFor="network_port_security">네트워크 포트 보안</label>
            //                         <select id="network_port_security">
            //                             <option value="default">활성화</option>
            //                         </select>
            //                     </div>
            //                     <div className="network_checkbox_type2">
            //                         <input type="checkbox" id="connect_to_physical_network" name="connect_to_physical_network" />
            //                         <label htmlFor="connect_to_physical_network">물리적 네트워크에 연결</label>
            //                     </div>
            //                 </div>
            //             </form>
                   

            //         <div className="edit_footer">
            //             <button style={{ display: 'none' }}></button>
            //             <button>OK</button>
            //             <button onClick={closePopup}>취소</button>
            //         </div>
            //     </div>
            // </Modal>
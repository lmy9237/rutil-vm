// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';

// const VmCreatePlusModal = ({ isOpen, onRequestClose }) => {
//   const [activeTab, setActiveTab] = useState('img');

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       contentLabel="새 가상 디스크"
//       className="Modal"
//       overlayClassName="modalOverlay"
//       shouldCloseOnOverlayClick={false}
//     >
//       <div className="storage_disk_new_popup">
//         <div className="popup_header">
//           <h1>새 가상 디스크</h1>
//           <button onClick={onRequestClose}>
//             <FontAwesomeIcon icon={faTimes} fixedWidth />
//           </button>
//         </div>
//         <div className="disk_new_nav">
//           <div
//             id="storage_img_btn"
//             onClick={() => handleTabClick('img')}
//             className={activeTab === 'img' ? 'active' : ''}
//           >
//             이미지
//           </div>
//           <div
//             id="storage_directlun_btn"
//             onClick={() => handleTabClick('directlun')}
//             className={activeTab === 'directlun' ? 'active' : ''}
//           >
//             직접 LUN
//           </div>
//         </div>
//         {activeTab === 'img' && (
//           <div className="disk_new_img">
//             <div className="disk_new_img_left">
//               <div className="img_input_box">
//                 <span>크기(GIB)</span>
//                 <input type="text" />
//               </div>
//               <div className="img_input_box">
//                 <span>별칭</span>
//                 <input type="text" />
//               </div>
//               <div className="img_input_box">
//                 <span>설명</span>
//                 <input type="text" />
//               </div>
//               <div className="img_select_box">
//                 <label htmlFor="os">데이터 센터</label>
//                 <select id="os">
//                   <option value="linux">Linux</option>
//                 </select>
//               </div>
//               <div className="img_select_box">
//                 <label htmlFor="os">스토리지 도메인</label>
//                 <select id="os">
//                   <option value="linux">Linux</option>
//                 </select>
//               </div>
//               <div className="img_select_box">
//                 <label htmlFor="os">할당 정책</label>
//                 <select id="os">
//                   <option value="linux">Linux</option>
//                 </select>
//               </div>
//               <div className="img_select_box">
//                 <label htmlFor="os">디스크 프로파일</label>
//                 <select id="os">
//                   <option value="linux">Linux</option>
//                 </select>
//               </div>
//             </div>
//             <div className="disk_new_img_right">
//               <div>
//                 <input type="checkbox" id="reset_after_deletion" checked />
//                 <label htmlFor="reset_after_deletion">부팅 가능</label>
//               </div>
//               <div>
//                 <input type="checkbox" className="shareable" />
//                 <label htmlFor="shareable">공유 가능</label>
//               </div>
//               <div>
//                 <input type="checkbox" id="incremental_backup" defaultChecked />
//                 <label htmlFor="incremental_backup">읽기 전용</label>
//               </div>
//             </div>
//           </div>
//         )}
//         {activeTab === 'directlun' && (
//           <div id="storage_directlun_outer">
//             <div id="storage_lun_first">
//               <div className="disk_new_img_left">
//                 <div className="img_input_box">
//                   <span>별칭</span>
//                   <input type="text" />
//                 </div>
//                 <div className="img_input_box">
//                   <span>설명</span>
//                   <input type="text" />
//                 </div>
//                 <div className="img_select_box">
//                   <label htmlFor="os">데이터 센터</label>
//                   <select id="os">
//                     <option value="linux">Linux</option>
//                   </select>
//                 </div>
//                 <div className="img_select_box">
//                   <label htmlFor="os">호스트</label>
//                   <select id="os">
//                     <option value="linux">Linux</option>
//                   </select>
//                 </div>
//                 <div className="img_select_box">
//                   <label htmlFor="os">스토리지 타입</label>
//                   <select id="os">
//                     <option value="linux">Linux</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="disk_new_img_right">
//                 <div>
//                   <input type="checkbox" className="shareable" />
//                   <label htmlFor="shareable">공유 가능</label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         <div className="edit_footer">
//           <button>OK</button>
//           <button onClick={onRequestClose}>취소</button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default VmCreatePlusModal;

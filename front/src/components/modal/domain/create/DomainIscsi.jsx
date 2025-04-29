// import React, { useState } from 'react';
// import Tables from '../../../table/Tables';
// import TableColumnsInfo from '../../../table/TableColumnsInfo';
// import LabelInput from '../../../label/LabelInput';
// import Localization from '../../../../utils/Localization';
// import Logger from '../../../../utils/Logger';
// import { handleInputChange } from '../../../label/HandleInput';
// import toast from 'react-hot-toast';

// const DomainIscsi = ({
//   editMode=false,
//   iscsiResults, setIscsiResults,
//   lunId, setLunId,
//   hostVo,
//   formSearchState, setFormSearchState,
//   importIscsiFromHostAPI, 
//   refetchIscsis, isIscsisLoading, isIscsisError, isIscsisSuccess
// }) => {
//   const [isFooterContentVisible, setIsFooterContentVisible] = useState(false);
//   // const [isIscsisLoading, setIsIscsisLoading] = useState(false);
//   // const [isIscsisError, setIsIscsisError] = useState(false);
//   // const [isIscsisSuccess, setIsIscsisSuccess] = useState(false);

//   // const transIscsiData = [...iscsiResults]?.map((i) => {
//   //   const lun = i?.logicalUnits?.[0];
//   //   if (!lun) return { ...i, abled: "NO" }; // 논리유닛 없으면 기본값 처리
  
//   //   return {
//   //     ...i,
//   //     id: lun.id,
//   //     abled: lun.storageDomainId === "" ? "OK" : "NO",
//   //     status: lun.status,
//   //     lunId: lun.id,
//   //     size: checkZeroSizeToGiB(lun.size),
//   //     paths: lun.paths,
//   //     vendorId: lun.vendorId,
//   //     productId: lun.productId,
//   //     serial: lun.serial,
//   //     target: lun.target,
//   //     address: lun.address,
//   //     port: lun.port,
//   //   };
//   // });

//   const handleSearchIscsi = () => {
//     if (!hostVo.id) return toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
//     if (!formSearchState.address) return toast.error('주소를 입력해주세요.');   
//     if (!formSearchState.port) return toast.error('포트를 입력해주세요.');   

//     // setIsIscsisLoading(true);

//     importIscsiFromHostAPI(
//       { hostId: hostVo?.id, iscsiData: formSearchState },
//       { 
//         onSuccess: (data) => {
//           setIscsiResults(data);
//           // setIsIscsisLoading(false);
//           // setIsIscsisSuccess(true);
//           // setIsIscsisError(false);
//         },
//         onError: (error) => {
//           toast.error("iSCSI 가져오기 실패");
//         //   setIsIscsisLoading(false);
//         //   setIsIscsisSuccess(false);
//         //   setIsIscsisError(true);
//         },
//       }
//     );
//   };

//   const handleRowClick = (row) => {
//     const selectedRow = Array.isArray(row) ? row[0] : row;
//     if (selectedRow && selectedRow.id) {
//       Logger.debug('선택한 LUN ID:', selectedRow.id);
//       setLunId(selectedRow.id);
//     }
//   };

//   return (
//     <div className="storage-popup-iSCSI">
//       <div className="section-table-outer">
//       {editMode ? ( // 편집일때
//         <Tables target={"iscsi"}
//           columns={TableColumnsInfo.LUNS_TARGETS}
//           data={iscsiResults}
//           onRowClick={ (row) => handleRowClick(row) }
//           shouldHighlight1stCol={true}
//           isLoading={isIscsisLoading} isError={isIscsisError} isSuccess={isIscsisSuccess}
//         />
//       ): (
//         <>
//           <div className="target-search-outer">
//             <label className="fs-16">{Localization.kr.TARGET} {Localization.kr.SEARCH}</label>
//             <div className="target-search-container">
              
//               <div className="input-inline-wrap">
//                 <LabelInput id="address" label="주소"
//                   value={formSearchState.address} 
//                   onChange={handleInputChange(setFormSearchState, 'address')} 
//                 />
//                 <LabelInput label="포트" id="port" 
//                   value={formSearchState.port} 
//                   onChange={handleInputChange(setFormSearchState, 'port')} 
//                 />
//               <div className='target-btn'>
//                 <button className="search-button" onClick={handleSearchIscsi}>검색</button>
//               </div>
//             </div>

//             <div className="vertical-divider"></div>

//              {/*<div className={`target-search-right ${formSearchState.useChap ? 'with-background' : ''}`}>
//               <div className="use-chap-arrow">
//                 <ToggleSwitchButton
//                   label="사용자 인증"
//                   checked={formSearchState.useChap}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     setFormImportState((prev) => ({ ...prev, useChap: checked }));
//                     setIsFooterContentVisible(checked);
//                   }}
//                   tType={"on"} fType={"off"}
//                 />
//               </div>

//               {isFooterContentVisible && (
//                 <div className="use-chap-content">
//                   <LabelInput id="chapName" label="CHAP 사용자 이름"
//                     value={formImportState.chapName}
//                     onChange={handleInputChange('chapName')}
//                     disabled={!formImportState.useChap}
//                   />
//                   <LabelInput id="chapPassword" label="CHAP 암호"
//                     type="password"
//                     value={formImportState.chapPassword}
//                     onChange={handleInputChange('chapPassword')}
//                     disabled={!formImportState.useChap}
//                   />
//                   <div className="target-btn">
//                     <button className="all-login-button" onClick={handleLoginIscsi}>로그인</button>
//                   </div>
//                 </div>
//                 )}
//               </div> 
//             </div> */}
//           </div>

//           <Tables target={"iscsi"}
//             columns={TableColumnsInfo.LUNS_TARGETS}
//             data={iscsiResults}
//             onRowClick={ (row) => handleRowClick(row) }
//             shouldHighlight1stCol={true}
//             isLoading={isIscsisLoading} isError={isIscsisError} isSuccess={isIscsisSuccess}
//           />
//         </div>
//         </>
//       )}
//       </div>
//       <div><span style={{ fontSize: '22px' }}>id: {lunId}</span></div>
//     </div>
//   );
// };

// export default DomainIscsi;

import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import Tables from '../../../table/Tables';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import LabelInput from '../../../label/LabelInput';
import Localization from '../../../../utils/Localization';
import Logger from '../../../../utils/Logger';
import ToggleSwitchButton from '../../../button/ToggleSwitchButton';

const DomainIscsi = ({
  editMode=false,
  iscsiResults, setIscsiResults,
  lunId, setLunId,
  hostVo,
  formSearchState, setFormSearchState,
  // refetchIscsis, isIscsisLoading, isIscsisError, isIscsisSuccess
}) => {
//   const [isFooterContentVisible, setIsFooterContentVisible] = useState(false);
//   const [isIscsisLoading, setIsIscsisLoading] = useState(false);
//   const [isIscsisError, setIsIscsisError] = useState(false);
//   const [isIscsisSuccess, setIsIscsisSuccess] = useState(false);
  
//   const transIscsiData = [...iscsiResults]?.map((i) => ({
//     ...i,
//     target: i?.target,
//     address: i?.address,
//     port: i?.port,
//   }));

//   // iscsi 생성
//   const handleSearchIscsi = () => {
//     if (!hostVo.id) return toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
//     if (!formSearchState.address || !formSearchState.port) return toast.error('주소와 포트를 입력해주세요.');   
    
//     importIscsiFromHost({ hostId: hostVo?.id, iscsiData: formImportState }, {
//       onSuccess: (data) => { setIscsiSearchResults(data) },
//       onError: (error) => { toast.error('iSCSI 가져오기 실패:', error) }
//     });
//   };

//   // iscsi 가져오기 시 로그인 처리
//   const handleLoginIscsi = () => {
//     if (!formImportState.target) return toast.error('항목을 선택해주세요.');

//     loginIscsiFromHost({ hostId: hostVo?.id, iscsiData: formImportState }, {
//       onSuccess: (data) => { setIscsiSearchResults(data) },
//       onError: (error) => { toast.error('iSCSI 로그인 실패:', error) },
//     });
//   };
  
//   const handleRowClick = (row) => {
//     const selectedRow = Array.isArray(row) ? row[0] : row;
//     if (selectedRow && selectedRow.id) {
//       Logger.debug('선택한 LUN ID:', selectedRow.id);
//       setLunId(selectedRow.id);
//     }
//   }; 
  // const [isFooterContentVisible, setIsFooterContentVisible] = useState(false);
  // const toggleFooterContent = () => { setIsFooterContentVisible((prev) => !prev) };

  return (
    <></>
    // <div className="storage-popup-iSCSI">
    //   <div className="section-table-outer">
    //   { !editMode ? ( // 편집일때
    //     <Tables
    //       isLoading={isIscsisLoading} isError={isIscsisError} isSuccess={isIscsisSuccess}
    //       columns={TableColumnsInfo.LUNS_TARGETS}
    //       data={
    //         domain?.hostStorageVo?.logicalUnits?.map((logicalUnit) => ({
    //           abled: logicalUnit.storageDomainId === "" ? "OK" : "NO",
    //           // status: logicalUnit.status,
    //           id: logicalUnit.id,
    //           size: logicalUnit.size ? `${(logicalUnit.size / (1024 ** 3)).toFixed(2)} GB` : "",
    //           paths: logicalUnit.paths || 0,
    //           vendorId: logicalUnit.vendorId || "",
    //           productId: logicalUnit.productId || "",
    //           serial: logicalUnit.serial || "",
    //           target: logicalUnit.target || "",
    //           address: logicalUnit.address || "",
    //           port: logicalUnit.port || "",
    //         })) || []
    //       }
    //       // shouldHighlight1stCol={true}
    //     />
    //   ): (
    //     <>
    //       <div className="target-search-outer">
    //         <label className="label-font-name">{Localization.kr.TARGET} {Localization.kr.SEARCH}</label>
    //         <div className="target-search-container">
              
    //           <div className="target-search-left">
    //             <LabelInput id="address" label="주소"
    //               value={formImportState.address} 
    //               onChange={handleInputChange('address')} 
    //             />
    //             <LabelInput label="포트" id="port" 
    //               value={formImportState.port} 
    //               onChange={handleInputChange('port')} 
    //             />
    //           <div className='target-btn'>
    //             <button className="search-button" onClick={handleSearchIscsi}>검색</button>
    //           </div>
    //         </div>

    //         <div className="vertical-divider"></div>

    //         <div className={`target-search-right ${formImportState.useChap ? 'with-background' : ''}`}>
    //           <div className="use-chap-arrow">
    //             <ToggleSwitchButton
    //               label="사용자 인증"
    //               checked={formImportState.useChap}
    //               onChange={(e) => {
    //                 const checked = e.target.checked;
    //                 setFormImportState((prev) => ({ ...prev, useChap: checked }));
    //                 setIsFooterContentVisible(checked);
    //               }}
    //               tType={"on"} fType={"off"}
    //             />
    //           </div>

    //           {isFooterContentVisible && (
    //             <div className="use-chap-content">
    //               <LabelInput id="chapName" label="CHAP 사용자 이름"
    //                 value={formImportState.chapName}
    //                 onChange={handleInputChange('chapName')}
    //                 disabled={!formImportState.useChap}
    //               />
    //               <LabelInput id="chapPassword" label="CHAP 암호"
    //                 type="password"
    //                 value={formImportState.chapPassword}
    //                 onChange={handleInputChange('chapPassword')}
    //                 disabled={!formImportState.useChap}
    //               />
    //               <div className="target-btn">
    //                 <button className="all-login-button" onClick={handleLoginIscsi}>로그인</button>
    //               </div>
    //             </div>
    //             )}
    //           </div>

    //         </div>

    //       </div>

    //       <Tables
    //         isLoading={isIscsisLoading} isError={isIscsisError} isSuccess={isIscsisSuccess}
    //         columns={TableColumnsInfo.LUNS_TARGETS}
    //         data={iscsis}
    //         onRowClick={ (row) => handleRowClick(row) }
    //         shouldHighlight1stCol={true}
    //       />
    //     </>
    //   )}
    //   </div>
    //   <div><span style={{ fontSize: '22px' }}>id: {lunId}</span></div>
    // </div>
  );
};

export default DomainIscsi;

import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import Tables from '../../../table/Tables';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import LabelInput from '../../../label/LabelInput';
import LabelCheckbox from '../../../label/LabelCheckbox';
import Localization from '../../../../utils/Localization';
import { RVI24, rvi24ChevronUp, rvi24DownArrow } from '../../../icons/RutilVmIcons';

const DomainIscsi = ({
  mode,
  domain,
  iscsis,
  iscsiSearchResults,
  setIscsiSearchResults,
  lunId,
  setLunId,
  hostVo,
  setHostVo,
  importIscsiFromHost,
  loginIscsiFromHost,
  formImportState,
  setFormImportState,
  refetchIscsis,
  isIscsisLoading,
  isIscsisError,
  isIscsisSuccess
}) => {

  useEffect(() => {
    console.log("도메인으로부터 받은 lunId:", lunId);
    console.log("도메인으로부터 받은 hostVo:", hostVo);
  }, [lunId, hostVo]);
  
  // iscsi 생성
  const handleSearchIscsi = () => {
    if (!hostVo.id) return toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
    if (!formImportState.address || !formImportState.port) return toast.error('주소와 포트를 입력해주세요.');   
    
    importIscsiFromHost({ hostId: hostVo?.id, iscsiData: formImportState }, {
      onSuccess: (data) => { setIscsiSearchResults(data) },
      onError: (error) => { toast.error('iSCSI 가져오기 실패:', error) }
    });
  };

  // iscsi 가져오기 시 로그인 처리
  const handleLoginIscsi = () => {
    if (!formImportState.target) return toast.error('항목을 선택해주세요.');

    loginIscsiFromHost({ hostId: hostVo?.id, iscsiData: formImportState }, {
      onSuccess: (data) => { setIscsiSearchResults(data) },
      onError: (error) => { toast.error('iSCSI 로그인 실패:', error) },
    });
  };

  const handleInputChange = (field) => (e) => {
    setFormImportState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputChangeCheck = (field) => (e) => {
    setFormImportState((prev) => ({ ...prev, [field]: e.target.checked }));
  };
  
  const handleRowClick = (row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;
    if (selectedRow && selectedRow.id) {
      console.log('선택한 LUN ID:', selectedRow.id);
      setLunId(selectedRow.id);
    }
  }; 
  const [isFooterContentVisible, setIsFooterContentVisible] = useState(false);
  const toggleFooterContent = () => {
    setIsFooterContentVisible((prev) => !prev);
  };

  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
      {isIscsisLoading ? (
          <div className="label-font-body">로딩 중...</div>
        ): mode === "edit" ? ( // 편집일때
          <Tables
            isLoading={isIscsisLoading} isError={isIscsisError} isSuccess={isIscsisSuccess}
            columns={TableColumnsInfo.LUNS_TARGETS}
            data={
              domain?.hostStorageVo?.logicalUnits?.map((logicalUnit) => ({
                abled: logicalUnit.storageDomainId === "" ? "OK" : "NO",
                // status: logicalUnit.status,
                id: logicalUnit.id,
                size: logicalUnit.size ? `${(logicalUnit.size / (1024 ** 3)).toFixed(2)} GB` : "",
                paths: logicalUnit.paths || 0,
                vendorId: logicalUnit.vendorId || "",
                productId: logicalUnit.productId || "",
                serial: logicalUnit.serial || "",
                target: logicalUnit.target || "",
                address: logicalUnit.address || "",
                port: logicalUnit.port || "",
              })) || []
            }
            // shouldHighlight1stCol={true}
          />
        ): (
          <>
            {/* {iscsiSearchResults?.length === 0 ? ( */}
              <div className="target-search-outer">
                <label className="label-font-name">{Localization.kr.TARGET} {Localization.kr.SEARCH}</label>

                <div className='target-address-port f-btw'>
                  <div className='w-full mr-2'>
                    <LabelInput label="주소" id="address" value={formImportState.address} onChange={handleInputChange('address')} />
                  </div>
                  <LabelInput label="포트" id="port" value={formImportState.port} onChange={handleInputChange('port')} />
                </div> 

                <div className='use-chap-outer'>
                  <div className='use-chap-arrow' onClick={toggleFooterContent}>
                    <RVI24 iconDef={isFooterContentVisible ? rvi24ChevronUp : rvi24DownArrow} fixedWidth />
                    <span>사용자 인증</span>
                  </div>
                  {isFooterContentVisible && (
                  <div className='use-chap-content'>
                    <LabelCheckbox label="사용자 인증" id="useChap" value={formImportState.useChap} onChange={handleInputChangeCheck('useChap')} />
                    <div>
                      <div className='target-address-port f-btw'>
                        <div className='w-full mr-2'>
                          <LabelInput
                            label="CHAP 사용자 이름"
                            id='chapName'
                            value={formImportState.chapName}
                            onChange={handleInputChange('chapName')}
                            disabled={!formImportState.useChap}
                          />
                        </div>
                        <LabelInput
                          type="password"
                          label="CHAP 암호"
                          id="chapPassword"
                          value={formImportState.chapPassword}
                          onChange={handleInputChange('chapPassword')}
                          disabled={!formImportState.useChap}
                        />
                      </div>
                      <div className='target-btn'>
                        <button className="all-login-button" onClick={handleLoginIscsi}>전체 로그인</button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>

              </div>

              <div className='target-btn'><button className="search-button" onClick={handleSearchIscsi}>검색</button></div>
              <div>
                <Tables
                  isLoading={isIscsisLoading} isError={isIscsisError} isSuccess={isIscsisSuccess}
                  columns={TableColumnsInfo.TARGETS_LUNS}
                  data={iscsiSearchResults}
                  onRowClick={ (row) => handleRowClick(row) }
                  shouldHighlight1stCol={true}
                />
              </div>
            {/* <Tables
              columns={TableColumnsInfo.LUNS_TARGETS}
              data={iscsis}
              onRowClick={handleRowClick}
              shouldHighlight1stCol={true}
            /> */}
          </>
      )}
      </div>
      <div> <span style={{ fontSize: '22px' }}>id: {lunId}</span> </div>
    </div>
  );
};

export default DomainIscsi;

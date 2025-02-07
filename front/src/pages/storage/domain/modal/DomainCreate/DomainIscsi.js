import React from 'react';
import Tables from '../../../../../components/table/Tables';
import TableColumnsInfo from '../../../../../components/table/TableColumnsInfo';
import toast from 'react-hot-toast';
import LabelInput from '../../../../../utils/LabelInput';
import LabelInputNum from '../../../../../utils/LabelInputNum';
import LabelCheckbox from '../../../../../utils/LabelCheckbox';

const DomainIscsi = ({
  editMode,
  domain,
  iscsis,
  iscsiSearchResults,
  setIscsiSearchResults,
  lunId,
  setLunId,
  hostVoId,
  hostVoName,
  setHostVoName,
  isIscsisLoading,
  importIscsiFromHost,
  loginIscsiFromHost,
  formImportState,
  setFormImportState,
}) => {
  console.log("lungId: " + lunId);
  console.log("hostVoId: " + hostVoId);
  console.log("hostVoName: " + hostVoName);

  // iscsi 생성
  const handleSearchIscsi = () => {
    if (!hostVoId) {
      toast.error('호스트를 선택해주세요.');
      return;
    }
    if (!formImportState.address || !formImportState.port) {
      toast.error('주소와 포트를 입력해주세요.');
      return;
    }
    importIscsiFromHost(
      { hostId: hostVoId, iscsiData: formImportState }, {
        onSuccess: (data) => {
          setIscsiSearchResults(data);
        },
        onError: (error) => {
          console.error('iSCSI 가져오기 실패:', error);
        },
      }
    );
  };

  // iscsi 가져오기 시 로그인 처리
  const handleLoginIscsi = () => {
    if (!formImportState.target) {
      toast.error('항목을 선택해주세요.');
      return;
    }
    loginIscsiFromHost(
      { hostId: hostVoId, iscsiData: formImportState }, {
        onSuccess: (data) => {
          setIscsiSearchResults(data);
        },
        onError: (error) => {
          console.error('iSCSI 로그인 실패:', error);
        },
      }
    );
  };

  const handleRowClick = (row) => {    
    // row가 배열인지 확인 후 첫 번째 요소 사용
    const selectedRow = Array.isArray(row) ? row[0] : row;
    if (selectedRow && selectedRow.id) {
      console.log('선택한 LUN ID:', selectedRow.id);
      setLunId(selectedRow.id);
    }
  }; 

  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
      {isIscsisLoading ? (
          <div className="label-font-body">로딩 중...</div>
        ) :  editMode ? ( // 편집일때
          <Tables
            columns={TableColumnsInfo.LUNS_TARGETS}
            data={domain?.hostStorageVo?.logicalUnits?.map((logicalUnit) => ({
              abled: logicalUnit.storageDomainId === "" ? "OK" : "NO",
              status: logicalUnit.status,
              id: logicalUnit.id,
              size: logicalUnit.size ? `${(logicalUnit.size / (1024 ** 3)).toFixed(2)} GB` : "",
              paths: logicalUnit.paths || 0,
              vendorId: logicalUnit.vendorId || "",
              productId: logicalUnit.productId || "",
              serial: logicalUnit.serial || "",
              target: logicalUnit.target || "",
              address: logicalUnit.address || "",
              port: logicalUnit.port || "",
            })) || []}
            // onRowClick={handleRowClick}
          />
        ) : (
          <>
            {iscsiSearchResults?.length === 0 ? (
              <div className="target-search-outer">
                <label className="label-font-name">대상 검색</label>
                <div className="target-search">
                  <LabelInput
                    label="주소"
                    id='address'
                    value={formImportState.address}
                    onChange={(e) => setFormImportState((prev) => ({ ...prev, address: e.target.value }))}
                  />
                  <LabelInputNum
                    label="포트"
                    id='port'
                    value={formImportState.port}
                    onChange={(e) => setFormImportState((prev) => ({ ...prev, port: e.target.value }))}
                  />

                  <LabelCheckbox
                    label="사용자 인증"
                    id='format'
                    value={formImportState.useChap}
                    onChange={(e) =>setFormImportState((prev) => ({ ...prev, useChap: e.target.checked }))}
                  />
                  <LabelInput
                    label="CHAP 사용자 이름"
                    id='chapName'
                    value={formImportState.chapName}
                    onChange={(e) => setFormImportState((prev) => ({ ...prev, chapName: e.target.value }))}
                    disabled={!formImportState.useChap}
                  />
                  <div>
                    <label>CHAP 암호</label>
                    <input
                      type="password"
                      value={formImportState.chapPassword}
                      onChange={(e) => setFormImportState((prev) => ({ ...prev, chapPassword: e.target.value }))}
                      disabled={!formImportState.useChap}
                    />
                  </div>
                </div>
                <button className="search-button" onClick={handleSearchIscsi}>검색</button>
              </div>
            ) : (
              <>
                <button className="search-button" onClick={handleLoginIscsi}>로그인</button>
                <Tables
                  columns={TableColumnsInfo.TARGETS_LUNS}
                  data={iscsiSearchResults}
                  onRowClick={handleRowClick}
                  shouldHighlight1stCol={true}
                />
              </>
            )}
            <Tables
              columns={TableColumnsInfo.LUNS_TARGETS}
              data={iscsis}
              onRowClick={handleRowClick}
              shouldHighlight1stCol={true}
            />
          </>
        )}
      </div>
      <div>
        <span style={{ fontSize: '22px' }}>id: {lunId}</span>
      </div>
    </div>
  );
};

export default DomainIscsi;

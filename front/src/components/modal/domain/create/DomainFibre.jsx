import React from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import toast from 'react-hot-toast';
import Localization from '../../../../utils/Localization';
import Logger from '../../../../utils/Logger';

const DomainFibre = ({ 
  mode, 
  domain,
  fibres,
  fcpSearchResults,
  setFcpSearchResults,
  lunId,
  setLunId,
  hostVo,
  setHostVo,
  importFcpFromHost,
  formImportState,
  setFormImportState,
  isFibresLoading,
  isFibresError,
  isFibresSuccess
}) => {  
  Logger.debug("DomainFibre ...")

  const handleSearchFcp = () => {
    if (!hostVo.id) 
      return toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
      
    importFcpFromHost({ hostId: hostVo.id }, {
      onSuccess: (data) => { setFcpSearchResults(data)},
      onError: (error) => { toast.error('fcp 가져오기 실패:', error)},
    });
  };

  const handleRowClick = (row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;
    if (selectedRow && selectedRow.id) {
      Logger.debug('선택한 LUN ID:', selectedRow.id);
      setLunId(selectedRow.id);
    }
  }; 

  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
        {isFibresLoading ? (
          <div className="label-font-body">로딩 중...</div>
        ) : mode === "edit" ? (
          <Tables
            isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}
            columns={TableColumnsInfo.FIBRE}
            data={
              domain?.hostStorageVo?.logicalUnits?.map((logicalUnit) => ({
                abled: logicalUnit.storageDomainId === "" ? "OK" : "NO",
                status: logicalUnit.status,
                id: logicalUnit.id,
                size: logicalUnit.size ? `${(logicalUnit.size / (1024 ** 3)).toFixed(2)} GB` : "N/A",
                paths: logicalUnit.paths || 0,
                vendorId: logicalUnit.vendorId || "N/A",
                productId: logicalUnit.productId || "N/A",
                serial: logicalUnit.serial || "N/A",
                target: logicalUnit.target || "N/A",
                address: logicalUnit.address || "N/A",
                port: logicalUnit.port || "N/A",
              })) || []
            }
            onRowClick={handleRowClick}
          />
        ): mode === "import" ? (
          <>
            <button className='search-button' onClick={handleSearchFcp}>검색</button>
            {fcpSearchResults?.length > 0 && (
              <Tables
                isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}
                columns={TableColumnsInfo.FIBRE}
                data={fcpSearchResults}
                onRowClick={handleRowClick}
              />
            )}
          </>
        ): (
          <Tables
            isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}
            columns={TableColumnsInfo.FIBRE}
            data={fibres}
            onRowClick={handleRowClick}
            shouldHighlight1stCol={true}
          />
        )} 
        <div> <span style={{ fontSize: '22px' }}>id: {lunId}</span> </div>
      </div>
    </div>
  )
};

export default DomainFibre;
import React from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import toast from 'react-hot-toast';
import Localization from '../../../../utils/Localization';

const DomainFibre = ({ 
  mode, 
  domain,
  fibres,
  fcpSearchResults,
  setFcpSearchResults,
  lunId,
  setLunId,
  hostVoId,
  importFcpFromHost,
  isFibresLoading, 
  handleRowClick,
  formImportState,
  setFormImportState
}) => {  

  const handleSearchFcp = () => {
    if (!hostVoId) 
      return toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
      
    importFcpFromHost({ hostId: hostVoId }, {
      onSuccess: (data) => { setFcpSearchResults(data)},
      onError: (error) => { toast.error('fcp 가져오기 실패:', error)},
    });
  };

  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
        {isFibresLoading ? (
          <div className="label-font-body">로딩 중...</div>
        ) : mode === "edit" ? (
          <Tables
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
            // shouldHighlight1stCol={true}
          />
        ): mode === "import" ? (
          <>
            <button className='search-button' onClick={handleSearchFcp}>검색</button>
            {fcpSearchResults?.length > 0 && (
              <Tables
                columns={TableColumnsInfo.FIBRE_IMPORT}
                data={fcpSearchResults}
                onRowClick={handleRowClick}
                // shouldHighlight1stCol={true}
              />
            )}
          </>
        ): (
          <Tables
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
import React, { useCallback } from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import toast from 'react-hot-toast';
import Localization from '../../../../utils/Localization';
import Logger from '../../../../utils/Logger';
import { checkZeroSizeToGiB } from '../../../../util';

const DomainFibre = ({ 
  editMode,
  fcResults, setFcResults,
  lunId, setLunId,
  hostVo,
  formSearchState, setFormSearchState,
  searchFcAPI,
  refetchFibres, isFibresLoading, isFibresError, isFibresSuccess
}) => {  
  Logger.debug("DomainFibre ...")

  const transFibreData = fcResults.map((f) => {
    const fc = f?.logicalUnits?.[0];
    if (!fc) return null;
  
    return {
      id: fc.id,
      status: fc.status,
      size: checkZeroSizeToGiB(fc.size),
      paths: fc.paths,
      vendorId: fc.vendorId,
      productId: fc.productId,
      serial: fc.serial,
      abled: fc.storageDomainId === "" ? "OK" : "NO",
    };
  }).filter(Boolean);
  
  // DomainCheckModal

  const handleSearchFc= () => {
    if (!hostVo.id) return toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
    // if (!formImportState.address) return toast.error('주소를 입력해주세요.');   
    // if (!formImportState.port) return toast.error('포트를 입력해주세요.');   

    isFibresLoading(true);

    searchFcAPI(
      { hostId: hostVo?.id, iscsiData: formSearchState },
      { 
        onSuccess: (data) => {
          setFcResults(data);
          isFibresLoading(false);
          isFibresSuccess(true);
          isFibresError(false);
        },
        onError: (error) => {
          toast.error("fc 가져오기 실패");
          isFibresLoading(false);
          isFibresSuccess(false);
          isFibresError(true);
        },
      }
    );
  };

  const handleRowClick = useCallback((row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;
    if (selectedRow && selectedRow.id) {
      Logger.debug('선택한 LUN ID:', selectedRow.id);
      setLunId(selectedRow.id);
    }
  }, []);

  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
        {/* 편집 */}
        {editMode ? (
          <Tables columns={TableColumnsInfo.FIBRE}
            data={transFibreData}
            // onRowClick={handleRowClick}
            isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}            
          />
        ): (
          <Tables columns={TableColumnsInfo.FIBRE}            
            data={transFibreData} 
            onRowClick={handleRowClick}
            isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}  
          />
        )} 
        <div><span style={{ fontSize: '22px' }}>id: {lunId}</span> </div>
      </div>
    </div>
  )
};

export default DomainFibre;
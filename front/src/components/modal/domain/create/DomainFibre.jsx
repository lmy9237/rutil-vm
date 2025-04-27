import React, { useCallback } from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import toast from 'react-hot-toast';
import Localization from '../../../../utils/Localization';
import Logger from '../../../../utils/Logger';
import { checkZeroSizeToGiB } from '../../../../util';

const DomainFibre = ({ 
  editMode,
  fibres,
  lunId, setLunId,
  isFibresLoading, isFibresError, isFibresSuccess
}) => {  
  Logger.debug("DomainFibre ...")

  const transFibreData = (isFibresLoading ? [] : fibres)?.map((f) => {
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

  const handleRowClick = useCallback((row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;
    
    // ✅ serial 이 없거나 빈 문자열이면 클릭 막기
    // if (!selectedRow?.serial || selectedRow.serial.trim() === "") {
    if (!selectedRow?.serial) {
      toast.error("선택할 수 없는 LUN입니다."); 
      return;
    }
  
    if (selectedRow && selectedRow.id) {
      Logger.debug('선택한 LUN ID:', selectedRow.id);
      setLunId(selectedRow.id);
    }
  }, [setLunId]);
  

  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
        {/* 편집 */}
        {/* {editMode ? (
          <Tables columns={TableColumnsInfo.FIBRE}
            data={transFibreData}
            // onRowClick={handleRowClick}
            isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}            
          />
        ): ( */}
          <Tables columns={TableColumnsInfo.FIBRE}            
            data={transFibreData} 
            onRowClick={handleRowClick}
            isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}  
          />
        {/* )}  */}
        <div><span style={{ fontSize: '22px' }}>id: {lunId}</span> </div>
      </div>
    </div>
  )
};

export default DomainFibre;
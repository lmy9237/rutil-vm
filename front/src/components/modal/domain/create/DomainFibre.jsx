import React, { useCallback, useMemo } from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import toast from 'react-hot-toast';
import Logger from '../../../../utils/Logger';
import { checkZeroSizeToGiB } from '../../../../util';
import LabelCheckbox from '../../../label/LabelCheckbox';

const DomainFibre = ({ 
  editMode, domain,
  fibres,
  lunId, setLunId,
  isFibresLoading, isFibresError, isFibresSuccess
}) => {  
  Logger.debug("DomainFibre ...")

  const transFibreData = (isFibresLoading ? [] : fibres)?.map((f) => {
    const fc = f?.logicalUnitVos[0];
    if (!fc) return null;
  
    return {
      id: fc.id,
      able: 
        // <LabelCheckbox
        //   // checked={formState.wipeAfterDelete}
        //   // onChange={handleInputCheck(setFormState, "wipeAfterDelete")}
        // />
        (fc.serial && fc.storageDomainId === "" && fc.status !== "USED")
          ? "OK" 
          : (fc.serial && fc.storageDomainId === "" && fc.status === "USED") 
            ? "OVERWRITE" 
            : "NO"
      ,
      status: fc.status,
      size: checkZeroSizeToGiB(fc.size),
      paths: fc.paths,
      vendorId: fc.vendorId,
      productId: fc.productId,
      serial: fc.serial,
      storageDomainId: fc.storageDomainId
    };
  }).filter(Boolean);
  
  const handleRowClick = useCallback((row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;

    // if (!selectedRow?.serial && selectedRow?.storageDomainId !== "") {
    //   toast.error("선택할 수 없는 LUN입니다.");
    //   setLunId("");
    //   return;
    // }
    // if (selectedRow?.storageDomainId !== "") {
    //   toast.error("이미 사용 중인 LUN입니다.");
    //   setLunId(""); 
    //   return;
    // }
    setLunId(selectedRow.id); // 명확한 선택 처리
  }, [setLunId]);
  
  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
        <br/>
        <Tables columns={TableColumnsInfo.FIBRE}            
          data={transFibreData} 
          onRowClick={editMode ? "" : handleRowClick }
          isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}  
        />
        <div><span style={{ fontSize: '22px' }}>id: {lunId}</span> </div>
      </div>
    </div>
  )
};

export default DomainFibre;
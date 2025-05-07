import React, { useMemo } from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import Logger from '../../../../utils/Logger';
import { checkZeroSizeToGiB } from '../../../../util';
import LabelCheckbox from '../../../label/LabelCheckbox';

const DomainImportFibre = ({ 
  fibres,
  lunId, setLunId,
  isFibresLoading, isFibresError, isFibresSuccess
}) => {  
  Logger.debug("DomainImportFibre ...")

  const transFibreData = useMemo(() => {
    if (isFibresLoading || !fibres) return [];

    return fibres.map((f) => {
      const fc = f?.logicalUnitVos[0];
      if (!fc) return null;

      // fc가 켜져있고 스토리지도메인에 연결되지 않았을때
      const isSelectable = fc.serial && fc.storageDomainId === "";
      const isUsed = fc.status === "USED";

      return {
        id: fc.id,
        able: 
          <LabelCheckbox
            checked={lunId === fc.id}
            onChange={() => setLunId(prev => prev === fc.id ? "" : fc.id)}
          />
        ,
        status: fc.status,
        check: isSelectable ? (isUsed ? "OVERWRITE" : "OK") : "NO",
        size: checkZeroSizeToGiB(fc.size),
        paths: fc.paths,
        vendorId: fc.vendorId,
        productId: fc.productId,
        serial: fc.serial,
        storageDomainId: fc.storageDomainId,
      };
    }).filter(Boolean);
  }, [fibres, isFibresLoading, lunId, setLunId]);
  
  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
        <br/>
        <Tables
          columns={TableColumnsInfo.IMPORT_FIBRE}
          data={transFibreData}
          isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}
        />
        <br/>
        <div><span style={{ fontSize: '22px' }}>id: {lunId}</span> </div>
      </div>
    </div>
  )
};

export default DomainImportFibre;
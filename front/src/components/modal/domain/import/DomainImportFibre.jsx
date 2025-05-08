import React, { useMemo } from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import Logger from '../../../../utils/Logger';
import LabelCheckbox from '../../../label/LabelCheckbox';

const DomainImportFibre = ({ 
  fibres,
  id, setId,
  // vgId, setVgId,
  isFibresLoading, isFibresError, isFibresSuccess
}) => {  
  Logger.debug("DomainImportFibre ...")

  const transFibreData = useMemo(() => {
    if (isFibresLoading || !fibres) return [];

    return fibres.map((f) => {
      if (!f) return null;

      return {
        able: 
          <LabelCheckbox
            checked={id === f.id}
            onChange={() => 
                setId(prev => prev === f.id ? "" : f.id)
                // setVgId(prev => prev === f?.storageVo.volumeGroupVo?.id ? "" : f?.storageVo.volumeGroupVo?.id)
            }
          />
        ,
        name: f.name,        
        id: f?.id,
      };
    }).filter(Boolean);
  }, [fibres, isFibresLoading, id, setId]);
  
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
        <div><span style={{ fontSize: '22px' }}>id: {id} <br/> </span> </div>
      </div>
    </div>
  )
};

export default DomainImportFibre;
import React, { useMemo } from 'react';
import useGlobal from "../../../../hooks/useGlobal";
import TableColumnsInfo from "../../../table/TableColumnsInfo";
import SelectedIdView from "../../../common/SelectedIdView";
import Tables from '../../../table/Tables';
import LabelCheckbox from '../../../label/LabelCheckbox';
import Logger from '../../../../utils/Logger';

/**
 * @name DomainImportFibre
 * @description 가져오기를 위한 Fibre Channel 스토리지 도메인 내 LUN 목록 출력
 * 
 * @param {boolean} editMode 편집여부
 * @returns {JSX.Element} DomainImportFibre
 * 
 * @see DomainImportModal
 */
const DomainImportFibre = ({ 
  fibres,
  id, setId,
  isFibresLoading, isFibresError, isFibresSuccess
}) => {
  const {
    hostsSelected, 
    lunsSelected, setLunsSelected
  } = useGlobal()

  const transFibreData = useMemo(() => {
    if (isFibresLoading || !fibres) return [];

    return fibres.map((f) => {
      if (!f) return null;

      return {
        able: 
          <LabelCheckbox checked={id === f.id}
            onChange={(checked) => 
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
          onRowClick={(selectedRows) => setLunsSelected(selectedRows)}
          isLoading={isFibresLoading} isError={isFibresError} isSuccess={isFibresSuccess}
        />
        <SelectedIdView items={lunsSelected} />
      </div>
    </div>
  )
};

export default DomainImportFibre;
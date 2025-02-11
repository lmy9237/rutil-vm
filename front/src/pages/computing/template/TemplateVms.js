import React from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useAllVmsFromTemplate } from '../../../api/RQHook';
import TablesOuter from '../../../components/table/TablesOuter';
import { renderVmStatusIcon } from '../../../components/Icon';

const TemplateVms = ({ templateId }) => {
  const {
    data: vms = [], isLoading: isVmsLoading
  } = useAllVmsFromTemplate(templateId, (e) => ({ 
    ...e,
  icon: renderVmStatusIcon(e.status),
  hostVo:e?.hostVo.name
  }));

  return (
    <>
      <TablesOuter
        columns={TableColumnsInfo.VMS_FROM_TEMPLATE} 
        data={vms} 
        clickableColumnIndex={[1]} 
      />
    </>
  );
};

export default TemplateVms;

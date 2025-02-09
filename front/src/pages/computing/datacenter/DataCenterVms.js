import React from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useVMsFromDataCenter } from '../../../api/RQHook';
import VmDupl from '../../computing/vm/VmDupl';

const DataCenterVms = ({datacenterId}) => {
  const {
    data: vms = [], isLoading: isVmsLoading
  } = useVMsFromDataCenter(datacenterId, (e) => ({ ...e }));
  
  return (
    <>
      <VmDupl
        vms={vms}
        columns={TableColumnsInfo.VMS}
      />
    </>
  );
};

export default DataCenterVms;
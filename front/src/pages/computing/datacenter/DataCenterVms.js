import React from 'react';
import VmDupl from '../../../components/dupl/VmDupl';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useVMsFromDataCenter } from '../../../api/RQHook';

const DataCenterVms = ({ datacenterId }) => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useVMsFromDataCenter(datacenterId, (e) => ({ ...e }));
  
  return (
    <>
      <VmDupl
        isLoading={isVmsLoading}
        isError={isVmsError}
        isSuccess={isVmsSuccess}
        vms={vms}
        columns={TableColumnsInfo.VMS}
      />
    </>
  );
};

export default DataCenterVms;
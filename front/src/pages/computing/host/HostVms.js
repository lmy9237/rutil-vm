import React from 'react';
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useVmFromHost } from "../../../api/RQHook";
import VmDupl from '../../../components/dupl/VmDupl';

const HostVms = ({ hostId }) => {
  const { 
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useVmFromHost(hostId, (e) => ({ ...e,}));

  return (
    <>
      <VmDupl
        isLoading={isVmsLoading}
        isError={isVmsError}
        isSuccess={isVmsSuccess}
        vms={vms}
        columns={TableColumnsInfo.VMS_FROM_HOST}
      />
    </>
  );
};
  
export default HostVms;
import React from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { useAllVMs } from '../../api/RQHook';
import VmDupl from '../../pages/computing/vm/VmDupl';

const Vms = () => {
  const { 
    data: vms = [] 
  } = useAllVMs((e) => ({ ...e }));

  return (
    <>
      <VmDupl
        columns={TableColumnsInfo.VMS}
        vms={vms}
      />
    </>
  );
};

export default Vms;

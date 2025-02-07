import React  from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { useAllHosts } from '../../api/RQHook';
import HostDupl from '../computing/host/HostDupl';

const Hosts = () => {
  const {
    data: hosts = [],
  } = useAllHosts((e) => ({ ...e }));

  return (
    <>
      <HostDupl
        columns={TableColumnsInfo.HOSTS}
        hosts={hosts}        
      />
    </>
  );
};

export default Hosts;
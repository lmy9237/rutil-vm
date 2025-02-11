import React  from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import HostDupl from '../../components/dupl/HostDupl';
import { useAllHosts } from '../../api/RQHook';

const Hosts = () => {
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
  } = useAllHosts((e) => ({ ...e }));

  return (
    <>
      <HostDupl hosts={hosts} columns={TableColumnsInfo.HOSTS}
        isLoading={isHostsLoading}
        isError={isHostsError}
        isSuccess={isHostsSuccess}
      />
    </>
  );
};

export default Hosts;
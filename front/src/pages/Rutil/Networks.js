import React from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { useAllNetworks } from '../../api/RQHook';
import NetworkDupl from '../../pages/network/network/NetworkDupl';

const Networks = () => {
  const { 
    data: networks = []
  } = useAllNetworks((e) => ({...e,}));

  return (
    <>
      <NetworkDupl
        columns={TableColumnsInfo.NETWORKS}
        networks={networks}
      />
    </> 
  );
};

export default Networks;

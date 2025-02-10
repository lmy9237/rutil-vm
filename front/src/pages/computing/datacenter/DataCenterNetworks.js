import React from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useNetworksFromDataCenter } from '../../../api/RQHook';
import NetworkDupl from '../../network/network/NetworkDupl';

const DataCenterNetworks = ({ datacenterId }) => {
  const {
    data: networks = [], isLoading: isNetworksLoading,
  } = useNetworksFromDataCenter(datacenterId, (e) => ({ ...e }));

  return (
    <>
      <NetworkDupl
        networks={networks}
        columns={TableColumnsInfo.NETWORK_FROM_DATACENTER}
      />
    </>
  );
};

export default DataCenterNetworks;
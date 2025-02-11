import React from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import NetworkDupl from '../../../components/dupl/NetworkDupl';
import { useNetworksFromDataCenter } from '../../../api/RQHook';

/**
 * @name DataCenterNetworks
 * @description ...
 * 
 * @param {string} clusterId
 *
 * @returns
 */
const DataCenterNetworks = ({ datacenterId }) => {
  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
  } = useNetworksFromDataCenter(datacenterId, (e) => ({ ...e }));

  return (
    <>
      <NetworkDupl networks={networks} columns={TableColumnsInfo.NETWORK_FROM_DATACENTER}
        isLoading={isNetworksLoading}
        isError={isNetworksError}
        isSuccess={isNetworksSuccess}
      />
    </>
  );
};

export default DataCenterNetworks;
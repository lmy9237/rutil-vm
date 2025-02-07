import React from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useNetworkFromCluster } from '../../../api/RQHook'
import NetworkDupl from '../../network/network/NetworkDupl';

const ClusterNetworks = ({ clusterId }) => {
  const {
      data: networks = [], isLoading: isNetworksLoading,
    } = useNetworkFromCluster(clusterId, (e) => ({ ...e }));
  
    return (
      <>
        <NetworkDupl
          networks={networks}
          columns={TableColumnsInfo.NETWORK_FROM_CLUSTER}
        />
      </>
    );
  };

export default ClusterNetworks;
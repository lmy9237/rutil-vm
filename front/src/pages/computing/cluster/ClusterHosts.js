import React from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import HostDupl from '../../computing/host/HostDupl';
import { useHostFromCluster } from "../../../api/RQHook";

const ClusterHosts = ({ clusterId }) => {
  const { 
    data: hosts = [], isLoading: isHostsLoading
  } = useHostFromCluster(clusterId, (e) => ({ ...e }));

  return (
    <>
      <HostDupl
        hosts={hosts}
        columns={TableColumnsInfo.HOSTS}
        clusterId={clusterId}
      />
    </>
  );
};
  
export default ClusterHosts;

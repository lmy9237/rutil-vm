import React from 'react';
import { useAllClusters } from '../../api/RQHook';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import ClusterDupl from '../../pages/computing/cluster/ClusterDupl';

const Clusters = () => {
  const { 
    data: clusters = [], 
  } = useAllClusters((e) => ({ ...e }));

  return (
    <>
      <ClusterDupl
        columns={TableColumnsInfo.CLUSTERS}
        clusters={clusters}
      />
    </>
  );
};

export default Clusters;

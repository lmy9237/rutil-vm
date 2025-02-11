import React from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import ClusterDupl from '../../components/dupl/ClusterDupl';
import { useAllClusters } from '../../api/RQHook';

const Clusters = () => {
  const { 
    data: clusters = [], 
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
  } = useAllClusters((e) => ({ ...e }));

  return (
    <>
      <ClusterDupl 
        clusters={clusters} columns={TableColumnsInfo.CLUSTERS}
        isLoading={isClustersLoading}
        isError={isClustersError}
        isSuccess={isClustersSuccess}
      />
    </>
  );
};

export default Clusters;

import React from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import ClusterDupl from "../../components/dupl/ClusterDupl";
import { useAllClusters } from "../../api/RQHook";

/**
 * @name Clusters
 * @description 클러스터 전체
 *
 * @returns {JSX.Element} Clusters
 */
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
        clusters={clusters}
        columns={TableColumnsInfo.CLUSTERS}
        isLoading={isClustersLoading}
        isError={isClustersError}
        isSuccess={isClustersSuccess}
      />
    </>
  );
};

export default Clusters;

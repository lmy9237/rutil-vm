import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import ClusterDupl from "../../../components/dupl/ClusterDupl";
import { useClustersFromDataCenter } from "../../../api/RQHook";

/**
 * @name DataCenterClusters
 * @description 데이터센터에 종속 된 클러스터 목록
 * (/computing/datacenters/<datacenterId>/clusters)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterClusters = ({
  datacenterId
}) => {
  const {
    data: clusters = [],
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
    refetch: refetchClusters,
  } = useClustersFromDataCenter(datacenterId, (e) => ({...e,}));

  return (
    <>
      <ClusterDupl columns={TableColumnsInfo.CLUSTERS_FROM_DATACENTER}
        clusters={clusters}
        datacenterId={datacenterId}
        refetch={refetchClusters}
        isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
      />
    </>
  );
};

export default DataCenterClusters;

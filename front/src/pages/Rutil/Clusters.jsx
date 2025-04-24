import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import ClusterDupl from "../../components/dupl/ClusterDupl";
import { useAllClusters } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name Clusters
 * @description 클러스터 전체
 *
 * @returns {JSX.Element} Clusters
 */
const Clusters = () => {
  const { datacentersSelected, clustersSelected, setClustersSelected } = useGlobal()

  const {
    data: clusters = [],
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
    refetch: refetchClusters,
  } = useAllClusters((e) => ({ ...e }));

  useEffect(() => {
    Logger.debug("DataCenters > useEffect ...");
    return () => {
      Logger.debug("DataCenters > useEffect ... CLEANING UP");
      setClustersSelected([])
    }
  }, [])

  Logger.debug(`Clusters ... `)
  return (
    <>
      <ClusterDupl columns={TableColumnsInfo.CLUSTERS}
        clusters={clusters}
        refetch={refetchClusters}
        isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
      />
      <span>{clustersSelected[0]?.name}</span><br/>
      <span>{datacentersSelected[0]?.name}</span>
    </>
  );
};

export default Clusters;

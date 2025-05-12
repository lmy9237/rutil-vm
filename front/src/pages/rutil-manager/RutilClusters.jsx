import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import ClusterDupl from "../../components/dupl/ClusterDupl";
import { useAllClusters } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name RutilClusters
 * @description 클러스터 전체
 * 경로: <메뉴>/rutil-manager/clusters
 *
 * @returns {JSX.Element} RutilClusters
 */
const RutilClusters = () => {
  const { setClustersSelected } = useGlobal()

  const {
    data: clusters = [],
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
    refetch: refetchClusters,
  } = useAllClusters((e) => ({ ...e }));

  useEffect(() => {
    return () => {
      Logger.debug("RutilClusters > useEffect ... CLEANING UP");
      setClustersSelected([])
    }
  }, [])

  return (
    <ClusterDupl columns={TableColumnsInfo.CLUSTERS}
      clusters={clusters}
      refetch={refetchClusters}
      isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
    />
  );
};

export default RutilClusters;

import React from "react";
import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import ClusterDupl from "../../../components/dupl/ClusterDupl";
import { useClustersFromDataCenter } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

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
    datacentersSelected
  } = useGlobal()

  const {
    data: clusters = [],
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
    refetch: refetchClusters,
    isRefetching: isClustersRefetching,
  } = useClustersFromDataCenter(datacenterId, (e) => ({...e,}));

  return (
    <>
      <ClusterDupl columns={TableColumnsInfo.CLUSTERS_FROM_DATACENTER}
        clusters={clusters}
        refetch={refetchClusters} isRefetching={isClustersRefetching}
        isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
      />
      <OVirtWebAdminHyperlink 
        name={`${Localization.kr.COMPUTING}>${Localization.kr.DATA_CENTER}>${datacentersSelected[0]?.name}`} 
        path={`dataCenters-clusters;name=${datacentersSelected[0]?.name}`} 
      />
    </>
  );
};

export default DataCenterClusters;

import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import NetworkDupl from "../../../components/dupl/NetworkDupl";
import { useNetworkFromCluster } from "../../../api/RQHook";

/**
 * @name ClusterNetworks
 * @description 클러스터에 종속 된 논리 네트워크 목록
 * (/computing/clusters/<clusterId>/networks)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterNetworks = ({ clusterId }) => {
  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
  } = useNetworkFromCluster(clusterId, (e) => ({ ...e }));

  console.log("...");
  return (
    <>
      <NetworkDupl
        isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
        columns={TableColumnsInfo.NETWORK_FROM_CLUSTER}
        networks={networks}
      />
    </>
  );
};

export default ClusterNetworks;

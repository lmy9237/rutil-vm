import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import NetworkDupl from "../../../components/dupl/NetworkDupl";
import { useNetworkFromCluster } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name ClusterNetworks
 * @description 클러스터에 종속 된 논리 네트워크 목록
 * (/computing/clusters/<clusterId>/networks)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterNetworks = ({
  clusterId
}) => {
  const { clustersSelected } = useGlobal()
  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
    refetch: refetchNetworks,
    isRefetching: isNetworksRefetching,
  } = useNetworkFromCluster(clusterId, (e) => ({ ...e }));

  return (
    <>
      <NetworkDupl columns={TableColumnsInfo.NETWORK_FROM_CLUSTER}
        networks={networks}
        refetch={refetchNetworks} isRefetching={isNetworksRefetching}
        isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.CLUSTER}>${clustersSelected[0]?.name}`}
        path={`clusters-logical_networks;name=${clustersSelected[0]?.name}`} 
      />
    </>
  );
};

export default ClusterNetworks;

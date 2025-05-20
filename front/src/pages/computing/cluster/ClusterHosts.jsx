import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HostDupl from "../../../components/dupl/HostDupl";
import { useHostsFromCluster } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name ClusterHosts
 * @description 클러스터에 종속 된 호스트 목록
 * (/computing/clusters/<clusterId>/hosts)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterHosts = ({
  clusterId
}) => {
  const { clustersSelected } = useGlobal()
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
    refetch: refetchHosts,
    isRefetching: isHostsRefetching,
  } = useHostsFromCluster(clusterId, (e) => ({ ...e }));

  return (
    <>
      <HostDupl columns={TableColumnsInfo.HOSTS}
        hosts={hosts}
        clusterId={clusterId}
        refetch={refetchHosts} isRefetching={isHostsRefetching}
        isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.CLUSTER}>${clustersSelected[0]?.name}`}
        path={`clusters-hosts;name=${clustersSelected[0]?.name}`}
      />
    </>
  );
};

export default ClusterHosts;

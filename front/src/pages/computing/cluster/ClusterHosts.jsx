import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HostDupl from "../../../components/dupl/HostDupl";
import { useHostsFromCluster } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name ClusterHosts
 * @description 클러스터에 종속 된 호스트 목록
 * (/computing/clusters/<clusterId>/hosts)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterHosts = ({ clusterId }) => {
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
    refetch: refetchHosts,
  } = useHostsFromCluster(clusterId, (e) => ({ ...e }));

  return (
    <>
      <HostDupl columns={TableColumnsInfo.HOSTS}
        hosts={hosts}
        clusterId={clusterId}
        refetch={refetchHosts}
        isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
      />
    </>
  );
};

export default ClusterHosts;

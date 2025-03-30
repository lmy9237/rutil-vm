import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HostDupl from "../../../components/dupl/HostDupl";
import { useHostFromCluster } from "../../../api/RQHook";
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
  } = useHostFromCluster(clusterId, (e) => ({ ...e }));

  Logger.debug("...");
  return (
    <>
      <HostDupl
        isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
        columns={TableColumnsInfo.HOSTS}
        hosts={hosts}
        clusterId={clusterId}
      />
    </>
  );
};

export default ClusterHosts;

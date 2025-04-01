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
  } = useHostsFromCluster(clusterId, (e) => ({ ...e }));

  Logger.debug("...");
  return (
    <>
      <HostDupl
        columns={TableColumnsInfo.HOSTS}
        hosts={hosts}
        clusterId={clusterId}
        isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
      />
    </>
  );
};

export default ClusterHosts;

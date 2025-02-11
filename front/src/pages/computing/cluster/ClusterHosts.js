import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import HostDupl from '../../../components/dupl/HostDupl';
import { useHostFromCluster } from "../../../api/RQHook";

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
  } = useHostFromCluster(clusterId, (e) => ({ 
    ...e
  }));

  console.log("...")
  return (
    <>
      <HostDupl hosts={hosts} columns={TableColumnsInfo.HOSTS}
        isLoading={isHostsLoading}
        isError={isHostsError}
        isSuccess={isHostsSuccess}
        clusterId={clusterId}
      />
    </>
  );
};
  
export default ClusterHosts;

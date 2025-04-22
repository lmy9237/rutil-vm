import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmDupl from "../../../components/dupl/VmDupl";
import { useVMsFromCluster } from "../../../api/RQHook";

/**
 * @name ClusterVms
 * @description 클러스터에 종속 된 가상머신 목록
 * (/computing/clusters/<clusterId>/vms)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterVms = ({ clusterId }) => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
  } = useVMsFromCluster(clusterId, (e) => ({ ...e }));

  return (
    <VmDupl columns={TableColumnsInfo.VMS}
      vms={vms}
      refetch={refetchVms}
      isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
    />
  );
};

export default ClusterVms;

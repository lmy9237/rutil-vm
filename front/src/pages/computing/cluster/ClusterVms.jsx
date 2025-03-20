import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmDupl from "../../../components/dupl/VmDupl";
import { useVMFromCluster } from "../../../api/RQHook";

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
  } = useVMFromCluster(clusterId, (e) => ({ ...e }));

  console.log("...");
  return (
    <>
      <VmDupl
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.VMS}
        vms={vms}
      />
    </>
  );
};

export default ClusterVms;

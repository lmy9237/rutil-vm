import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmDupl from "../../../components/dupl/VmDupl";
import { useVMsFromCluster } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name ClusterVms
 * @description 클러스터에 종속 된 가상머신 목록
 * (/computing/clusters/<clusterId>/vms)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterVms = ({
  clusterId
}) => {
  const { clustersSelected } = useGlobal()
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
    isRefetching: isVmsRefetching,
  } = useVMsFromCluster(clusterId, (e) => ({ ...e }));

  return (
    <>
      <VmDupl columns={TableColumnsInfo.VMS}
        vms={vms}
        refetch={refetchVms} isRefetching={isVmsRefetching}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.CLUSTER}>${clustersSelected[0]?.name}`}
        path={`clusters-virtual_machines;name=${clustersSelected[0]?.name}`} 
      />
    </>
  );
};

export default ClusterVms;

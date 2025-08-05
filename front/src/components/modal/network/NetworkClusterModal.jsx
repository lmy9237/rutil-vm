import { Checkbox }                    from "@/components/ui/checkbox"; 
import BaseModal                       from "../BaseModal";
import TablesOuter                     from "@/components/table/TablesOuter";
import TableColumnsInfo                from "@/components/table/TableColumnsInfo";
import {
  RVI16,
  clusterStatus2Icon, 
  networkUsage2Icons, 
  rvi16Install,
  rvi16VirtualMachine
} from "@/components/icons/RutilVmIcons";
import {
  useAllClustersFromNetwork
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const NetworkClusterModal = ({ 
  isOpen,
  onClose,
  networkId
}) => {
  const {
    data: clusters = [],
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
    refetch: refetchClusters,
    isRefetching: isClustersRefetching,
  } = useAllClustersFromNetwork(networkId);

  // 데이터 변환
  const transformedData = [...clusters].map((n) => ({
    ...n,
    name: (n?.clusterVo?.name || n?.name),
    status: clusterStatus2Icon(n?.status, n?.clusterVo?.connected || false),
    allAssigned: <Checkbox checked={n?.clusterVo?.connected || false} disabled />,
    allRequired: <Checkbox checked={n?.required} disabled />,
    vmNetMgmt: n?.usage?.vm ? <RVI16 iconDef={rvi16VirtualMachine()} /> : null,
    networkOutput: <Checkbox checked={n?.usage?.display} disabled />,
    migrationNetwork: <Checkbox checked={n?.usage?.migration} disabled />,
    glusterNetwork: <Checkbox checked={n?.usage?.gluster} disabled />,
    defaultRouting: <Checkbox checked={n?.usage?.defaultRoute} disabled />,
    networkRole: (networkUsage2Icons(n?.usage, n?.roleInKr || "")),
  }));
  

  return (
    <BaseModal targetName={Localization.kr.NETWORK} submitTitle={Localization.kr.MANAGEMENT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={() => {}}
      contentStyle={{ width: "1000px" }}
    >
      <div className="py-3">
        <TablesOuter target={"cluster"}
          columns={TableColumnsInfo.CLUSTERS_POPUP}
          data={transformedData}
          onRowClick={(selectedRows) => {}}
          isLoading={isClustersLoading} isRefetching={isClustersRefetching} isError={isClustersError} isSuccess={isClustersSuccess}
        />
      </div>
    </BaseModal>
  );
};

export default NetworkClusterModal;

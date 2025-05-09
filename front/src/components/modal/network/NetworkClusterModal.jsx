import BaseModal from "../BaseModal";
import TablesOuter from '../../table/TablesOuter';
import TableColumnsInfo from '../../table/TableColumnsInfo';
import { useAllClustersFromNetwork } from '../../../api/RQHook';
import Localization from "../../../utils/Localization";
import { clusterStatus2Icon, RVI16, rvi16Install, rvi16VirtualMachine } from "../../icons/RutilVmIcons";

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
  } = useAllClustersFromNetwork(networkId);

  // 데이터 변환
  const transformedData = [...clusters].map((c) => ({
    name: c?.name,
    connect: <input type="checkbox" checked={c?.connected} disabled />,
    status: clusterStatus2Icon(c?.networkVo?.status, c?.connected),
    required: <input type="checkbox" checked={c?.networkVo?.required} disabled />,
    allAssigned: <input type="checkbox" checked={c?.connected} disabled />,
    allRequired: <input type="checkbox" checked={c?.networkVo?.required} disabled />,
    vmNetMgmt: c?.networkVo?.usage?.vm ? <RVI16 iconDef={rvi16VirtualMachine()} /> : null,
    networkOutput: <input type="checkbox" checked={c?.networkVo?.usage?.display} disabled />,
    migrationNetwork: <input type="checkbox" checked={c?.networkVo?.usage?.migration} disabled />,
    glusterNetwork: <input type="checkbox" checked={c?.networkVo?.usage?.gluster} disabled />,
    defaultRouting: <input type="checkbox" checked={c?.networkVo?.usage?.defaultRoute} disabled />,
    networkRole: [
      c?.networkVo?.usage?.management && '관리',
      c?.networkVo?.usage?.display && '출력',
      c?.networkVo?.usage?.migration && Localization.kr.MIGRATION,
      c?.networkVo?.usage?.gluster && '글러스터',
      c?.networkVo?.usage?.defaultRoute && '기본라우팅',
    ].filter(Boolean).join('/'),
  }));
  

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={Localization.kr.NETWORK}
      submitTitle={Localization.kr.MANAGEMENT}
      onSubmit={() => {}}
      contentStyle={{ width: "900px" }}
    >
      <div className="py-3">
        <TablesOuter
          columns={TableColumnsInfo.CLUSTERS_POPUP} data={transformedData}
          onRowClick={() => {}}
          isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
        />
      </div>
    </BaseModal>
  );
};

export default NetworkClusterModal;

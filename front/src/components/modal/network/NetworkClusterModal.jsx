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
  } = useAllClustersFromNetwork(networkId, (cluster) => ({
    name: cluster?.name,
    connect: cluster?.connected ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />,
    status: clusterStatus2Icon(cluster?.networkVo?.status, cluster?.connected),
    required: cluster?.networkVo?.required ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />,
    allAssigned: cluster?.connected ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // 모두 할당
    allRequired: cluster?.networkVo?.required ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // 모두 필요
    vmNetMgmt: cluster?.networkVo?.usage?.vm ? (<RVI16 iconDef={rvi16VirtualMachine} />) : null,
    networkOutput: cluster?.networkVo?.usage?.display ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // 네트워크 출력
    migrationNetwork: cluster?.networkVo?.usage?.migration ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // 마이그레이션 네트워크
    glusterNetwork: cluster?.networkVo?.usage?.gluster ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // Gluster 네트워크
    defaultRouting: cluster?.networkVo?.usage?.defaultRoute ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // 기본 라우팅
    networkRole: [
      cluster?.networkVo?.usage?.management ? '관리' : null,
      cluster?.networkVo?.usage?.display ? '출력' : null,
      cluster?.networkVo?.usage?.migration ? '마이그레이션' : null,
      cluster?.networkVo?.usage?.gluster ? '글러스터' : null,
      cluster?.networkVo?.usage?.defaultRoute ? '기본라우팅' : null,
    ].filter(Boolean).join('/'),
  }));

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={Localization.kr.NETWORK}
      submitTitle={Localization.kr.MANAGEMENT}
      onSubmit={() => {}}
      contentStyle={{ width: "900px"}}
    >
      <div className="py-3">
        <TablesOuter
          isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
          columns={TableColumnsInfo.CLUSTERS_POPUP} data={clusters || []}
          onRowClick={() => {}}
        />
      </div>
    </BaseModal>
  );
};

export default NetworkClusterModal;

import { faPlay } from '@fortawesome/free-solid-svg-icons';
import BaseModal from "../BaseModal";
import TablesOuter from '../../table/TablesOuter';
import TableColumnsInfo from '../../table/TableColumnsInfo';
import { useAllClustersFromNetwork } from '../../../api/RQHook';
import { renderStatusClusterIcon } from '../../Icon';

const NetworkClusterModal = ({ 
  isOpen, onClose, networkId
}) => {
  const {
    data: clusters = [],
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
  } = useAllClustersFromNetwork(networkId, (cluster) => ({
    name: cluster?.name,
    connect: cluster?.connected ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />,
    status: renderStatusClusterIcon(cluster?.connected, cluster?.networkVo?.status),
    required: cluster?.networkVo?.required ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />,
    allAssigned: cluster?.connected ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // 모두 할당
    allRequired: cluster?.networkVo?.required ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // 모두 필요
    vmNetMgmt: cluster?.networkVo?.usage?.vm ? <input type="checkbox" checked disabled /> : <input type="checkbox" disabled />, // 가상 머신 네트워크 관리
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
      targetName={"네트워크"}
      submitTitle={"관리"}
      onSubmit={() => {}}
    >
      {/* <div className="manage-network-popup modal"> */}
      <TablesOuter
        isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
        columns={TableColumnsInfo.CLUSTERS_POPUP} data={clusters || []}
        onRowClick={() => console.log('Row clicked')}
      />
    </BaseModal>
  );
};

export default NetworkClusterModal;

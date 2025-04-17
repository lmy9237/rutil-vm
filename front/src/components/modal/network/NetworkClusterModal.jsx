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

 
  // 삭제예정
  // const transformedData = clusters.map((cluster) => ({
  //   name: cluster?.name,
  //   connect: cluster?.connected 
  //     ? <input type="checkbox" checked disabled /> 
  //     : <input type="checkbox" disabled />,
  //   status: clusterStatus2Icon(cluster?.networkVo?.status, cluster?.connected),
  //   required: cluster?.networkVo?.required 
  //     ? <input type="checkbox" checked disabled /> 
  //     : <input type="checkbox" disabled />,
  //   allAssigned: cluster?.connected 
  //     ? <input type="checkbox" checked disabled /> 
  //     : <input type="checkbox" disabled />,
  //   allRequired: cluster?.networkVo?.required 
  //     ? <input type="checkbox" checked disabled /> 
  //     : <input type="checkbox" disabled />,
  //   vmNetMgmt: cluster?.networkVo?.usage?.vm 
  //     ? <RVI16 iconDef={rvi16VirtualMachine} /> 
  //     : null,
  //   networkOutput: cluster?.networkVo?.usage?.display 
  //     ? <input type="checkbox" checked disabled /> 
  //     : <input type="checkbox" disabled />,
  //   migrationNetwork: cluster?.networkVo?.usage?.migration 
  //     ? <input type="checkbox" checked disabled /> 
  //     : <input type="checkbox" disabled />,
  //   glusterNetwork: cluster?.networkVo?.usage?.gluster 
  //     ? <input type="checkbox" checked disabled /> 
  //     : <input type="checkbox" disabled />,
  //   defaultRouting: cluster?.networkVo?.usage?.defaultRoute 
  //     ? <input type="checkbox" checked disabled /> 
  //     : <input type="checkbox" disabled />,
  //   networkRole: [
  //     cluster?.networkVo?.usage?.management ? '관리' : null,
  //     cluster?.networkVo?.usage?.display ? '출력' : null,
  //     cluster?.networkVo?.usage?.migration ? '마이그레이션' : null,
  //     cluster?.networkVo?.usage?.gluster ? '글러스터' : null,
  //     cluster?.networkVo?.usage?.defaultRoute ? '기본라우팅' : null,
  //   ].filter(Boolean).join('/'),
  // })); 
  

  // 데이터 변환
  const transformedData = clusters.map((c) => ({
    name: c?.name,
    connect: <input type="checkbox" checked={c?.connected} disabled />,
    status: clusterStatus2Icon(c?.networkVo?.status, c?.connected),
    required: <input type="checkbox" checked={c?.networkVo?.required} disabled />,
    allAssigned: <input type="checkbox" checked={c?.connected} disabled />,
    allRequired: <input type="checkbox" checked={c?.networkVo?.required} disabled />,
    vmNetMgmt: c?.networkVo?.usage?.vm ? <RVI16 iconDef={rvi16VirtualMachine} /> : null,
    networkOutput: <input type="checkbox" checked={c?.networkVo?.usage?.display} disabled />,
    migrationNetwork: <input type="checkbox" checked={c?.networkVo?.usage?.migration} disabled />,
    glusterNetwork: <input type="checkbox" checked={c?.networkVo?.usage?.gluster} disabled />,
    defaultRouting: <input type="checkbox" checked={c?.networkVo?.usage?.defaultRoute} disabled />,
    networkRole: [
      c?.networkVo?.usage?.management && '관리',
      c?.networkVo?.usage?.display && '출력',
      c?.networkVo?.usage?.migration && '마이그레이션',
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
          isLoading={isClustersLoading}
          isError={isClustersError}
          isSuccess={isClustersSuccess}
          columns={TableColumnsInfo.CLUSTERS_POPUP}
          data={transformedData}  
          onRowClick={() => {}}
        />
      </div>
    </BaseModal>
  );
};

export default NetworkClusterModal;

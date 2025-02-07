import {useNetworksFromDataCenter, useVMsFromDataCenter} from "../../../api/RQHook";
import VmDu from "../../duplication/VmDu";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import TableOuter from "../../table/TableOuter";
import { useNavigate } from 'react-router-dom';


const DatacenterVm = ({ dataCenter }) => {
    const navigate = useNavigate();

    const { data: vms, status, isLoading, isError  } = useVMsFromDataCenter(dataCenter?.id, toTableItemPredicateVMs);
    function toTableItemPredicateVMs(vm) {
    return {
        id: vm?.id ?? '', 
        hostId: vm?.hostVo?.id ?? '',  // 클러스터의 ID
        clusterId: vm?.clusterVo?.id ?? '',  // 클러스터의 ID
        dataCenterId: vm?.dataCenterVo?.id ?? '',  // 데이터 센터의 ID 
        icon: '🖥️',
        name: vm?.name ?? '없음',
        comment: vm?.comment ?? '없음',
        hostVo: vm?.hostVo?.name ?? '없음',
        ipv4: vm?.ipv4 ?? '알 수 없음',
        fqdn: vm?.fqdn ?? '알 수 없음',
        clusterVo: vm?.clusterVo?.name ?? '알 수 없음',
        status: vm?.status ?? '알 수 없음',
        dataCenterVo: vm?.dataCenterVo?.name ?? '알 수 없음',
        memory: vm?.memory ? `${vm.memory} MiB` : '알 수 없음',
        cpu: vm?.cpu ? `${vm.cpu} cores` : '알 수 없음',
        network: vm?.network ?? '알 수 없음',
        upTime: vm?.upTime ?? '알 수 없음',
        description: vm?.description ?? '알 수 없음',
    };
    } 

    return (
        <>
        <VmDu 
           columns={TableColumnsInfo.VM_CHART}
           data={vms}
           onRowClick={(row, column, colIndex) => {
            if (colIndex === 1) {
              navigate(`/computing/vms/${row.id}`); 
            }else if (colIndex === 3) {
                navigate(`/computing/hosts/${row.hostId}`); 
            }else if (colIndex === 6) {
                navigate(`/computing/clusters/${row.clusterId}`); 
            }else if (colIndex === 8) {
                navigate(`/computing/datacenters/${row.dataCenterId}`); 
            }
          }}

        />
        </>
    );
  };
  
  export default DatacenterVm;
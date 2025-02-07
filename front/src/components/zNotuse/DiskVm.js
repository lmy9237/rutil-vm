import { useAllVmsFromDisk, useAllVnicProfilesFromNetwork } from "../../api/RQHook";
import TableColumnsInfo from "../table/TableColumnsInfo";
import PagingTableOuter from "../table/PagingTableOuter";

const DiskVm = ({disk}) => {

    const { 
        data: vms, 
        status: vmsStatus, 
        isLoading: isVmsLoading, 
        isError: isVmsError,
      } = useAllVmsFromDisk(disk?.id, toTableItemPredicateVMs);
      function toTableItemPredicateVMs(vm) { 
        return {
          name: vm?.name ?? '없음',  // 가상머신 이름
          cluster: vm?.cluster?.name ?? '없음',  // 클러스터
          ipAddress: vm?.ipAddress ?? '없음',  // IP 주소
          fqdn: vm?.fqdn ?? '없음',  // FQDN
          memory: vm?.memory ? `${vm.memory} MB` : '알 수 없음',  // 메모리 (MB)
          cpu: vm?.cpu?.cores ?? '알 수 없음',  // CPU 코어 수
          network: vm?.network?.name ?? '없음',  // 네트워크 이름
          status: vm?.status ?? '알 수 없음',  // 가상머신 상태
          uptime: vm?.uptime ?? '알 수 없음',  // 가상머신 업타임
        };
      }
    
    return (
        <PagingTableOuter 
            columns={TableColumnsInfo.VMS_FROM_DISK} 
            data={vms}
            onRowClick={() => console.log('Row clicked')} 
            showSearchBox={false}
      />
    );
  };
  
  export default DiskVm;
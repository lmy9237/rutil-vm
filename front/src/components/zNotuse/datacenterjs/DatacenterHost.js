import {useHostsFromDataCenter, useNetworksFromDataCenter} from "../../../api/RQHook";
import HostDu from "../../duplication/HostDu";
import { useNavigate } from 'react-router-dom';
import TableColumnsInfo from "../../table/TableColumnsInfo";


const DatacenterHost = ({ dataCenter }) => {
    const navigate = useNavigate();

  const { 
    data: hosts, 
    status: hostsStatus, 
    isLoading: isHostsLoading, 
    isError: isHostsError 
  } = useHostsFromDataCenter(dataCenter?.id, toTableItemPredicateHosts);
  function toTableItemPredicateHosts(host) {
    return {
      id: host?.id ?? '', 
      clusterId: host?.clusterVo?.id ?? '',  // 클러스터의 ID
      dataCenterId: host?.dataCenterVo?.id ?? '',  // 데이터 센터의 ID    
      name: host?.name ?? '없음',
      comment: host?.comment ?? '없음',
      hostNameIP: host?.hostNameIP ?? '알 수 없음',
      clusterVo: host?.clusterVo?.name ?? '알 수 없음',
      dataCenterVo: host?.dataCenterVo?.name ?? '알 수 없음',
      status: host?.status ?? '알 수 없음',
      vm: host?.vm ?? '#',
      memory: host?.memory ? `${host.memory} GiB` : '#',
      cpu: host?.cpu ?? '#',
      network: host?.network ?? '#',
      spmStatus: host?.spmStatus ?? '알 수 없음',
    };
  }

    return (
        <>
         <HostDu 
            data={hosts} 
            columns={TableColumnsInfo.HOSTS_ALL_DATA} 
            onRowClick={(row, column, colIndex) => {
              if (colIndex === 0) {
                navigate(`/computing/hosts/${row.id}`); 
              }else if (colIndex === 3) {
                navigate(`/computing/clusters/${row.clusterId}`);
              } else if (colIndex === 4) {
                navigate(`/computing/datacenters/${row.dataCenterId}`);
              }
            }}
            openPopup={[]}
            onContextMenuItems={() => [
              <div key="새로 만들기" onClick={() => console.log()}>새로 만들기</div>,
              <div key="편집" onClick={() => console.log()}>편집</div>,
              <div key="삭제" onClick={() => console.log()}>삭제</div>,
              <div key="설치" onClick={() => console.log()}>설치</div>,
              <div key="호스트 네트워크 복사" onClick={() => console.log()}>호스트 네트워크 복사</div>,
            ]}
          />
        </>
    );
  };
  
  export default DatacenterHost;
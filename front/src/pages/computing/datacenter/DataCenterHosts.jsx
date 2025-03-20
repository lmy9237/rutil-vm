import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HostDupl from "../../../components/dupl/HostDupl";
import { useHostsFromDataCenter } from "../../../api/RQHook";

/**
 * @name DataCenterHosts
 * @description 데이터센터에 종속 된 호스트 목록
 * (/computing/datacenters/<datacenterId>/hosts)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterHosts = ({ datacenterId }) => {
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
  } = useHostsFromDataCenter(datacenterId, (e) => ({ ...e }));

  console.log("...");
  return (
    <>
      <HostDupl
        isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
        columns={TableColumnsInfo.HOSTS}
        hosts={hosts}
      />
    </>
  );
};

export default DataCenterHosts;

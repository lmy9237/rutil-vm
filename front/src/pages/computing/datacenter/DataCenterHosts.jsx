import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HostDupl from "../../../components/dupl/HostDupl";
import { useHostsFromDataCenter } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name DataCenterHosts
 * @description 데이터센터에 종속 된 호스트 목록
 * (/computing/datacenters/<datacenterId>/hosts)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterHosts = ({
  datacenterId
}) => {
  const { datacentersSelected } = useGlobal()
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
    refetch: refetchHosts,
  } = useHostsFromDataCenter(datacenterId, (e) => ({ ...e }));
  
  return (
    <>
      <HostDupl columns={TableColumnsInfo.HOSTS}
        hosts={hosts}
        refetch={refetchHosts}
        isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
      />
      {/* <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.DATA_CENTER}>${datacentersSelected[0]?.name}`}
        path={`dataCenters-hosts;name=${datacentersSelected[0]?.name}`} 
      /> */}
      {/* NOTE: oVirt에서는 없음 */}
    </>
  );
};

export default DataCenterHosts;

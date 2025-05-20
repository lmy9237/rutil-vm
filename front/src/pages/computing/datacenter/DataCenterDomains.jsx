import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DomainDupl from "../../../components/dupl/DomainDupl";
import { useDomainsFromDataCenter } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name DataCenterDomains
 * @description 데이터센터에 종속 된 도메인 목록
 * (/computing/datacenters/<datacenterId>/domains)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterDomains = ({ 
  datacenterId
}) => {
  const { datacentersSelected } = useGlobal()

  const {
    data: storageDomains = [],
    isLoading: isStorageDomainsLoading,
    isError: isStorageDomainsError,
    isSuccess: isStorageDomainsSuccess,
    refetch: refetchStorageDomains,
    isRefetching: isStorageDomainsRefetching,
  } = useDomainsFromDataCenter(datacenterId, (e) => ({ ...e }));

  return (
    <>
      <DomainDupl columns={TableColumnsInfo.STORAGE_DOMAINS}
        domains={storageDomains}
        actionType={false}
        datacenterId={datacenterId}
        sourceContext={"fromDatacenter"}
        refetch={refetchStorageDomains} isRefetching={isStorageDomainsRefetching}
        isLoading={isStorageDomainsLoading} isError={isStorageDomainsError} isSuccess={isStorageDomainsSuccess}
      />
      <OVirtWebAdminHyperlink 
        name={`${Localization.kr.COMPUTING}>${Localization.kr.DATA_CENTER}>${datacentersSelected[0]?.name}`} 
        path={`dataCenters-storage;name=${datacentersSelected[0]?.name}`} 
      />
    </>
  );
};

export default DataCenterDomains;

import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DomainDupl from "../../../components/dupl/DomainDupl";
import { useDomainsFromDataCenter } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name DataCenterDomains
 * @description 데이터센터에 종속 된 도메인 목록
 * (/computing/datacenters/<datacenterId>/domains)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterDomains = ({ datacenterId }) => {
  const {
    data: storageDomains = [],
    isLoading: isStorageDomainsLoading,
    isError: isStorageDomainsError,
    isSuccess: isStorageDomainsSuccess,
    refetch: refetchStorageDomains,
  } = useDomainsFromDataCenter(datacenterId, (e) => ({ ...e }));

  return (
    <>
      <DomainDupl columns={TableColumnsInfo.STORAGE_DOMAINS}
        domains={storageDomains}
        actionType={false}
        datacenterId={datacenterId}
        sourceContext={"fromDatacenter"}
        refetch={refetchStorageDomains}
        isLoading={isStorageDomainsLoading} isError={isStorageDomainsError} isSuccess={isStorageDomainsSuccess}
      />
    </>
  );
};

export default DataCenterDomains;

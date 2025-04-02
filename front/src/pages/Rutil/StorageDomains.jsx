import React from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import DomainDupl from "../../components/dupl/DomainDupl";
import { useAllStorageDomains } from "../../api/RQHook";

/**
 * @name StorageDomains
 * @description 스토리지 도메인 전체
 *
 * @returns {JSX.Element} StorageDomains
 */
const StorageDomains = () => {
  const {
    data: storageDomains = [],
    isLoading: isStorageDomainsLoading,
    isError: isStorageDomainsError,
    isSuccess: isStorageDomainsSuccess,
    refetch: refetchStorageDomains,
  } = useAllStorageDomains((e) => ({ ...e }));

  return (
    <DomainDupl columns={TableColumnsInfo.STORAGE_DOMAINS}
      domains={storageDomains}
      type={"rutil"}
      refetch={refetchStorageDomains}
      isLoading={isStorageDomainsLoading} isError={isStorageDomainsError} isSuccess={isStorageDomainsSuccess}
    />
  );
};

export default StorageDomains;

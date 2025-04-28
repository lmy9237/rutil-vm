import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import DomainDupl from "../../components/dupl/DomainDupl";
import { useAllStorageDomains } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name StorageDomains
 * @description 스토리지 도메인 전체
 *
 * @returns {JSX.Element} StorageDomains
 */
const StorageDomains = () => {
  const { setDomainsSelected } = useGlobal()

  const {
    data: storageDomains = [],
    isLoading: isStorageDomainsLoading,
    isError: isStorageDomainsError,
    isSuccess: isStorageDomainsSuccess,
    refetch: refetchStorageDomains,
  } = useAllStorageDomains((e) => ({ ...e }));

  useEffect(() => {
    return () => {
      Logger.debug("Hosts > useEffect ... CLEANING UP");
      setDomainsSelected([])
    }
  }, []);

  return (
    <DomainDupl columns={TableColumnsInfo.STORAGE_DOMAINS}
      domains={storageDomains}
      actionType
      refetch={refetchStorageDomains}
      isLoading={isStorageDomainsLoading} isError={isStorageDomainsError} isSuccess={isStorageDomainsSuccess}
    />
  );
};

export default StorageDomains;

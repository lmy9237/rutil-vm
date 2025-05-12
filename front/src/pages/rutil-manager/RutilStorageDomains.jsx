import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import DomainDupl from "../../components/dupl/DomainDupl";
import { useAllStorageDomains } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name RutilStorageDomains
 * @description 스토리지 도메인 전체
 * 경로: <메뉴>/rutil-manager/storageDomains
 *
 * @returns {JSX.Element} RutilStorageDomains
 */
const RutilStorageDomains = () => {
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
      Logger.debug("RutilStorageDomains > useEffect ... CLEANING UP");
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

export default RutilStorageDomains;

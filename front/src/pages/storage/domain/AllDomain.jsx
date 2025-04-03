import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HeaderButton from "../../../components/button/HeaderButton";
import DomainDupl from "../../../components/dupl/DomainDupl";
import { useAllStorageDomains } from "../../../api/RQHook";
import { rvi24Storage } from "../../../components/icons/RutilVmIcons";

/**
 * @name AllDomain
 * @description 도메인 전체
 *
 * @returns {JSX.Element} AllDomain
 */
const AllDomain = () => {
  const {
    data: storageDomains = [],
    isLoading: isStorageDomainsLoading,
    isError: isStorageDomainsError,
    isSuccess: isStorageDomainsSuccess,
    refetch: refetchStorageDomains,
  } = useAllStorageDomains((e) => ({ ...e }));

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Storage()} 
        title="스토리지 도메인"
      />
      <div className="section-content w-full">
        <DomainDupl columns={TableColumnsInfo.STORAGE_DOMAINS}
          domains={storageDomains}
          actionType={"domain"}
          showSearchBox={true}
          refetch={refetchStorageDomains}
          isLoading={isStorageDomainsLoading} isError={isStorageDomainsError} isSuccess={isStorageDomainsSuccess}
        />
      </div>
    </div>
  );
};

export default AllDomain;

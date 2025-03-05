import React from "react";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HeaderButton from "../../../components/button/HeaderButton";
import DomainDupl from "../../../components/dupl/DomainDupl";
import { useAllStorageDomains } from "../../../api/RQHook";

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
  } = useAllStorageDomains((e) => ({ ...e }));

  return (
    <div id="section">
      <div>
        <HeaderButton titleIcon={faDatabase} title="스토리지 도메인" />
      </div>
      <div className="w-full section-content">
        <DomainDupl
          domains={storageDomains || []}
          columns={TableColumnsInfo.STORAGE_DOMAINS}
          actionType={"domain"}
          isLoading={isStorageDomainsLoading}
          isError={isStorageDomainsError}
          isSuccess={isStorageDomainsSuccess}
          showSearchBox={true}
        />
      </div>
    </div>
  );
};

export default AllDomain;

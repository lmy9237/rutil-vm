import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HeaderButton from "../../../components/button/HeaderButton";
import DomainDupl from "../../../components/dupl/DomainDupl";
import { useAllStorageDomains } from "../../../api/RQHook";
import { rvi24Storage } from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import SectionLayout from "../../../components/SectionLayout";

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
    isRefetching: isStorageDomainsRefetching,
  } = useAllStorageDomains((e) => ({ ...e }));

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Storage()} 
        title={Localization.kr.DOMAIN}
      />
      <div className="section-content v-start gap-8 w-full">
        <DomainDupl columns={TableColumnsInfo.STORAGE_DOMAINS}
          domains={storageDomains}
          actionType
          refetch={refetchStorageDomains} isRefetching={isStorageDomainsRefetching}
          isLoading={isStorageDomainsLoading} isError={isStorageDomainsError} isSuccess={isStorageDomainsSuccess}
        />
      </div>
    </SectionLayout>
  );
};

export default AllDomain;

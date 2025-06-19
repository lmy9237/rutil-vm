import { useMemo } from "react";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import { status2Icon }        from "@/components/icons/RutilVmIcons";
import {
  useAllStorageDomainsFromDisk
} from "@/api/RQHook";
import { convertBytesToGB }   from "@/util";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

/**
 * @name DiskDomains
 * @description 디스크에 종속 된 스토리지도메인 목록
 * (/storages/disks/<diskId>/domains)
 *
 * @param {string} diskId 디스크ID
 * @returns
 */
const DiskDomains = ({ 
  diskId
}) => {
  const { domainsSelected, setDomainsSelected } = useGlobal()
  const {
    data: domains = [],
    isLoading: isDomainsLoading,
    isError: isDomainsError,
    isSuccess: isDomainsSuccess,
    refetch: refetchDomains,
    isRefetching: isDomainsRefetching,
  } = useAllStorageDomainsFromDisk(diskId, (e) => ({
    ...e,
  }));
  
  const sizeCheck = (size=0) => {
    Logger.debug(`DiskDomains > sizeCheck ... size: ${size}`)
    return (size === 0) 
      ? Localization.kr.NOT_ASSOCIATED
      : `${convertBytesToGB(size)} GB`;
  };
  
  const transformedData = useMemo(() => 
    [...domains].map((domain) => ({
      ...domain,
      status: domain?.status?.toUpperCase() === 'ACTIVE' ? '활성화' : '비활성화',
      icon: status2Icon(domain.status),
      storageDomain: (<TableRowClick type="domain" id={domain?.id}>{domain?.name}</TableRowClick>),
      domainType: domain?.storageDomainType === 'data' 
          ? '데이터'
          : domain?.storageDomainType === 'iso' 
            ? 'ISO'
            : 'EXPORT',
      diskSize: sizeCheck(domain?.diskSize || 0),
      availableSize: sizeCheck(domain?.availableSize || 0),
      usedSize: sizeCheck(domain?.usedSize || 0),
    }))
  , [domains])

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
 
  return (
    <>
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchDomains} />
      </div>
      <TablesOuter target={"domain"}
        columns={TableColumnsInfo.STORAGE_DOMAINS_FROM_DISK}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setDomainsSelected(selectedRows)}
        shouldHighlight1stCol={true}
        isLoading={isDomainsLoading} isRefetching={isDomainsRefetching} isError={isDomainsError} isSuccess={isDomainsSuccess}
      />
      <SelectedIdView items={domainsSelected} />
    </>
  );
};

export default DiskDomains;

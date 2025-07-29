import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal                     from "@/hooks/useGlobal";
import useSearch                     from "@/hooks/useSearch";
import SelectedIdView                from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink        from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                     from "@/components/button/SearchBox";
import TablesOuter                   from "@/components/table/TablesOuter";
import TableRowClick                 from "@/components/table/TableRowClick";
import DomainActionButtons           from "@/components/dupl/DomainActionButtons";
import DomainDataCenterActionButtons from "@/components/dupl/DomainDataCenterActionButtons";
import { 
  hostedEngineStatus2Icon,
  status2Icon
} from "@/components/icons/RutilVmIcons";
import { getStatusSortKey }          from "@/components/icons/GetStatusSortkey";
import Localization                  from "@/utils/Localization";
import { checkZeroSizeToGiB } from "@/util";
/**
 * @name DomainDupl
 * @description 도메인 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 * 
 * @param {Array} domains,
 * @param {Boolean} actionType datacenter-domain, domain-datacenter 버튼활성화,
 * @returns {JSX.Element}
 */
const 
DomainDupl = ({
  domains = [], columns = [],
  actionType, sourceContext = "all", 
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  // sourceContext: all = 전체목록 fromDomain = 도메인에서 데이터센터 fromDatacenter = 데이터센터에서 도메인
  const navigate = useNavigate();
  const {
    domainsSelected, setDomainsSelected
  } = useGlobal();
  
  // ✅ 데이터 변환 (검색을 위한 `searchText` 필드 추가)
  const transformedData = [...domains].map((domain) => ({
    ...domain,
    _name: (
      <>
      {/* {hostedEngineStatus2Icon(domain?.hostedEngine)} */}
      <TableRowClick type="domain" id={domain?.id}>
        {domain?.name}
      </TableRowClick>
      </>
    ),
    icon: status2Icon(domain.status === "unknown" && domain.storagePoolStatus === "uninitialized" ? "UNATTACHED" : domain.status),
    // icon: status2Icon(domain?.storagePoolStatus),    
    iconSortKey: getStatusSortKey(domain?.status), 
    _status: Localization.kr.renderStatus(domain?.status),
    hostedEngine: hostedEngineStatus2Icon(domain?.hostedEngine),
    format: `V${domain?.storageFormat === "0" ? 1 : domain?.storageFormat }`,
    storageDomainType: domain?.storageDomainTypeKr || (
      domain?.storageDomainType === "master"
        ? `데이터 (마스터)`
        : domain?.storageDomainType === "data"
          ? `데이터`
          : domain?.storageDomainType === "import_export"
            ? `내보내기`
            :`${domain?.storageDomainType}`
    ),
    storageType: domain?.storageType === "nfs"
        ? "NFS"
        : domain?.storageType === "iscsi"
            ? "iSCSI"
            : "Fibre Channel",
    sizeToGB: checkZeroSizeToGiB(domain?.size),
    availableSizeToGB: checkZeroSizeToGiB(domain?.availableSize),
    usedSizeToGB: checkZeroSizeToGiB(domain?.usedSize),
    searchText: `${domain?.name} ${domain?.storageDomainType} ${domain?.storageType} ${domain?.size}GB`
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = useCallback((id) => {
    navigate(`/storages/domains/${id}`);
  }, [navigate])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
        {sourceContext === "all" 
          ? <DomainActionButtons actionType={actionType} />
          : <DomainDataCenterActionButtons actionType={actionType} />
        }
      </div>
      <TablesOuter target={sourceContext === "all" ? "domain" : "domaindatacenter"}
        columns={columns}
        data={filteredData} // ✅ 검색 필터링된 데이터 전달
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        onRowClick={(selectedRows) => setDomainsSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={domainsSelected} />
      <OVirtWebAdminHyperlink name={`${Localization.kr.COMPUTING}>${Localization.kr.DOMAIN}`} path="storage" />
    </>
  );
};

export default DomainDupl;

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState"
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch"; // ✅ 검색 기능 추가;
import DomainActionButtons from "./DomainActionButtons";
import TablesOuter from "../table/TablesOuter";
import SearchBox from "../button/SearchBox"; // ✅ 검색 UI 추가
import { checkZeroSizeToGiB, convertBytesToGB } from "../../util";
import Localization from "../../utils/Localization";
import TableRowClick from "../table/TableRowClick";
import { hostedEngineStatus2Icon, status2Icon } from "../icons/RutilVmIcons";
import SelectedIdView from "../common/SelectedIdView";
import { getStatusSortKey } from "../icons/GetStatusSortkey";
import DomainModals from "../modal/domain/DomainModals";
import DomainDataCenterActionButtons from "./DomainDataCenterActionButtons";
import Logger from "../../utils/Logger";

/**
 * @name DomainDupl
 * @description 도메인 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 * 
 * @param {Array} domains,
 * @param {Boolean} actionType datacenter-domain, domain-datacenter 버튼활성화,
 * @returns {JSX.Element}
 */
const DomainDupl = ({
  columns = [], domains = [],
  actionType, 
  datacenterId,
  sourceContext = "all", 
  showSearchBox = true,
  refetch, isLoading, isError, isSuccess,
}) => {
  // sourceContext: all = 전체목록 fromDomain = 도메인에서 데이터센터 fromDatacenter = 데이터센터에서 도메인
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState();
  const { domainsSelected, setDomainsSelected } = useGlobal()
  
  // ✅ 데이터 변환 (검색을 위한 `searchText` 필드 추가)
  const transformedData = (!Array.isArray(domains) ? [] : domains).map((domain) => ({
    ...domain,
    _name: (
      <TableRowClick type="domain" id={domain?.id}>
        {domain?.name}
      </TableRowClick>
    ),
    icon: status2Icon(domain.status),
    iconSortKey: getStatusSortKey(domain?.status), 
    _status: Localization.kr.renderStatus(domain?.status),
    status: domain?.status,
    hostedEngine: hostedEngineStatus2Icon(domain?.hostedEngine),
    domainType:
      domain?.domainType === "data"
        ? "데이터"
        : domain?.domainType === "iso"
          ? "ISO"
          : "EXPORT",
    storageType:
      domain?.storageType === "nfs"
        ? "NFS"
        : domain?.storageType === "iscsi"
            ? "iSCSI"
            : "Fibre Channel",
    diskSize: checkZeroSizeToGiB(domain?.diskSize),
    availableSize: checkZeroSizeToGiB(domain?.availableSize),
    usedSize: checkZeroSizeToGiB(domain?.usedSize),
    searchText: `${domain?.name} ${domain?.domainType} ${domain?.storageType} ${convertBytesToGB(domain?.diskSize)}GB`
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  const handleNameClick = (id) => navigate(`/storages/domains/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`DomainDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug(`DomainDupl ...`)
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />)}
        {sourceContext === "all" ? (
          <DomainActionButtons
            isEditDisabled={domainsSelected.length !== 1}
            isDeleteDisabled={domainsSelected.length === 0}
            status={domainsSelected[0]?.status}
            selectedDomains={domainsSelected || []} 
            actionType={actionType}
          />
        ): (
          <DomainDataCenterActionButtons
            isEditDisabled={domainsSelected.length !== 1}
            isDeleteDisabled={domainsSelected.length === 0}
            status={domainsSelected[0]?.status}
            selectedDomains={domainsSelected || []} 
            actionType={actionType}
          />
        )}
      </div>

      {/* 테이블 컴포넌트 */}
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={filteredData} // ✅ 검색 필터링된 데이터 전달
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setDomainsSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <DomainActionButtons
            status={row?.status}
            // selectedDomains={[row]}
            isContextMenu={true}
            actionType="context"
          />
        ]}
      />
      
      <SelectedIdView items={domainsSelected} />

      <DomainModals
        onClose={() => setActiveModal(null)}
        domain={domainsSelected[0]}        
        datacenterId={datacenterId}
        sourceContext={sourceContext}
      />
    </div>
  );
};

export default DomainDupl;

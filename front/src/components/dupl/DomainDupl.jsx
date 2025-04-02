import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DomainActionButtons from "./DomainActionButtons";
import TablesOuter from "../table/TablesOuter";
import DomainModals from "../modal/domain/DomainModals";
import SearchBox from "../button/SearchBox"; // ✅ 검색 UI 추가
import { checkZeroSizeToGB, convertBytesToGB } from "../../util";
import Localization from "../../utils/Localization";
import TableRowClick from "../table/TableRowClick";
import { hostedEngineStatus2Icon, status2Icon } from "../icons/RutilVmIcons";
import SelectedIdView from "../common/SelectedIdView";
import Logger from "../../utils/Logger";

/**
 * @name DomainDupl
 * @description 도메인 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 * 
 * @param {Array} domains,
 * @returns {JSX.Element}
 */
const DomainDupl = ({
  domains = [], columns = [], actionType = "domain", datacenterId,
  showSearchBox = true,
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ 검색어 상태 추가
  const handleRefresh = () =>  {
    Logger.debug(`DomainDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }
  // 검색어
  const transformedData = domains.map((domain) => ({
    ...domain,
    _name: (
      <TableRowClick type="domain" id={domain?.id}>
        {domain?.name}
      </TableRowClick>
    ),
    icon: status2Icon(domain.status),
    status: Localization.kr.renderStatus(domain?.status),
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
    diskSize: checkZeroSizeToGB(domain?.diskSize),
    availableSize: checkZeroSizeToGB(domain?.availableSize),
    usedSize: checkZeroSizeToGB(domain?.usedSize),
    searchText: `${domain?.name} ${domain?.domainType} ${domain?.storageType} ${convertBytesToGB(domain?.diskSize)}GB`
  }));

  // 검색 기능 적용 (부분 검색 가능)
  const filteredData = transformedData.filter((domain) =>
    domain.searchText
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleNameClick = (id) => navigate(`/storages/domains/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <div className="dupl-header-group f-start">
        {/* ✅ 검색 UI 추가 */}
        {showSearchBox && (
          <SearchBox
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            onRefresh={handleRefresh}
          />
        )}
        <DomainActionButtons
          openModal={openModal}
          isEditDisabled={selectedDomains.length !== 1}
          isDeleteDisabled={selectedDomains.length === 0}
          status={selectedDomains[0]?.status}
          actionType={actionType}
        />
      </div>

      {/* 테이블 컴포넌트 */}
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={filteredData} // ✅ 검색 필터링된 데이터 전달
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDomains(selectedRows)}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <DomainActionButtons
            openModal={openModal}
            status={row?.status}
            selectedDomains={[row]}
            actionType="context"    
            isContextMenu={true}
          />,
        ]}
      />

      <SelectedIdView items={selectedDomains} />

      {/* 도메인 모달창 */}
      <DomainModals
        activeModal={activeModal}
        domain={selectedDomains[0]}
        selectedDomains={selectedDomains}
        datacenterId={datacenterId}
        onClose={closeModal}
      />
    </>
  );
};

export default DomainDupl;

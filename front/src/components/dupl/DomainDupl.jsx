import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import DomainActionButtons from "./DomainActionButtons";
import TablesOuter from "../table/TablesOuter";
import DomainModals from "../modal/domain/DomainModals";
import SearchBox from "../button/SearchBox"; // ✅ 검색 UI 추가
import { renderDomainStatus, renderDomainStatusIcon } from "../Icon";
import { convertBytesToGB } from "../../util";
import TableRowClick from "../table/TableRowClick";

/**
 * @name DomainDupl
 * @description 도메인 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 * 
 * @param {Array} domains,
 * @returns {JSX.Element}
 */
const DomainDupl = ({
  isLoading, isError, isSuccess,
  domains = [], columns = [], actionType = "domain", datacenterId, showSearchBox = true
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ 검색어 상태 추가

  const selectedIds = (Array.isArray(selectedDomains) ? selectedDomains : [])
    .map((sd) => sd.id)
    .join(", ");

  // 검색어
  const transformedData = domains.map((domain) => ({
    ...domain,
    name: (
      <TableRowClick type="domains" id={domain?.id}>
        {domain?.name}
      </TableRowClick>
    ),
    icon: renderDomainStatusIcon(domain.status),
    status: renderDomainStatus(domain?.status),
    hostedEngine:
      domain?.hostedEngine === true ? (
        <FontAwesomeIcon
          icon={faPencil}
          fixedWidth
          style={{
            color: "gold",
            fontSize: "12px",
            transform: "rotate(90deg)",
          }}
        />
      ) : (
        ""
      ),
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
    diskSize: convertBytesToGB(domain?.diskSize) + " GB",
    availableSize: convertBytesToGB(domain?.availableSize) + " GB",
    usedSize: convertBytesToGB(domain?.usedSize) + " GB",
    searchText: `${domain?.name} ${domain?.domainType} ${domain?.storageType} ${convertBytesToGB(domain?.diskSize)}GB`
  }));

  // 검색 기능 적용 (부분 검색 가능)
  const filteredData = transformedData.filter(domain =>
    domain.searchText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNameClick = (id) => navigate(`/storages/domains/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <div className="dupl-header-group">
        {/* ✅ 검색 UI 추가 */}
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
        isLoading={isLoading} 
        isError={isError} 
        isSuccess={isSuccess}
        columns={columns}
        data={filteredData} // ✅ 검색 필터링된 데이터 전달
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDomains(selectedRows)}
        // clickableColumnIndex={[2]}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <DomainActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            type="context"
            actionType={actionType}
            isContextMenu={true}
          />,
        ]}
      />

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

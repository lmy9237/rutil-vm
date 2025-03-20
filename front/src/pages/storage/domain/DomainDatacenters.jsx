import React, { Suspense, useState } from "react";
import Loading from "../../../components/common/Loading";
import DomainActionButtons from "../../../components/dupl/DomainActionButtons";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { renderDataCenterStatusIcon } from "../../../components/Icon";
import { useAllDataCenterFromDomain, useDomainById } from "../../../api/RQHook";
import SearchBox from "../../../components/button/SearchBox";
import useSearch from "../../../components/button/useSearch";
import DomainActionModal from "../../../components/modal/domain/DomainActionModal";
import DomainAttachModal from "../../../components/modal/domain/DomainAttachModal";

/**
 * @name DomainDatacenters
 * @description 도메인에 종속 된 데이터센터 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDatacenters
 */
const DomainDatacenters = ({ domainId }) => {
  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
  } = useAllDataCenterFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = datacenters.map((datacenter) => ({
    ...datacenter,
    icon: renderDataCenterStatusIcon(datacenter?.domainStatus),
    _name: (
      <TableRowClick type="datacenter" id={datacenter?.id}>
        {datacenter?.name}
      </TableRowClick>
    ),
    domainStatus: datacenter?.domainStatus === "ACTIVE" ? "활성화" : "비활성화",
    searchText: `${datacenter?.name} ${datacenter?.domainStatus}`.toLowerCase(),
  }));

  const { data: domain } = useDomainById(domainId);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedDataCenters, setSelectedDataCenters] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(selectedDataCenters) ? selectedDataCenters : []).map((dc) => dc.id).join(", ");

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  //TODO: 버튼 활성화

  console.log("...");
  return (
    <>
      <div className="dupl-header-group">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <DomainActionButtons
          openModal={openModal}
          isEditDisabled={selectedDataCenters.length !== 1}
          isDeleteDisabled={selectedDataCenters.length === 0}
          status={selectedDataCenters[0]?.domainStatus}
          actionType="domainDc" // 도메인인지, 데이터센터인지
        />
      </div>
      <span>ID: {selectedIds || ""}</span>

      <TablesOuter
        isLoading={isDataCentersLoading} isError={isDataCentersError} isSuccess={isDataCentersSuccess}
        columns={TableColumnsInfo.DATACENTERS_FROM_STORAGE_DOMAIN}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDataCenters(selectedRows)}
      />

      {/* 도메인 모달창 */}
      <Suspense fallback={<Loading />}>
        {activeModal === "attach" ? (
          <DomainAttachModal
            isOpen={true}
            data={domain}
            datacenterId={selectedDataCenters[0]?.id}
            onClose={closeModal}
          />
        ) : (
          <DomainActionModal
            isOpen={["detach", "activate", "maintenance"].includes(activeModal)}
            action={activeModal} // `type` 전달
            data={domain}
            datacenterId={selectedDataCenters[0]?.id}
            onClose={closeModal}
          />
        )}
      </Suspense>
    </>
  );
};

export default DomainDatacenters;

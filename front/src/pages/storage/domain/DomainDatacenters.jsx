import React, { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../../components/common/Loading";
import DomainActionButtons from "../../../components/dupl/DomainActionButtons";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useAllDataCentersFromDomain, useStroageDomain } from "../../../api/RQHook";
import SearchBox from "../../../components/button/SearchBox";
import useSearch from "../../../components/button/useSearch";
import DomainActionModal from "../../../components/modal/domain/DomainActionModal";
import DomainAttachModal from "../../../components/modal/domain/DomainAttachModal";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import SelectedIdView from "../../../components/common/SelectedIdView";

/**
 * @name DomainDatacenters
 * @description 도메인에 종속 된 데이터센터 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDatacenters
 */
const DomainDatacenters = ({
  domainId,
}) => {
  const navigate = useNavigate();
  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
    refetch: refetchDataCenters,
  } = useAllDataCentersFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = datacenters.map((datacenter) => ({
    ...datacenter,
    icon: status2Icon(datacenter?.domainStatus),
    _name: (
      <TableRowClick type="datacenter" id={datacenter?.id}>
        {datacenter?.name}
      </TableRowClick>
    ),
    domainStatus: datacenter?.domainStatus, // === "ACTIVE" ? "활성화" : "비활성화"
    searchText: `${datacenter?.name} ${datacenter?.domainStatus}`.toLowerCase(),
  }));

  const { data: domain } = useStroageDomain(domainId);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedDataCenters, setSelectedDataCenters] = useState([]); // 다중 선택된 데이터센터

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);
  const handleNameClick = (id) => navigate(`/computing/templates/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`TemplateDupl > handleRefresh ... `)
    if (!refetchDataCenters) return;
    refetchDataCenters()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug("DomainDatacenters ...");
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        <SearchBox 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          onRefresh={handleRefresh}
        />
        <DomainActionButtons
          openModal={openModal}
          isEditDisabled={selectedDataCenters.length !== 1}
          isDeleteDisabled={selectedDataCenters.length === 0}
          status={selectedDataCenters[0]?.domainStatus}
          actionType={"domainDc"}
        />
      </div>
      
      <TablesOuter
        isLoading={isDataCentersLoading} isError={isDataCentersError} isSuccess={isDataCentersSuccess}
        columns={TableColumnsInfo.DATACENTERS_FROM_STORAGE_DOMAIN}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDataCenters(selectedRows)}
      />

      <SelectedIdView items={selectedDataCenters} />

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
    </div>
  );
};

export default DomainDatacenters;

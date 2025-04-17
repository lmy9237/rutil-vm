import React, { Suspense, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../../components/common/Loading";
import DomainActionButtons from "../../../components/dupl/DomainActionButtons";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useAllDataCentersFromDomain, useStroageDomain } from "../../../api/RQHook";
import SearchBox from "../../../components/button/SearchBox";
import useSearch from "../../../components/button/useSearch";
import DomainActionModal from "../../../components/modal/domain/DomainActivateModal";
import DomainAttachModal from "../../../components/modal/domain/DomainAttachModal";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import SelectedIdView from "../../../components/common/SelectedIdView";
import DomainMainTenanceModal from "../../../components/modal/domain/DomainMainTenanceModal";
import Localization from "../../../utils/Localization";
import DomainDataCenterActionButtons from "../../../components/dupl/DomainDataCenterActionButtons";
import DomainDetachModal from "../../../components/modal/domain/DomainDetachModal";

/**
 * @name DomainDatacenters
 * @description 도메인에 종속 된 데이터센터 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDatacenters
 */
const DomainDatacenters = ({ domainId }) => {
  const { data: domain } = useStroageDomain(domainId);

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
    domainStatus: datacenter?.domainStatus,
    _domainStatus: Localization.kr.renderStatus(datacenter?.domainStatus),
    searchText: `${datacenter?.name} ${datacenter?.domainStatus}`.toLowerCase(),
  }));


  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const [selectedDataCenters, setSelectedDataCenters] = useState([]); // 다중 선택된 데이터센터
  
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);
  const handleRefresh = () =>  {
    Logger.debug(`DataCenters > handleRefresh ... `)
    if (!refetchDataCenters) return;
    refetchDataCenters()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }


  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        <SearchBox 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          onRefresh={handleRefresh}
        />
        <DomainDataCenterActionButtons
          openModal={openModal}
          isEditDisabled={selectedDataCenters.length !== 1}
          isDeleteDisabled={selectedDataCenters.length === 0}
          status={transformedData[0]?.domainStatus}
          actionType="default"
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
        <DomainAttachModal
          isOpen={activeModal === "attach"}
          sourceContext="fromDomain"
          domainId={domainId}
          datacenterId={selectedDataCenters[0]?.id}
          onClose={closeModal}
        />
        <DomainDetachModal
          isOpen={activeModal === "detach"}
          sourceContext="fromDomain"
          domain={domain}
          datacenterId={selectedDataCenters[0]?.id}
          onClose={closeModal}
        />
        <DomainMainTenanceModal
          isOpen={activeModal === "maintenance"}
          domains={domain}
          datacenterId={selectedDataCenters[0]?.id}
          onClose={closeModal}
        />
      </Suspense>
    </div>
  );
};

export default DomainDatacenters;

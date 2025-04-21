import React, { Suspense, seCallback } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import Loading from "../../../components/common/Loading";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import SearchBox from "../../../components/button/SearchBox";
import DomainAttachModal from "../../../components/modal/domain/DomainAttachModal";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import SelectedIdView from "../../../components/common/SelectedIdView";
import DomainMainTenanceModal from "../../../components/modal/domain/DomainMainTenanceModal";
import Localization from "../../../utils/Localization";
import DomainDataCenterActionButtons from "../../../components/dupl/DomainDataCenterActionButtons";
import DomainDetachModal from "../../../components/modal/domain/DomainDetachModal";
import { useAllDataCentersFromDomain, useStroageDomain } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

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
  const { activeModal, setActiveModal, } = useUIState()
  const { datacentersSelected, setDatacenterSelected, } = useGlobal()

  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
    refetch: refetchDataCenters,
  } = useAllDataCentersFromDomain(domainId, (e) => ({ ...e }));
  const {
    data: domain
  } = useStroageDomain(domainId);

  const transformedData = [...datacenters].map((datacenter) => ({
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
  
  const handleRefresh = useCallback(() => {
    Logger.debug(`DomainDataCenters > handleRefresh ... `)
    if (!refetchDataCenters) return;
    refetchDataCenters()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])


  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>
        <DomainDataCenterActionButtons actionType="default"
          status={transformedData[0]?.domainStatus}
        />
      </div>
      <TablesOuter
        isLoading={isDataCentersLoading} isError={isDataCentersError} isSuccess={isDataCentersSuccess}
        columns={TableColumnsInfo.DATACENTERS_FROM_STORAGE_DOMAIN}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setDatacenterSelected(selectedRows)}
      />

      <SelectedIdView items={datacentersSelected} />

      {/* 도메인 모달창 */}
      <Suspense fallback={<Loading />}>
        {activeModal() === "domain:attach" && <DomainAttachModal isOpen={activeModal() === "domain:attach"}
          onClose={() => setActiveModal(null)}
          sourceContext="fromDomain"
          domainId={domainId}
          datacenterId={datacentersSelected[0]?.id}
        />}
        {activeModal() === "domain:detach" && <DomainDetachModal isOpen={activeModal() === "domain:detach"}
          sourceContext="fromDomain"
          onClose={() => setActiveModal(null)}
          domains={domain}
          datacenterId={datacentersSelected[0]?.id}
        />}
        {activeModal() === "domain:maintenance" && <DomainMainTenanceModal isOpen={activeModal() === "domain:maintenance"}
          onClose={() => setActiveModal(null)}
          domains={domain}
          datacenterId={datacentersSelected[0]?.id}
        />}
      </Suspense>
    </div>
  );
};

export default DomainDatacenters;

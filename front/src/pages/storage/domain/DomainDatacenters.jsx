import React, { useCallback } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import SearchBox from "../../../components/button/SearchBox";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import SelectedIdView from "../../../components/common/SelectedIdView";
import Localization from "../../../utils/Localization";
import DomainDataCenterActionButtons from "../../../components/dupl/DomainDataCenterActionButtons";
import { useAllDataCentersFromDomain } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name DomainDatacenters
 * @description 도메인에 종속 된 데이터센터 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDatacenters
 */
const DomainDatacenters = ({ domainId }) => {
  const { datacentersSelected, setDatacentersSelected, } = useGlobal()

  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
    refetch: refetchDataCenters,
  } = useAllDataCentersFromDomain(domainId, (e) => ({ ...e }));

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
        onRowClick={(selectedRows) => setDatacentersSelected(selectedRows)}
      />

      <SelectedIdView items={datacentersSelected} /><br/>
    </div>
  );
};

export default DomainDatacenters;

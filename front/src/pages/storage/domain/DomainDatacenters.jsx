import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import { status2Icon }        from "@/components/icons/RutilVmIcons";
import DomainDataCenterActionButtons from "@/components/dupl/DomainDataCenterActionButtons";
import {
  useAllDataCentersFromDomain
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

/**
 * @name DomainDatacenters
 * @description 도메인에 종속 된 데이터센터 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDatacenters
 */
const DomainDatacenters = ({
  domainId
}) => {
  const navigate = useNavigate();
  const { activeModal } = useUIState();
  const {
    domainsSelected,
    datacentersSelected, setDatacentersSelected
  } = useGlobal()

  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
    refetch: refetchDataCenters,
    isRefetching: isDataCentersRefetching,
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

  const handleNameClick = useCallback((id) => {
    navigate(`/computing/vms/${id}`);
  }, [navigate])

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  return (
    <>
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchDataCenters}/>
        <DomainDataCenterActionButtons actionType="default" />
      </div>
      <TablesOuter target={"domaindatacenter"}
        columns={TableColumnsInfo.DATACENTERS_FROM_STORAGE_DOMAIN}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => {
          if (activeModal().length > 0) return;
          setDatacentersSelected(selectedRows)
        }}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        shouldHighlight1stCol={true}
        isLoading={isDataCentersLoading} isRefetching={isDataCentersRefetching} isError={isDataCentersError} isSuccess={isDataCentersSuccess}
      />
      <SelectedIdView items={datacentersSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DATA_CENTER}>${domainsSelected[0]?.name}`}
        path={`storage-data_center;name=${domainsSelected[0]?.name}`}
      />
    </>
  );
};

export default DomainDatacenters;

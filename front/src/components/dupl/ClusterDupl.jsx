import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import ClusterActionButtons   from "@/components/dupl/ClusterActionButtons";
import Localization           from "@/utils/Localization";

/**
 * @name ClusterDupl
 * @description ...
 * 
 * @param {Array} clusters
 * @param {string[]} columns
 * @param {string} datacenterId
 * 
 * @returns
 */
const ClusterDupl = ({
  clusters = [], columns = [],
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal } = useUIState();
  const {
    clustersSelected, setClustersSelected
  } = useGlobal();

  const transformedData = [...clusters].map((cluster) => ({
    ...cluster,
    _name: (
      <TableRowClick type="cluster" id={cluster?.id}>
        {cluster?.name}
      </TableRowClick>
    ),
    hostCnt: cluster?.hostSize?.allCnt,
    vmCnt: cluster?.vmSize?.allCnt,
    dataCenter: (
      <TableRowClick type="datacenter" id={cluster?.dataCenterVo?.id}>
        {cluster?.dataCenterVo?.name}
      </TableRowClick>
    ),
    searchText: `${cluster?.name} ${cluster?.dataCenterVo?.name || ""}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = useCallback((id) => {
    navigate(`/computing/clusters/${id}`);
  }, [navigate])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
        <ClusterActionButtons />
      </div>
      <TablesOuter target={"cluster"}
        columns={columns}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        multiSelect={true}
        onRowClick={(selectedRows) => {
          if (activeModal().length > 0) return
          setClustersSelected(selectedRows)
        }}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={clustersSelected} />
      <OVirtWebAdminHyperlink name={`${Localization.kr.COMPUTING}>${Localization.kr.CLUSTER}`} path="clusters" />
    </>
  );
};

export default ClusterDupl;

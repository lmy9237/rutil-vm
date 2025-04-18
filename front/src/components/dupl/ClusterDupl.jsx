import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useSearch from "../../hooks/useSearch";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import ClusterModals from "../modal/cluster/ClusterModals";
import ClusterActionButtons from "./ClusterActionButtons";
import SearchBox from "../button/SearchBox";
import Logger from "../../utils/Logger";
import SelectedIdView from "../common/SelectedIdView";
import useGlobal from "../../hooks/useGlobal";

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
  clusters = [], columns = [], showSearchBox=true,
  datacenterId,  
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { clustersSelected, setClustersSelected } = useGlobal();

  const transformedData = (!Array.isArray(clusters) ? [] : clusters).map((cluster) => ({
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

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = (id) => navigate(`/computing/clusters/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`ClusterDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}  onRefresh={handleRefresh} />)}
        <ClusterActionButtons actionType = "default"/>
      </div>

      <TablesOuter
        columns={columns}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setClustersSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        onContextMenuItems={(row) => [
          <ClusterActionButtons actionType="context"/>,
        ]}
      />
      <SelectedIdView items={clustersSelected} />

      {/* 클러스터 모달창 */}
      <ClusterModals 
        cluster={clustersSelected[0]}
        datacenterId={datacenterId}
      />
    </div>
  );
};

export default ClusterDupl;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import ClusterModals from "../modal/cluster/ClusterModals";
import ClusterActionButtons from "./ClusterActionButtons";
import SearchBox from "../button/SearchBox";
import useSearch from "../button/useSearch";
import Logger from "../../utils/Logger";
import SelectedIdView from "../common/SelectedIdView";

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
  datacenterId,  
  showSearchBox=true,
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedClusters, setSelectedClusters] = useState([]);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);
  const handleNameClick = (id) => navigate(`/computing/clusters/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`ClusterDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  const transformedData = clusters.map((cluster) => ({
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
  const status = 
      selectedClusters.length === 0 ? "none"
      : selectedClusters.length === 1 ? "single"
      : "multiple";

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (
          <SearchBox 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            onRefresh={handleRefresh}
          />
        )}
        <ClusterActionButtons
          openModal={openModal}
          isEditDisabled={selectedClusters.length !== 1}
          status={status}
        />
      </div>

      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedClusters(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true} // 다중 선택 활성화
        onContextMenuItems={(row) => [
          <ClusterActionButtons
            openModal={openModal}
            status={row?.status}
            selectedClusters={[row]}
            actionType="context"
          />,
        ]}
      />

      <SelectedIdView items={selectedClusters} />

      {/* 클러스터 모달창 */}
      <ClusterModals
        activeModal={activeModal}
        cluster={selectedClusters[0]}
        selectedClusters={selectedClusters}
        datacenterId={datacenterId}
        onClose={() => {
          Logger.debug("ClusterDupl > onClose ... ")
          closeModal();
        }}
      />
    </div>
  );
};

export default ClusterDupl;

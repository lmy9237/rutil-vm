import React, { Suspense, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import Loading from "../../../components/common/Loading";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import ActionButton from "../../../components/button/ActionButton";
import TableRowClick from "../../../components/table/TableRowClick";
import NetworkClusterModal from "../../../components/modal/network/NetworkClusterModal";
import Localization from "../../../utils/Localization";
import SelectedIdView from "../../../components/common/SelectedIdView";
import { clusterStatus2Icon } from "../../../components/icons/RutilVmIcons";
import SearchBox from "../../../components/button/SearchBox";
import { useAllClustersFromNetwork } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name NetworkClusters
 * @description 네트워크에 종속 된 클러스터 목록
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkClusters
 */
const NetworkClusters = ({ networkId }) => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState()
  const { clustersSelected, setClustersSelected } = useGlobal()

  const {
    data: clusters = [],
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
    refetch: refetchClusters,
  } = useAllClustersFromNetwork(networkId, (e) => ({ ...e }));

  const transformedData = clusters.map((cluster) => ({
    ...cluster,
    _name: (
      <TableRowClick type="cluster" id={cluster?.id}>
        {cluster?.name}
      </TableRowClick>
    ),
    connect: cluster?.connected ? (
      <input type="checkbox" checked disabled />
    ) : (
      <input type="checkbox" disabled />
    ),
    status: clusterStatus2Icon(cluster?.networkVo?.status, cluster?.connected),
    required: cluster?.networkVo?.required ? (
      <input type="checkbox" checked disabled />
    ) : (
      <input type="checkbox" disabled />
    ),
    networkRole: [
      cluster?.networkVo?.usage?.management ? Localization.kr.MANAGEMENT : null,
      cluster?.networkVo?.usage?.display ? Localization.kr.PRINT : null,
      cluster?.networkVo?.usage?.migration ? Localization.kr.MIGRATION : null,
      cluster?.networkVo?.usage?.gluster ? "글러스터" : null,
      cluster?.networkVo?.usage?.defaultRoute ? "기본라우팅" : null,
    ].filter(Boolean).join(" / "),
  }));
  
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, TableColumnsInfo.CLUSTERS_FRON_NETWORK);
  const handleNameClick = useCallback((id) => {
    navigate(`/networks/${id}`);
  }, [navigate])

  const handleRefresh = useCallback(() => {
    Logger.debug(`NetworkDupl > handleRefresh ... `)
    if (!refetchClusters) return;
    refetchClusters()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        <div className="header-right-btns">
          <ActionButton actionType="default"
            label={`${Localization.kr.NETWORK} 관리`}
            onClick={() => setActiveModal("network:manage")}
          />
        </div>
      </div>
      <TablesOuter target={"cluster"}
        columns={TableColumnsInfo.CLUSTERS_FRON_NETWORK}    
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setClustersSelected(selectedRows)}
        multiSelect={false}
        onContextMenuItems={(row) => [
          <div className="right-click-menu-box">
            <button
              className="right-click-menu-btn"
              onClick={() => setActiveModal("network:manage")}
            >
              네트워크 관리
            </button>
          </div>,
        ]}
        isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
      />

      <SelectedIdView item={clustersSelected}/>

      {/* 네트워크 관리창 */}
      <Suspense fallback={<Loading />}>
        {activeModal().includes("network:manage")  && (
          <NetworkClusterModal key={activeModal()} isOpen={activeModal().includes("network:manage")}
            networkId={networkId}
          />
        )}
      </Suspense>
    </>
  );
};

export default NetworkClusters;

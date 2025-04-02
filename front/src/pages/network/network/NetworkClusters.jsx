import React, { Suspense, useState } from "react";
import Loading from "../../../components/common/Loading";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import ActionButton from "../../../components/button/ActionButton";
import TableRowClick from "../../../components/table/TableRowClick";
import NetworkClusterModal from "../../../components/modal/network/NetworkClusterModal";
import { useAllClustersFromNetwork } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import SelectedIdView from "../../../components/common/SelectedIdView";
import { clusterStatus2Icon } from "../../../components/icons/RutilVmIcons";
import SearchBox from "../../../components/button/SearchBox";
import useSearch from "../../../components/button/useSearch";
import { navigate } from "@storybook/addon-links";
import toast from "react-hot-toast";

/**
 * @name NetworkClusters
 * @description 네트워크에 종속 된 클러스터 목록
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkClusters
 */
const NetworkClusters = ({ networkId }) => {
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
      cluster?.networkVo?.usage?.migration ? "마이그레이션" : null,
      cluster?.networkVo?.usage?.gluster ? "글러스터" : null,
      cluster?.networkVo?.usage?.defaultRoute ? "기본라우팅" : null,
    ].filter(Boolean).join(" / "),
  }));

  const [selectedClusters, setSelectedClusters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, TableColumnsInfo.CLUSTERS_FRON_NETWORK);
  const showSearchBox = true
  const handleNameClick = (id) => navigate(`/networks/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`NetworkDupl > handleRefresh ... `)
    if (!refetchClusters) return;
    refetchClusters()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug("NetworkClusters ... ");
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (
          <SearchBox 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            onRefresh={handleRefresh}
          />
        )}
        <ActionButton 
          actionType="default"
          label={`${Localization.kr.NETWORK} 관리`}
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <TablesOuter columns={TableColumnsInfo.CLUSTERS_FRON_NETWORK}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedClusters(selectedRows)}
        multiSelect={false}
        onContextMenuItems={(row) => [
          <div className="right-click-menu-box">
            <button
              className="right-click-menu-btn"
              onClick={() => setIsModalOpen(true)}
            >
              네트워크 관리
            </button>
          </div>,
        ]}
        isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
      />

      <SelectedIdView item={selectedClusters}/>

      {/* 네트워크 관리창 */}
      <Suspense fallback={<Loading />}>
        {isModalOpen && (
          <NetworkClusterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            networkId={networkId}
          />
        )}
      </Suspense>
    </div>
  );
};

export default NetworkClusters;

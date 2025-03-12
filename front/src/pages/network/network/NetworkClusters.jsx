import React, { Suspense, useState } from "react";
import Loading from "../../../components/common/Loading";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import { renderStatusClusterIcon } from "../../../components/Icon";
import { useAllClustersFromNetwork } from "../../../api/RQHook";

const NetworkClusterModal = React.lazy(
  () => import("../../../components/modal/network/NetworkClusterModal")
);

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
  } = useAllClustersFromNetwork(networkId, (e) => ({
    ...e,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderModals = () => (
    <Suspense fallback={<Loading />}>
      {isModalOpen && (
        <NetworkClusterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          networkId={networkId}
        />
      )}
    </Suspense>
  );

  console.log("...");
  return (
    <>
      <div className="header-right-btns mb-2">
        <button onClick={() => setIsModalOpen(true)}>네트워크 관리</button>
      </div>

      <TablesOuter
        isLoading={isClustersLoading}
        isError={isClustersError}
        isSuccess={isClustersSuccess}
        columns={TableColumnsInfo.CLUSTERS_FRON_NETWORK}
        data={clusters.map((cluster) => ({
          ...cluster,
          name: cluster?.name,
          connect: cluster?.connected ? (
            <input type="checkbox" checked disabled />
          ) : (
            <input type="checkbox" disabled />
          ),
          status: renderStatusClusterIcon(
            cluster?.connected,
            cluster?.networkVo?.status
          ),
          required: cluster?.networkVo?.required ? (
            <input type="checkbox" checked disabled />
          ) : (
            <input type="checkbox" disabled />
          ),
          networkRole: [
            cluster?.networkVo?.usage?.management ? "관리" : null,
            cluster?.networkVo?.usage?.display ? "출력" : null,
            cluster?.networkVo?.usage?.migration ? "마이그레이션" : null,
            cluster?.networkVo?.usage?.gluster ? "글러스터" : null,
            cluster?.networkVo?.usage?.defaultRoute ? "기본라우팅" : null,
          ]
            .filter(Boolean)
            .join("/"),
        }))}
        shouldHighlight1stCol={true}
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
      />

      {/* 네트워크 관리창 */}
      {renderModals()}
    </>
  );
};

export default NetworkClusters;

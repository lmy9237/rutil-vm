import React, { Suspense, useState } from "react";
import Loading from "../../../components/common/Loading";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import { renderStatusClusterIcon } from "../../../components/Icon";
import ActionButton from "../../../components/button/ActionButton";
import TableRowClick from "../../../components/table/TableRowClick";
import NetworkClusterModal from "../../../components/modal/network/NetworkClusterModal";
import { useAllClustersFromNetwork } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

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
      cluster?.networkVo?.usage?.management ? Localization.kr.MANAGEMENT : null,
      cluster?.networkVo?.usage?.display ? Localization.kr.PRINT : null,
      cluster?.networkVo?.usage?.migration ? "마이그레이션" : null,
      cluster?.networkVo?.usage?.gluster ? "글러스터" : null,
      cluster?.networkVo?.usage?.defaultRoute ? "기본라우팅" : null,
    ].filter(Boolean).join(" / "),
  }));


  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("...");
  return (
    <>
      <div className="header-right-btns mb-2">
        <ActionButton actionType="default"
          label={`${Localization.kr.NETWORK} 관리`}
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <TablesOuter
        isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
        columns={TableColumnsInfo.CLUSTERS_FRON_NETWORK}
        data={transformedData}
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
      <Suspense fallback={<Loading />}>
        {isModalOpen && (
          <NetworkClusterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            networkId={networkId}
          />
        )}
      </Suspense>
    </>
  );
};

export default NetworkClusters;

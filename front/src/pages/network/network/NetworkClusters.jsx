import React, { Suspense, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUIState                      from "@/hooks/useUIState";
import useGlobal                       from "@/hooks/useGlobal";
import useSearch                       from "@/hooks/useSearch";
import { Checkbox }                    from "@/components/ui/checkbox"; 
import Loading                         from "@/components/common/Loading";
import SelectedIdView                  from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink          from "@/components/common/OVirtWebAdminHyperlink";
import { ActionButton }                from "@/components/button/ActionButtons";
import SearchBox                       from "@/components/button/SearchBox";
import TableColumnsInfo                from "@/components/table/TableColumnsInfo";
import TablesOuter                     from "@/components/table/TablesOuter";
import TableRowClick                   from "@/components/table/TableRowClick";
import NetworkClusterModal             from "@/components/modal/network/NetworkClusterModal";
import { 
  status2Icon
} from "@/components/icons/RutilVmIcons";
import {
  useAllClustersFromNetwork
} from "@/api/RQHook";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

/**
 * @name NetworkClusters
 * @description 네트워크에 종속 된 클러스터 목록
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkClusters
 */
const NetworkClusters = ({
  networkId
}) => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState()
  const { 
    datacentersSelected,
    networksSelected,
    clustersSelected, setClustersSelected
  } = useGlobal()

  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
    refetch: refetchNetworks,
    isRefetching: isNetworksRefetching,
  } = useAllClustersFromNetwork(networkId, (e) => ({ ...e }));

  const transformedData = networks.map((network) => ({
    ...network,
    _name: (
      <TableRowClick type="cluster" id={network?.clusterVo?.id}>
        {network?.clusterVo?.name}
      </TableRowClick>
    ),
    status: status2Icon(network?.status),
    // _connected: network?.connected ? (
    _connected: true ? (
      <Checkbox checked disabled />
    ) : (
      <Checkbox disabled />
    ),
    _required: network?.required ? (
      <Checkbox checked disabled />
    ) : (
      <Checkbox disabled />
    ),
    networkRole: network?.usage?.roleInKr,
  }));
  
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchNetworks} />
        <div className="header-right-btns">
          <ActionButton actionType="default"
            label={`${Localization.kr.NETWORK} ${Localization.kr.MANAGEMENT}`}
            onClick={() => setActiveModal("network:manage")}
            // disabled
          />
        </div>
      </div>
      <TablesOuter target={"cluster"}
        columns={TableColumnsInfo.CLUSTERS_FROM_NETWORK}    
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setClustersSelected(selectedRows)}
        // TODO: 처리방식 변경
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
        isLoading={isNetworksLoading} isRefetching={isNetworksRefetching} isError={isNetworksError} isSuccess={isNetworksSuccess}
      />
      <SelectedIdView item={clustersSelected}/>
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.NETWORK}>${networksSelected[0]?.name}`}
        path={`networks-clusters;name=${networksSelected[0]?.name};dataCenter=${datacentersSelected[0]?.name}`}
      />
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

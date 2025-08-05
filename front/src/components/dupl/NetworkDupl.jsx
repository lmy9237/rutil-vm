import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import {
  status2Icon,
  networkUsage2Icons,
} from "@/components/icons/RutilVmIcons";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import NetworkActionButtons             from "@/components/dupl/NetworkActionButtons";
import Localization                     from "@/utils/Localization"; 
import Logger                           from "@/utils/Logger";
import "./Dupl.css"; // NOTE: 제거필요여부 확인 필요

/**
 * @name NetworkDupl
 * @description 네트워크 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 *
 * @param {Array} networks - 네트워크 데이터 배열
 * @param {string[]} columns - 테이블 컬럼 정보
 * @returns {JSX.Element}
 */
const NetworkDupl = ({
  networks = [], columns = [],
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const {
    networksSelected, setNetworksSelected
  } = useGlobal()

  // 데이터를 변환 (검색 가능하도록 `searchText` 필드 추가)
  const transformedData = [...networks].map((network) => ({
    ...network,
    icon: status2Icon(network?.status),
    _name: (
      <TableRowClick type="network" id={network?.id} hideIcon>
        {network?.name}
      </TableRowClick>
    ),
    status: Localization.kr.renderStatus(network?.status),
    // status: network?.status?.toUpperCase() === "OPERATIONAL" ? "가동 중" : "비 가동 중",
    vlan: network?.vlan === 0 ? "-" : network?.vlan,
    mtu: network?.mtu === 0 ? "기본값(1500)" : network?.mtu,
    datacenter: (
      <TableRowClick type="datacenter" id={network?.dataCenterVo?.id}>
        {network?.dataCenterVo?.name}
      </TableRowClick>
    ),
    role: (networkUsage2Icons(network?.usage, network?.roleInKr)),
    searchText: `${network?.name} ${network?.vlan} ${network?.mtu} ${network?.datacenterVo?.name || ""}`
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = useCallback((id) => {
    navigate(`/networks/${id}`);
  }, [navigate])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          isLoading={isLoading} isRefetching={isRefetching} refetch={refetch} 
        />
        <LoadingFetch isLoading={isLoading} isRefetching={isRefetching} />
        <NetworkActionButtons />
      </div>
      <TablesOuter target={"network"}
        columns={columns}
        data={filteredData} 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => setNetworksSelected(selectedRows)} 
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={networksSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.NETWORK}`}
        path="networks"
      />
    </>
  );
};

export default NetworkDupl;

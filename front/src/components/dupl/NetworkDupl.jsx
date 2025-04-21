import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import toast from "react-hot-toast";
import useSearch from "../../hooks/useSearch";
import NetworkActionButtons from "./NetworkActionButtons";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import SearchBox from "../button/SearchBox";
import Localization from "../../utils/Localization";
import SelectedIdView from "../common/SelectedIdView";
import NetworkModals from "../modal/network/NetworkModals";
import Logger from "../../utils/Logger";
import "./Dupl.css";

/**
 * @name NetworkDupl
 * @description 네트워크 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 *
 * @param {Array} networks - 네트워크 데이터 배열
 * @param {string[]} columns - 테이블 컬럼 정보
 * @returns {JSX.Element}
 */
const NetworkDupl = ({
  networks = [], columns = [], showSearchBox = true,
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState()
  const { networksSelected, setNetworksSelected } = useGlobal()

  // 데이터를 변환 (검색 가능하도록 `searchText` 필드 추가)
  const transformedData = [...networks].map((network) => ({
    ...network,
    _name: (
      <TableRowClick type="network" id={network?.id}>
        {network?.name}
      </TableRowClick>
    ),
    status: Localization.kr.renderStatus(network?.status),
    // status: network?.status === "OPERATIONAL" ? "가동 중" : "비 가동 중",
    vlan: network?.vlan === 0 ? "-" : network?.vlan,
    mtu: network?.mtu === 0 ? "기본값(1500)" : network?.mtu,
    datacenter: (
      <TableRowClick type="datacenter" id={network?.dataCenterVo?.id}>
        {network?.dataCenterVo?.name}
      </TableRowClick>
    ),
    role: [
      network?.usage?.management ? Localization.kr.MANAGEMENT : null,
      network?.usage?.display ? Localization.kr.PRINT : null,
      network?.usage?.migration ? "마이그레이션" : null,
      network?.usage?.gluster ? "글러스터" : null,
      network?.usage?.defaultRoute ? "기본라우팅" : null,
    ].filter(Boolean).join(" / "),
    searchText: `${network?.name} ${network?.vlan} ${network?.mtu} ${network?.datacenterVo?.name || ""}`
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, columns);

  const handleNameClick = useCallback((id) => {
    navigate(`/networks/${id}`);
  }, [navigate])
  
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`NetworkDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />)}
        <NetworkActionButtons />
      </div>

      {/* 테이블 컴포넌트 */}
      <TablesOuter target={"network"}
        columns={columns}
        data={filteredData} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        multiSelect={true} 
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => setNetworksSelected(selectedRows)} 
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={networksSelected} />

      {/* 네트워크 모달창 */}
      <NetworkModals network={networksSelected[0]} />
    </div>
  );
};

export default NetworkDupl;

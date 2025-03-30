import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NetworkActionButtons from "./NetworkActionButtons";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import NetworkModals from "../modal/network/NetworkModals";
import SearchBox from "../button/SearchBox";
import useSearch from "../button/useSearch";
import Localization from "../../utils/Localization";
import SelectedIdView from "../common/SelectedIdView";
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
  isLoading, isError, isSuccess,
  networks = [], columns = [], showSearchBox = true, 
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedNetworks, setSelectedNetworks] = useState([]);

  // 데이터를 변환 (검색 가능하도록 `searchText` 필드 추가)
  const transformedData = networks.map((network) => ({
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

  // 변환된 데이터에서 검색 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, columns);

  const handleNameClick = (id) => navigate(`/networks/${id}`);

  // 모달 열기 / 닫기
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (

    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group">
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        <NetworkActionButtons 
          className=""
          openModal={openModal}
          isEditDisabled={selectedNetworks.length !== 1}
          isDeleteDisabled={selectedNetworks.length === 0}
        />
      </div>

      {/* 테이블 컴포넌트 */}
      <TablesOuter
        isLoading={isLoading} 
        isError={isError} 
        isSuccess={isSuccess}
        columns={columns}
        data={filteredData} 
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedNetworks(selectedRows)}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true} 
        onContextMenuItems={(row) => [
          <NetworkActionButtons
            openModal={openModal}
            status={row?.status}
            selectedNetworks={[row]}
            actionType="context"
            isContextMenu={true}
          />,
        ]}
      />

      <SelectedIdView items={selectedNetworks} />

      {/* 네트워크 모달창 */}
      <NetworkModals
        activeModal={activeModal}
        network={activeModal === "edit" ? selectedNetworks[0] : null}
        selectedNetworks={selectedNetworks}
        onClose={closeModal}
      />
    </div>
  );
};

export default NetworkDupl;

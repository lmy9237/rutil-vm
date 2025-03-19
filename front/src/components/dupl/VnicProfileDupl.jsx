import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import VnicProfileModals from "../modal/vnic-profile/VnicProfileModals";
import VnicProfileActionButtons from "./VnicProfileActionButtons";
import SearchBox from "../button/SearchBox";  
import useSearch from "../button/useSearch"; 

/**
 * @name VnicProfileDupl
 * @description vNIC 프로필 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 *
 * @param {Array} vnicProfiles vNIC 프로필
 * @returns {JSX.Element}
 */
const VnicProfileDupl = ({
  isLoading, isError, isSuccess,
  vnicProfiles = [], columns = [], networkId,
  showSearchBox = true,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedVnicProfiles, setSelectedVnicProfiles] = useState([]);

  // ✅ 데이터 변환 (검색 가능하도록 `searchText` 필드 추가)
  const transformedData = vnicProfiles.map((vnic) => ({
    ...vnic,
    _name: (
      <TableRowClick type="vnicProfile" id={vnic?.id}>
        {vnic?.name}
      </TableRowClick>
    ),
    network: (
      <TableRowClick type="network" id={vnic?.networkVo?.id}>
        {vnic?.networkVo?.name}
      </TableRowClick>
    ),
    dataCenter: (
      <TableRowClick type="datacenter" id={vnic?.dataCenterVo?.id}>
        {vnic?.dataCenterVo?.name}
      </TableRowClick>
    ),
    passThrough: vnic?.passThrough === "DISABLED" ? "아니요" : "예",
    networkFilter: vnic?.networkFilterVo?.name || "-",
    searchText: `${vnic?.name} ${vnic?.networkVo?.name || ""} ${vnic?.dataCenterVo?.name || ""} ${vnic?.networkFilterVo?.name || ""}`
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = (id) => navigate(`/vnicProfiles/${id}/vms`);
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group">
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        <VnicProfileActionButtons
          openModal={openModal}
          isEditDisabled={selectedVnicProfiles.length !== 1}
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
        onRowClick={(selectedRows) => setSelectedVnicProfiles(selectedRows)}
        // clickableColumnIndex={[0]}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <VnicProfileActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            actionType="context"
          />,
        ]}
      />

      {/* vNIC Profile 모달창 */}
      <VnicProfileModals
        activeModal={activeModal}
        vnicProfile={activeModal === "edit" ? selectedVnicProfiles[0] : null}
        selectedVnicProfiles={selectedVnicProfiles}
        networkId={networkId}
        onClose={closeModal}
      />
    </div>
  );
};

export default VnicProfileDupl;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useSearch from "../../hooks/useSearch"; 
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import VnicProfileModals from "../modal/vnic-profile/VnicProfileModals";
import VnicProfileActionButtons from "./VnicProfileActionButtons";
import SearchBox from "../button/SearchBox";  
import SelectedIdView from "../common/SelectedIdView";
import Logger from "../../utils/Logger";
import useGlobal from "../../hooks/useGlobal";

/**
 * @name VnicProfileDupl
 * @description vNIC 프로필 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 *
 * @param {Array} vnicProfiles vNIC 프로필
 * @returns {JSX.Element}
 */
const VnicProfileDupl = ({
  vnicProfiles = [], columns = [], networkId,
  showSearchBox = true,
  refetch,
  isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState();
  const { vnicProfilesSelected, setVnicProfilesSelected } = useGlobal();

  // ✅ 데이터 변환 (검색 가능하도록 `searchText` 필드 추가)
  const transformedData = (!Array.isArray(vnicProfiles) ? [] : vnicProfiles).map((vnic) => ({
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
  const handleRefresh = () =>  {
    Logger.debug(`DiskDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug(`VnicProfileDupl ... `)
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>)}
        <VnicProfileActionButtons />
      </div>

      {/* 테이블 컴포넌트 */}
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={filteredData} 
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setVnicProfilesSelected(selectedRows)}
        // clickableColumnIndex={[0]}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <VnicProfileActionButtons actionType="context"
            status={row?.status}            
          />,
        ]}
      />

      <SelectedIdView items={vnicProfilesSelected} />

      {/* vNIC Profile 모달창 */}
      <VnicProfileModals
        vnicProfile={activeModal() === "edit" ? vnicProfilesSelected[0] : null}
        networkId={networkId}
      />
    </div>
  );
};

export default VnicProfileDupl;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useSearch from "../../hooks/useSearch"; // ✅ 검색 기능 추가
import TemplateActionButtons from "./TemplateActionButtons";
import TemplateModals from "../modal/template/TemplateModals";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import SelectedIdView from "../common/SelectedIdView";
import Logger from "../../utils/Logger";
import useGlobal from "../../hooks/useGlobal";

const TemplateDupl = ({
  templates = [], 
  columns = [], 
  type,
  showSearchBox = true,  // ✅ 검색 여부 추가
  refetch,
  isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState()
  const { templatesSelected, setTemplatesSelected } = useGlobal();

  // ✅ 데이터 변환 (검색을 위한 `searchText` 필드 추가)
  const transformedData = (!Array.isArray(templates) ? [] : templates).map((temp) => ({
    ...temp,
    _name: (
      <TableRowClick type="template" id={temp?.id}>
        {temp?.name}
      </TableRowClick>
    ),
    cluster: (
      <TableRowClick type="cluster" id={temp?.clusterVo?.id}>
        {temp?.clusterVo?.name}
      </TableRowClick>
    ),
    dataCenter: (
      <TableRowClick type="datacenter" id={temp?.dataCenterVo?.id}>
        {temp?.dataCenterVo?.name}
      </TableRowClick>
    ),
    searchText: `${temp?.name} ${temp?.clusterVo?.name || ""} ${temp?.dataCenterVo?.name || ""}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = (id) => navigate(`/computing/templates/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`TemplateDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug(`TemplateDupl ...`)
  return (
    <>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>)}
        <TemplateActionButtons />
      </div>

      {/* 테이블 컴포넌트 */}
      <TablesOuter
        columns={columns}
        data={filteredData} // ✅ 검색 필터링된 데이터 사용
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setTemplatesSelected(selectedRows)}
        // clickableColumnIndex={[0]}
        searchQuery={searchQuery} // ✅ 검색어 전달
        setSearchQuery={setSearchQuery} // ✅ 검색어 변경 가능하도록 추가
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        onContextMenuItems={(row) => [
          <TemplateActionButtons actionType="context"
            status={row?.status}
          />,
        ]}
      />

      <SelectedIdView items={templatesSelected} />

      {/* 템플릿 모달창 */}
      <TemplateModals template={templatesSelected[0]} />
    </>
  );
};

export default TemplateDupl;

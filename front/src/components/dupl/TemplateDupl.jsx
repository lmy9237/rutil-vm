import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TemplateActionButtons  from "@/components/dupl/TemplateActionButtons";
import Localization           from "@/utils/Localization";

const TemplateDupl = ({
  templates = [],  columns = [],
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const {
    templatesSelected, setTemplatesSelected
  } = useGlobal();

  // ✅ 데이터 변환 (검색을 위한 `searchText` 필드 추가)
  const transformedData = [...templates].map((temp) => ({
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
    status: (temp?.status).toUpperCase(),
    creationTime: temp?.creationTime === "2008. 04. 01. 06:00:00" ? "" : temp?.creationTime,
    version: "",
    searchText: `${temp?.name} ${temp?.clusterVo?.name || ""} ${temp?.dataCenterVo?.name || ""}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = useCallback((id) => {
    navigate(`/computing/templates/${id}`);
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
        <TemplateActionButtons />
      </div>
      <TablesOuter target={"template"}
        columns={columns}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => setTemplatesSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={templatesSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.TEMPLATE}`}
        path="templates"
      />
    </>
  );
};

export default TemplateDupl;

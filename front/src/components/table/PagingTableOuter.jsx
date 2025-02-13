import React from "react";
import PagingTable from "./PagingTable";
import "./Table.css";

const PagingTableOuter = ({
  isLoading, isError, isSuccess,
  columns, data, onRowClick,
  shouldHighlight1stCol = false,
  clickableColumnIndex,
  itemsPerPage = 15,
  showSearchBox = true,
}) => {
  
  console.log("...")
  return (
    <div className="section-table-outer">
      <PagingTable
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        clickableColumnIndex={clickableColumnIndex} // 클릭 가능 컬럼 전달
        itemsPerPage={itemsPerPage} // 페이지당 표시할 항목 수
        showSearchBox={showSearchBox} // 검색 박스 표시 여부 제어
      />
    </div>
  );
};

export default PagingTableOuter;

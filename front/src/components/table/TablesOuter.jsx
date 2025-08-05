import { useMemo } from "react";
import Tables                 from "@/components/table/Tables";
import "./Table.css";

/**
 * @name TablesOuter
 * @description 테이블+ 컴포넌트
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} 테이블+ 컴포넌트
 */
const TablesOuter = ({
  target, columns = [], data = [],
  filterAccessor="",
  searchQuery, setSearchQuery,
  isRefetching, isLoading, isError, isSuccess,
  filterType, setFilterType,
  shouldHighlight1stCol = false,
  onRowClick,
  clickableColumnIndex,
  selectedRowIds = [], 
  onClickableColumnClick,
}) => {

  const filteredData = useMemo(() => { // 필터링만 수행
    return [...data]
      .filter(row => 
        filterType === "all" || row[filterAccessor] === filterType
      )
      .filter(row => (
        (!!row?.searchText) // 검색어가 있을 때만 필터처리
          ? row?.searchText?.includes?.(searchQuery?.toLowerCase?.())
          : true
      ));
  }, [data, filterType, searchQuery, isRefetching]);

  return (
    <>
      <div className="section-table-outer w-full">
        <Tables target={target} 
          columns={columns} 
          data={filteredData} 
          filterType={filterType} setFilterType={setFilterType}
          /* filters={filters} filterAccessor={filterAccessor} filterSelected={filterSelected}*/
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          onRowClick={onRowClick}
          clickableColumnIndex={clickableColumnIndex}
          shouldHighlight1stCol={shouldHighlight1stCol}
          // onContextMenuItems={onContextMenuItems}
          onClickableColumnClick={onClickableColumnClick}
          selectedRowIds={selectedRowIds} 
          isRefetching={isRefetching} isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        />
      </div>
    </>
  );
};

export default TablesOuter;
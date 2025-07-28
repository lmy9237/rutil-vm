import useSearch              from "@/hooks/useSearch";
import useTabFilter           from "@/hooks/useTabFilter";
import Tables                 from "@/components/table/Tables";
import Logger                 from "@/utils/Logger";
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
  /*
  searchQuery, setSearchQuery,
  */
  isRefetching, isLoading, isError, isSuccess,
  shouldHighlight1stCol = false,
  onRowClick,
  clickableColumnIndex,
  onClickableColumnClick,
}) => {
  const { 
    searchQuery, setSearchQuery, 
    filterType, setFilterType,
    filteredData
  } = useSearch(data, filterAccessor);

  return (
    <>
      <div className="section-table-outer w-full">
        <Tables target={target} 
          columns={columns} 
          data={filteredData} // ✅ 검색 필터링된 데이터 전달
          filterType={filterType} setFilterType={setFilterType}
          /* filters={filters} filterAccessor={filterAccessor} filterSelected={filterSelected}*/
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          onRowClick={onRowClick}
          clickableColumnIndex={clickableColumnIndex}
          shouldHighlight1stCol={shouldHighlight1stCol}
          // onContextMenuItems={onContextMenuItems}
          onClickableColumnClick={onClickableColumnClick}
          isRefetching={isRefetching} isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        />
      </div>
    </>
  );
};

export default TablesOuter;

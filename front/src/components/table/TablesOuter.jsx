import Tables from "./Tables";
import useSearch from "../button/useSearch"; // ✅ 검색 기능 추가
import Logger from "../../utils/Logger";
import "./Table.css";

/**
 * @name TablesOuter
 * @description 테이블+ 컴포넌트
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} 테이블+ 컴포넌트
 */
const TablesOuter = ({
  isLoading, isError, isSuccess,
  columns = [],
  data = [],
  shouldHighlight1stCol = false,
  onRowClick,
  clickableColumnIndex,
  onContextMenuItems,
  onClickableColumnClick,
  showSearchBox = false,
}) => {
  const { searchQuery, setSearchQuery, filteredData } = useSearch(data, columns); // ✅ 검색 기능 추가

  Logger.debug(`넘어오는 데이터: ${filteredData.length}개`);
  return (
    <>
      <div className="section-table-outer">
        <Tables
          isLoading={isLoading}
          isError={isError}
          isSuccess={isSuccess}
          columns={columns}
          data={filteredData} // ✅ 검색 필터링된 데이터 전달
          searchQuery={searchQuery} // ✅ 검색어 전달
          setSearchQuery={setSearchQuery} // ✅ 검색어 변경 함수 전달
          showSearchBox={showSearchBox}
          onRowClick={onRowClick}
          clickableColumnIndex={clickableColumnIndex}
          shouldHighlight1stCol={shouldHighlight1stCol}
          onContextMenuItems={onContextMenuItems}
          onClickableColumnClick={onClickableColumnClick}
        />
      </div>
    </>
  );
};

export default TablesOuter;

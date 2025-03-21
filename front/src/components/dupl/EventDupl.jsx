import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import PagingTableOuter from "../../components/table/PagingTableOuter";
import { EventSeverityIcon } from "../icons/RutilVmIcons";
import SearchBox from "../button/SearchBox";
import useSearch from "../button/useSearch";

/**
 * @name HostEvents
 * @description 호스트에 종속 된 이벤트 목록
 * (/computing/hosts/<hostId>/events)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const EventDupl = ({
  isLoading,
  isError,
  isSuccess,
  events = [],
  handleRowClick,
  showSearchBox = true,
}) => {
  const transformedData = events.map((e) => ({
    ...e,
    _severity: EventSeverityIcon(e?.severity),
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  console.log("...");
  return (
    <>
      <div className="dupl-header-group">
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
      </div>

      <PagingTableOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={TableColumnsInfo.EVENTS}
        data={filteredData}
        onRowClick={handleRowClick}
        showSearchBox={showSearchBox} // 검색 박스 표시 여부 제어
      />
    </>
  );
};

export default EventDupl;

import { useState } from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import { EventSeverityIcon } from "../icons/RutilVmIcons";
import SearchBox from "../button/SearchBox";
import useSearch from "../button/useSearch";
import TablesOuter from "../table/TablesOuter";

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
  const [selectedEvents, setSelectedEvents] = useState([]);

  const transformedData = events.map((e) => ({
    ...e,
    _severity: EventSeverityIcon(e?.severity),
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const selectedIds = (
    Array.isArray(selectedEvents) ? selectedEvents : []
  ).map((e) => e.id).join(", ");
  
  console.log("...");
  return (
    <>
      <span>ID: {selectedIds}</span>
      <div className="dupl-header-group">
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
      </div>

      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={TableColumnsInfo.EVENTS}
        data={filteredData}
        onRowClick={(selectedRows) => setSelectedEvents(selectedRows)}
        multiSelect={true}
        showSearchBox={showSearchBox} // 검색 박스 표시 여부 제어
      />
    </>
  );
};

export default EventDupl;

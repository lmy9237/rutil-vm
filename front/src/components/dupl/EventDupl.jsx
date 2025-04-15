import toast from "react-hot-toast";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import { severity2Icon } from "../icons/RutilVmIcons";
import SearchBox from "../button/SearchBox";
import TablesOuter from "../table/TablesOuter";
import SelectedIdView from "../common/SelectedIdView";
import Logger from "../../utils/Logger";

/**
 * @name HostEvents
 * @description 호스트에 종속 된 이벤트 목록
 * (/computing/hosts/<hostId>/events)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const EventDupl = ({
  events = [],
  showSearchBox=true,
  refetch, isLoading, isError, isSuccess,
}) => {
  const { eventsSelected, setEventsSelected } = useGlobal()
  const transformedData = (!Array.isArray(events) ? [] : events).map((e) => ({
    ...e,
    _severity: severity2Icon(e?.severity),
  }))
  
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = () =>  {
    Logger.debug(`EventDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug("EventDupl ...");
  return (
    <>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />)}
      </div>

      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={TableColumnsInfo.EVENTS}
        data={filteredData}
        onRowClick={(selectedRows) => setEventsSelected(selectedRows)}
        multiSelect={true}
        showSearchBox={showSearchBox} // 검색 박스 표시 여부 제어
      />
      
      <SelectedIdView items={eventsSelected} />
    </>
  );
};

export default EventDupl;

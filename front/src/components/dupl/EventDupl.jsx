import { useCallback } from "react";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import EventActionButtons     from "@/components/dupl/EventActionButtons";
import {
  severity2Icon
} from "@/components/icons/RutilVmIcons";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

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
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const { eventsSelected, setEventsSelected } = useGlobal()
  const transformedData = [...events].map((e) => ({
    ...e,
    _severity: severity2Icon(e?.severity),
  }))
  
  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
        <EventActionButtons />
      </div>
      <TablesOuter target={"event"}
        columns={TableColumnsInfo.EVENTS}
        data={filteredData}
        multiSelect={true}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => {setEventsSelected(selectedRows)}}
        /*onClickableColumnClick={(row) => handleNameClick(row.id)}*/
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={eventsSelected} />
      <OVirtWebAdminHyperlink name={`${Localization.kr.EVENT}>${Localization.kr.EVENT}`} path="events" />
    </>
  );
};

export default EventDupl;

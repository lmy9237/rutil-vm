import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import PagingTableOuter from '../../components/table/PagingTableOuter';
import { renderSeverityIcon } from '../../components/Icon';

/**
 * @name HostEvents
 * @description 호스트에 종속 된 이벤트 목록
 * (/computing/hosts/<hostId>/events)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const EventDupl = ({ 
  isLoading, isError, isSuccess,
  events=[], handleRowClick, showSearchBox = true
}) => {
  console.log("...")
  return (
    <>
      <PagingTableOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={TableColumnsInfo.EVENTS}
        data={events.map((e) => ({
          ...e,
          severity: renderSeverityIcon(e?.severity),
        }))}
        onRowClick={handleRowClick}
        showSearchBox={showSearchBox} // 검색 박스 표시 여부 제어
      />
    </>
  );
};

export default EventDupl;

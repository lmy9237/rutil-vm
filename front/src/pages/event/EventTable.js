import PagingTableOuter from '../../components/table/PagingTableOuter';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { renderSeverityIcon } from '../../components/Icon';

/**
 * @name EventTable
 * @description ...
 * 
 * @param {Array} domains,
 * @returns
 */
const EventTable = ({ 
  isLoading, isError, isSuccess,
  events =[]}
) => {
  return (
    <>
      <PagingTableOuter
        columns={TableColumnsInfo.EVENTS}
        data={events.map((e) => ({
          ...e,
          severity: renderSeverityIcon(e?.severity),
        }))}
        showSearchBox={true}
      />
    </>
  );
};

export default EventTable;

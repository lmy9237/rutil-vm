import React from 'react';
import PagingTableOuter from '../../components/table/PagingTableOuter';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { renderSeverityIcon } from '../../utils/Icon';

const EventTable = ({ events =[]} ) => {
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

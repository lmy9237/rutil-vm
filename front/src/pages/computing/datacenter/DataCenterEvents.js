import React from 'react';
import { useEventsFromDataCenter } from '../../../api/RQHook';
import EventTable from '../../event/EventTable';

/**
 * @name DataCenterEvents
 * @description ...
 * 
 * @param {boolean} openModal,
 * @returns
 * 
 */
const DataCenterEvents = ({ 
  datacenterId
}) => {
  const {
    data: events = [], 
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
  } = useEventsFromDataCenter(datacenterId, (e) => ({ ...e }));

  return (
    <>
      <EventTable events={events}
        isLoading={isEventsLoading}
        isError={isEventsError}
        isSuccess={isEventsSuccess}
      />
    </>
  );
};

export default DataCenterEvents;
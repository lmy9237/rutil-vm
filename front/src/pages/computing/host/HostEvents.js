import React from 'react';
import { useEventFromHost } from "../../../api/RQHook";
import EventTable from '../../../pages/event/EventTable';

/**
 * @name HostEvents
 * @description 호스트에 종속 된 이벤트 목록
 * (/computing/datacenters/<datacenterId>/clusters)
 * 
 * @param {string} hostId 호스트 ID
 * @returns
 */
const HostEvents = ({ hostId }) => {
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
  } = useEventFromHost(hostId, (e) => ({ ...e }));

  return (
    <>
      <EventTable events={events} />
    </>
  );
};

export default HostEvents;
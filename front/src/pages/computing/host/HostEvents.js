import React from 'react';
import {useEventFromHost} from "../../../api/RQHook";
import EventTable from '../../../pages/event/EventTable';

const HostEvents = ({ hostId }) => {
  const { 
    data: events = [], isLoading: isEventsLoading,
  } = useEventFromHost(hostId, (e) => ({ ...e }));
  
  return (
    <>
      <EventTable events={events}/>
    </>
  );
};

export default HostEvents;
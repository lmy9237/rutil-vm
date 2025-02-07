import React from 'react';
import { useAllEventFromVM } from '../../../api/RQHook';
import EventTable from '../../event/EventTable';

const VmEvents = ({ vmId }) => {
  const {
    data: events = [], isLoading: isEventsLoading,
  } = useAllEventFromVM(vmId, (e) => ({ ...e }));

  return (
    <>
      <EventTable events={events}/>
    </>
  );
};

export default VmEvents;

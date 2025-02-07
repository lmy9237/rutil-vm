import React from 'react';
import {useEventFromCluster} from "../../../api/RQHook";
import EventTable from '../../event/EventTable';

const ClusterEvents = ({ clusterId }) => {
  const { 
    data: events = [], isLoading: isEventsLoading,
  } = useEventFromCluster(clusterId, (e) => ({ ...e }));
  
  return (
    <>
      <EventTable events={events}/>
    </>
  );
};
  
export default ClusterEvents;
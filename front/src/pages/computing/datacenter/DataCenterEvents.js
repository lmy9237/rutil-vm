import React from 'react';
import '../datacenter/css/DataCenter.css';
import { useEventsFromDataCenter } from '../../../api/RQHook';
import EventTable from '../../event/EventTable';

const DataCenterEvents = ({ datacenterId }) => {
  const {
    data: events = [], isLoading: isEventsLoading,
  } = useEventsFromDataCenter(datacenterId, (e) => ({ ...e }));
  
  return (
    <>
      <EventTable events={events}/>
    </>
  );
};

export default DataCenterEvents;
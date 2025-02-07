import React from 'react';
import {useAllEventFromTemplate, useEventFromCluster} from "../../../api/RQHook";
import EventTable from '../../event/EventTable';

const TemplateEvents = ({ templateId }) => {
  const { 
    data: events = [], isLoading: isEventsLoading
  } = useAllEventFromTemplate(templateId, (e) => ({ ...e }));
  
  return (
    <>
      <EventTable events={events}/>
    </>
  );
};
  
export default TemplateEvents;
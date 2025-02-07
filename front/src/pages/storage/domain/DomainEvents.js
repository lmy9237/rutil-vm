import {useAllEventFromDomain} from "../../../api/RQHook";
import EventTable from "../../event/EventTable";

const DomainEvents = ({ domainId }) => {
  const { 
    data: events = [], isLoading: isEventsLoading, 
  } = useAllEventFromDomain(domainId, (e) => ({ ...e}));
  
  return (
    <>
      <EventTable events={events} />
    </>
  );
};

export default DomainEvents;
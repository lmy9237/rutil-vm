import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useEventsFromDataCenter} from "../../../api/RQHook";
import EventDu from "../../duplication/EventDu";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import TableColumnsInfo from "../../table/TableColumnsInfo";



const DatacenterEvent = ({ dataCenter }) => {

    const { 
        data: events, 
        status: eventsStatus, 
        isLoading: isEventsLoading, 
        isError: isEventsError 
      } = useEventsFromDataCenter(dataCenter?.id, toTableItemPredicateEvents);
      function toTableItemPredicateEvents(event) {
        const severity= event?.severity ?? '';
        const icon = severity === 'NORMAL' 
        ? <FontAwesomeIcon icon={faCheckCircle} fixedWidth style={{ color: 'green', fontSize: '0.3rem' }} />
        : <FontAwesomeIcon icon={faTimesCircle} fixedWidth style={{ color: 'red', fontSize: '0.3rem' }} />
        return {
          severity: icon,                      
          time: event?.time ?? '',                
          description: event?.description ?? 'No message', 
          correlationId: event?.correlationId ?? '',
          source: event?.source ?? 'ovirt',     
          userEventId: event?.userEventId ?? '',   
        };
      }

    return (
        <EventDu 
            columns={TableColumnsInfo.EVENTS}
            data={events}
            handleRowClick={() => console.log('Row clicked')}
        />
    );
  };
  
  export default DatacenterEvent;
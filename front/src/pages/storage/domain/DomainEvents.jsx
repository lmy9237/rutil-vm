import EventDupl from "../../../components/dupl/EventDupl";
import { useAllEventsFromDomain } from "../../../api/RQHook";

/**
 * @name DomainEvents
 * @description 도메인에 종속 된 이벤트 목록
 * (/computing/domains/<clusterId>/events)
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainEvents
 */
const DomainEvents = ({ domainId }) => {
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
  } = useAllEventsFromDomain(domainId, (e) => ({
    ...e,
  }));

  return (
    <EventDupl events={events}
      refetch={refetchEvents}
      isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
    />
  );
};

export default DomainEvents;

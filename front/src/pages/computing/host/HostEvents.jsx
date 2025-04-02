import EventDupl from "../../../components/dupl/EventDupl";
import { useEventsFromHost } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name HostEvents
 * @description 호스트에 종속 된 이벤트 목록
 * (/computing/hosts/<hostId>/events)
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
    refetch: refetchEvents,
  } = useEventsFromHost(hostId, (e) => ({ ...e }));

  Logger.debug("HostEvents ...");
  return (
    <EventDupl events={events}
      refetch={refetchEvents}
      isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
    />
  );
};

export default HostEvents;

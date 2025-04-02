import EventDupl from "../../../components/dupl/EventDupl";
import Logger from "../../../utils/Logger";
import { useEventFromCluster } from "../../../api/RQHook";

/**
 * @name ClusterEvents
 * @description 클러스터에 종속 된 이벤트 목록
 * (/computing/clusters/<clusterId>/events)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterEvents = ({ clusterId }) => {
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents
  } = useEventFromCluster(clusterId, (e) => ({ 
    ...e
  }));

  Logger.debug("...");
  return (
    <EventDupl events={events}
      refetch={refetchEvents}
      isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
    />
  );
};

export default ClusterEvents;

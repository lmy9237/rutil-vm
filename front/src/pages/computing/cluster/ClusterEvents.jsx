import EventDupl from "../../../components/dupl/EventDupl";
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
  } = useEventFromCluster(clusterId, (e) => ({ ...e }));

  console.log("...");
  return (
    <>
      <EventDupl
        isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
        events={events}
      />
    </>
  );
};

export default ClusterEvents;

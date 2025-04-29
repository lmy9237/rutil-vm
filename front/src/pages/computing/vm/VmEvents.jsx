import EventDupl from "../../../components/dupl/EventDupl";
import { useAllEventsFromVM } from '../../../api/RQHook';
import Logger from "../../../utils/Logger";

/**
 * @name VmEvents
 * @description 가상머신에 종속 된 이벤트 목록
 * (/computing/vms/<clusterId>/events)
 *
 * @param {string} clusterId 가상머신ID
 * @returns
 */
const VmEvents = ({ vmId }) => {
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
  } = useAllEventsFromVM(vmId, (e) => ({ ...e }));

  return (
    <EventDupl events={events}
      refetch={refetchEvents}
      isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
    />
  );
};

export default VmEvents;

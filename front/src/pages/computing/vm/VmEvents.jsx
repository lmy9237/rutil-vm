import EventDupl from "../../../components/dupl/EventDupl";
import { useAllEventFromVM } from '../../../api/RQHook';

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
  } = useAllEventFromVM(vmId, (e) => ({ ...e }));

  return (
    <>
      <EventDupl
        isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
        events={events}
      />
    </>
  );
};

export default VmEvents;

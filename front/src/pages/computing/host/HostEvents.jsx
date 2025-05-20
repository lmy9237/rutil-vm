import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import EventDupl from "../../../components/dupl/EventDupl";
import { useEventsFromHost } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name HostEvents
 * @description 호스트에 종속 된 이벤트 목록
 * (/computing/hosts/<hostId>/events)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const HostEvents = ({
  hostId
}) => {
  const { hostsSelected } = useGlobal()
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
    isRefetching: isEventsRefetching,
  } = useEventsFromHost(hostId, (e) => ({ ...e }));

  return (
    <>
      <EventDupl events={events}
        refetch={refetchEvents} isRefetching={isEventsRefetching}
        isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.HOST}>${hostsSelected[0]?.name}`}
        path={`hosts-events;name=${hostsSelected[0]?.name}`} 
      />
    </>
  );
};

export default HostEvents;

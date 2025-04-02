import HeaderButton from "../../components/button/HeaderButton";
import EventDupl from "../../components/dupl/EventDupl";
import { rvi24Event } from "../../components/icons/RutilVmIcons";
import Localization from "../../utils/Localization";
import { useAllEvents } from "../../api/RQHook";

/**
 * @name Event
 * @description 이벤트
 * (/events)
 *
 * @returns
 */
const Event = () => {
  const {
    data: events,
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents
  } = useAllEvents((e) => ({
    ...e,
  }));

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Event()}
        title={Localization.kr.EVENT}
        subtitle="Chart"
        buttons={[]}
        popupItems={[]}
        openModal={[]}
        togglePopup={() => {}}
      />
      <div className="content-outer">
        <div className="section-content w-full">
          <EventDupl events={events}
            refetch={refetchEvents}
            isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Event;

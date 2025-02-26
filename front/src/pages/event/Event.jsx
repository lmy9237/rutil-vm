import { faListUl } from "@fortawesome/free-solid-svg-icons";
import HeaderButton from "../../components/button/HeaderButton";
import EventDupl from "../../components/dupl/EventDupl";
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
  } = useAllEvents((e) => ({
    ...e,
  }));

  console.log("...");
  return (
    <div id="section">
      <HeaderButton
        titleIcon={faListUl}
        title="Event"
        subtitle="Chart"
        buttons={[]}
        popupItems={[]}
        openModal={[]}
        togglePopup={() => {}}
      />
      <div className="content-outer">
        <div className="section-content w-full">
          <EventDupl
            isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
            events={events}
          />
        </div>
      </div>
    </div>
  );
};

export default Event;

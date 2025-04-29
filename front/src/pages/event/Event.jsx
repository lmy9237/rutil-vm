import HeaderButton from "../../components/button/HeaderButton";
import EventDupl from "../../components/dupl/EventDupl";
import Localization from "../../utils/Localization";
import { rvi24Event } from "../../components/icons/RutilVmIcons";
import { useAllEvents } from "../../api/RQHook";
import SectionLayout from "../../components/SectionLayout";

/**
 * @name AllEvents
 * @description 이벤트
 * (/events)
 *
 * @returns
 */
const AllEvents = () => {
  const {
    data: events,
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents
  } = useAllEvents({
    mapPredicate: (e) => ({
      ...e,
    })
  });

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Event()}
        title={Localization.kr.EVENT}
        subtitle="Chart"
        buttons={[]}
        popupItems={[]}
        openModal={[]}
        togglePopup={() => {}}
      />
      <div className="content-outer">
        <div className="section-content v-start gap-8 w-full">
          <EventDupl events={events}
            refetch={refetchEvents}
            isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
          />
        </div>
      </div>
    </SectionLayout>
  );
};

export default AllEvents;

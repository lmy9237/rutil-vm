import EventDupl from "../../../components/dupl/EventDupl";
import { useAllEventFromTemplate } from "../../../api/RQHook";

/**
 * @name TemplateEvents
 * @description 탬플릿에 종속 된 이벤트 목록
 * (/computing/templates/<clusterId>/events)
 *
 * @param {string} templateId 탬플릿ID
 * @returns
 */
const TemplateEvents = ({ templateId }) => {
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
  } = useAllEventFromTemplate(templateId, (e) => ({ ...e }));

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

export default TemplateEvents;

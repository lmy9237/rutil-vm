import EventDupl from "../../../components/dupl/EventDupl";
import { useAllEventFromTemplate } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

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
    refetch: refetchEvents
  } = useAllEventFromTemplate(templateId, (e) => ({ ...e }));

  Logger.debug("TemplateEvents ...");
  return (
    <EventDupl events={events}
      refetch={refetchEvents}
      isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
    />
  );
};

export default TemplateEvents;

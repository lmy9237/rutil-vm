import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import EventDupl from "../../../components/dupl/EventDupl";
import { useAllEventFromTemplate } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name TemplateEvents
 * @description 탬플릿에 종속 된 이벤트 목록
 * (/computing/templates/<clusterId>/events)
 *
 * @param {string} templateId 탬플릿ID
 * @returns
 */
const TemplateEvents = ({
  templateId
}) => {
  const {
    templatesSelected
  } = useGlobal()

  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
    isRefetching: isEventsRefetching,
  } = useAllEventFromTemplate(templateId, (e) => ({ ...e }));

  return (
    <>
      <EventDupl events={events}
        refetch={refetchEvents} isRefetching={isEventsRefetching}
        isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.TEMPLATE}>${templatesSelected[0]?.name}`}
        path={`templates-events;name=${templatesSelected[0]?.name}`} 
      />
    </>
  );
};

export default TemplateEvents;

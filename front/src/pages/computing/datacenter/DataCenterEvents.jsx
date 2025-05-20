import React from "react";
import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import EventDupl from "../../../components/dupl/EventDupl";
import { useEventsFromDataCenter } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name DataCenterEvents
 * @description 데이터센터에 종속 된 이벤트 목록
 * (/computing/datacenters/<datacenterId>/events)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterEvents = ({
  datacenterId
}) => {
  const { datacentersSelected } = useGlobal()
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
    isRefetching: isEventsRefetching,
  } = useEventsFromDataCenter(datacenterId, (e) => ({ ...e }));

  return (
    <>
      <EventDupl events={events}
        refetch={refetchEvents} isRefetching={isEventsRefetching}
        isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
      />
      <OVirtWebAdminHyperlink 
        name={`${Localization.kr.COMPUTING}>${Localization.kr.DATA_CENTER}>${datacentersSelected[0]?.name}`} 
        path={`dataCenters-events;name=${datacentersSelected[0]?.name}`} 
      />
    </>
  );
};

export default DataCenterEvents;

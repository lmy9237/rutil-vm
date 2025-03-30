import React from "react";
import EventDupl from "../../../components/dupl/EventDupl";
import { useEventsFromDataCenter } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name DataCenterEvents
 * @description 데이터센터에 종속 된 이벤트 목록
 * (/computing/datacenters/<datacenterId>/events)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterEvents = ({ datacenterId }) => {
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
  } = useEventsFromDataCenter(datacenterId, (e) => ({ ...e }));

  Logger.debug("...")
  return (
    <>
      <EventDupl
        isLoading={isEventsLoading} isError={isEventsError} isSuccess={isEventsSuccess}
        events={events}
      />
    </>
  );
};

export default DataCenterEvents;

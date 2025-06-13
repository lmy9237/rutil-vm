import React, { useEffect, useState } from "react";
import CONSTANT                         from "@/Constants";
import useGlobal                        from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import EventDupl                        from "@/components/dupl/EventDupl";
import {
  useAllEventsFromDataCenter
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";

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
  const [currentPageIdx, setCurrentPageIdx] = useState(0);

  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
    isRefetching: isEventsRefetching,
  } = useAllEventsFromDataCenter({
    page: currentPageIdx,
    size: CONSTANT.queryMaxSize,
    datacenterId: datacenterId,
    mapPredicate: (e) => ({
      ...e,
    })
  });

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

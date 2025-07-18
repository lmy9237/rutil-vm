import React, { useEffect, useState } from "react";
import CONSTANT                         from "@/Constants";
import useGlobal                        from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import EventDupl                        from "@/components/dupl/EventDupl";
import {
  useAllEventsFromVM
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";


/**
 * @name VmEvents
 * @description 가상머신에 종속 된 이벤트 목록
 * (/computing/vms/<clusterId>/events)
 *
 * @param {string} clusterId 가상머신ID
 * @returns
 */
const VmEvents = ({
  vmId
}) => {
  const { vmsSelected, } = useGlobal();
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
    isRefetching: isEventsRefetching,
  } = useAllEventsFromVM({
    page: currentPageIdx,
    size: CONSTANT.queryMaxSize,
    vmId: vmId,
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
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-events;name=${vmsSelected[0]?.name}`} 
      />
    </>
  );
};

export default VmEvents;

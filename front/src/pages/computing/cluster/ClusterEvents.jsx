import React, { useEffect, useState } from "react";
import CONSTANT                         from "@/Constants";
import useGlobal                        from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import EventDupl                        from "@/components/dupl/EventDupl";
import {
  useAllEventsFromCluster
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";

/**
 * @name ClusterEvents
 * @description 클러스터에 종속 된 이벤트 목록
 * (/computing/clusters/<clusterId>/events)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterEvents = ({
  clusterId
}) => {
  const { clustersSelected } = useGlobal()
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
    isRefetching: isEventsRefetching,
  } = useAllEventsFromCluster({
    page: currentPageIdx,
    size: CONSTANT.queryMaxSize,
    clusterId: clusterId,
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
        name={`${Localization.kr.COMPUTING}>${Localization.kr.CLUSTER}>${clustersSelected[0]?.name}`}
        path={`clusters-events;name=${clustersSelected[0]?.name}`} 
      />
    </>
  );
};

export default ClusterEvents;

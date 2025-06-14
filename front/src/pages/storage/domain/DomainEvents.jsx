import React, { useEffect, useState } from "react";
import CONSTANT                         from "@/Constants";
import useGlobal                        from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import EventDupl                        from "@/components/dupl/EventDupl";
import {
  useAllEventsFromDomain
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";

/**
 * @name DomainEvents
 * @description 도메인에 종속 된 이벤트 목록
 * (/computing/domains/<clusterId>/events)
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainEvents
 */
const DomainEvents = ({
  domainId
}) => {
  const { domainsSelected, } = useGlobal();
  const [currentPageIdx, setCurrentPageIdx] = useState(0);

  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents,
    isRefetching: isEventsRefetching,
  } = useAllEventsFromDomain({
    page: currentPageIdx,
    size: CONSTANT.queryMaxSize,
    storageDomainId: domainId,
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
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-events;name=${domainsSelected[0]?.name}`}
      />
    </>
  );
};

export default DomainEvents;

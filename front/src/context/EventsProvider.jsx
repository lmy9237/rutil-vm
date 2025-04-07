// GlobalContext.js
import React, { createContext } from 'react';
import { useAllEvents } from "../api/RQHook";
import Logger from '../utils/Logger';

const EventContext = createContext();

/**
 * @name EventsProvider
 * @description 이벤트 관련 정보 전역 제공공
 * 
 * @param {*} param0 
 * 
 * @returns {React.Provider}
 */
export const EventsProvider = ({ children }) => {
  
  const {
    data: events = [],
    isLoading: isEventsLoading,
    isError: isEventsError,
    isSuccess: isEventsSuccess,
    refetch: refetchEvents
  } = useAllEvents({
    mapPredicate: (e) => ({
      ...e,
    })
  });

  Logger.debug("EventsProvider ...")
  return (
    <EventContext.Provider value={{ events, isEventsLoading, isEventsError, isEventsSuccess, refetchEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;
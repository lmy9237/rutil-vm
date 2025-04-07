import { useContext, }  from "react";
import EventsContext from "../context/EventsProvider"

const useEvents = () => {
  return useContext(EventsContext)
}

export default useEvents;
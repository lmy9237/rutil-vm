import { useContext, }  from "react";
import JobQueueContext from "../context/JobQueueProvider";

const useJobQueue = () => {
  return useContext(JobQueueContext)
}

export default useJobQueue;
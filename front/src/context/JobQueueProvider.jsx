// JobQueueContext.jsx
import React, { createContext, useEffect, useState } from "react";
import {
  useAddJob,
  useEndJob,
} from "../api/RQHook";

import Logger from "../utils/Logger";

const JobQueueContext = createContext();

const initialJobFormState = {
  name: "디스크 파일 업로드",
  description: "(RutilVM에서) 디스크 파일 업로드",
  status: 'STARTED',
  autoCleared: true,
}

/**
 * @name JobQueueProvider
 * @description FIFO 형태의 최근작업 처리 목록
 * 
 * @param {*} param0 
 * 
 * @returns {React.Provider}
 */
export const JobQueueProvider = ({ children }) => {
  const [jobFormState, setJobFormState] = useState(initialJobFormState)
  // const [jobsInQueue, setJobsInQueue] = useState([]);
  const [jobIdsInQueue, setJobIdsInQueue] = useState([]);

  const onlyFileName = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf(".");
    return lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
  };

  const {
    mutate: addJob
  } = useAddJob((res) => {
    /*setJobsInQueue((prev) => 
      [...prev, res]
    )*/
    setJobIdsInQueue((prev) => 
      [...prev, res.id]
    )
  }, () => {});

  const addFileUploadJobInQueue = (file) => {
    Logger.debug(`JobQueueProvider > addFileUploadJobInQueue ... file: `, onlyFileName(file?.name))
    addJob({
      ...jobFormState,
      description: `(RutilVM) 디스크 파일 업로드 (파일명: ${file && onlyFileName(file?.name)})`,
    })
  }

  const {
    mutate: endJob
  } = useEndJob()

  const popLastFileUploadJobInQueue = () => {
    // const job2End = jobsInQueue.pop()
    const jobId2End = jobIdsInQueue.pop()
    // Logger.debug(`JobQueueProvider > popLastFileUploadJobInQueue ... job2End: `, job2End, `, jobId2End: ${jobId2End}`)
    Logger.debug(`JobQueueProvider > popLastFileUploadJobInQueue ... jobId2End: `, jobId2End)
    // job2End && endJob({ jobId: job2End?.id })
    jobId2End && endJob({ jobId: jobId2End })
  }

  
  return (
    <JobQueueContext.Provider value={{
      addFileUploadJobInQueue, popLastFileUploadJobInQueue
    }}>
      {children}
    </JobQueueContext.Provider>
  )
}

export default JobQueueContext;

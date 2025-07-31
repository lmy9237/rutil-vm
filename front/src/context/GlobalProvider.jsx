// GlobalContext.jsx
import React, { createContext, useState } from "react";
import {
  useDashboardVmCpu,
  useDashboardVmMemory,
  useDashboardStorageMemory,
} from "@/api/RQHook";
import Logger        from "@/utils/Logger";

const GlobalContext = createContext();

/**
 * @name GlobalProvider
 * @description 전역변수 보관 및 제공
 * 
 * @param {*} param0 
 * 
 * @returns {React.Provider}
 */
export const GlobalProvider = ({ children }) => {
  const [datacentersSelected, _setDatacentersSelected] = useState([]);
  const setDatacentersSelected = (newV) => {
    Logger.debug(`GlobalProvider > setDatacentersSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setDatacentersSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setDatacentersSelected([{...newV}]);
  }

  const [clustersSelected, _setClustersSelected] = useState([]);
  const setClustersSelected = (newV) => {
    Logger.debug(`GlobalProvider > setClustersSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setClustersSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setClustersSelected([{...newV}]);
  }

  const [hostsSelected, _setHostsSelected] = useState([]);
  const setHostsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setHostsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setHostsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setHostsSelected([{...newV}]);
  }

  const [hostDevicesSelected, _setHostDevicesSelected] = useState([]);
  const setHostDevicesSelected = (newV) => {
    Logger.debug(`GlobalProvider > setHostDevicesSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setHostDevicesSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setHostDevicesSelected([{...newV}]);
  }

  const [vmsSelected, _setVmsSelected] = useState([]);
  const setVmsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setVmsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setVmsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setVmsSelected([{...newV}]);
  }
  
  const [applicationsSelected, _setApplicationsSelected] = useState([]);
  const setApplicationsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setApplicationsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setApplicationsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setApplicationsSelected([{...newV}]);
  }

  const [snapshotsSelected, _setSnapshotsSelected] = useState([]);
  const setSnapshotsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setSnapshotsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setSnapshotsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setSnapshotsSelected([{...newV}]);
  }

  const [networksSelected, _setNetworksSelected] = useState([]);
  const setNetworksSelected = (newV) => {
    Logger.debug(`GlobalProvider > setNetworksSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setNetworksSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setNetworksSelected([{...newV}]);
  }

  const [networkProvidersSelected, _setNetworkProvidersSelected] = useState([]);
  const setNetworkProvidersSelected = (newV) => {
    Logger.debug(`GlobalProvider > setNetworkProvidersSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setNetworkProvidersSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setNetworkProvidersSelected([{...newV}]);
  }

  const [nicsSelected, _setNicsSelected] = useState([]);
  const setNicsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setNicsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setNicsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setNicsSelected([{...newV}]);
  }

  const [domainsSelected, _setDomainsSelected] = useState([]);
  const setDomainsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setDomainsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setDomainsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setDomainsSelected([{...newV}]);
  }

  const [disksSelected, _setDisksSelected] = useState([]);
  const setDisksSelected = (newV) => {
    Logger.debug(`GlobalProvider > setDisksSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setDisksSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setDisksSelected([{...newV}]);
  }
  
  const [diskProfilesSelected, _setDiskProfilesSelected] = useState([]);
  const setDiskProfilesSelected = (newV) => {
    Logger.debug(`GlobalProvider > setDiskProfilesSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setDiskProfilesSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setDiskProfilesSelected([{...newV}]);
  }
  
  const [lunsSelected, _setLunsSelected] = useState([]);
  const setLunsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setLunsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setLunsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setLunsSelected([{...newV}]);
  }

  const [vnicProfilesSelected, _setVnicProfilesSelected] = useState([]);
  const setVnicProfilesSelected = (newV) => {
    Logger.debug(`GlobalProvider > setVnicProfilesSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setVnicProfilesSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setVnicProfilesSelected([{...newV}]);
  }

  const [templatesSelected, _setTemplatesSelected] = useState([]);
  const setTemplatesSelected = (newV) => {
    Logger.debug(`GlobalProvider > setTemplatesSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setTemplatesSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setTemplatesSelected([{...newV}]);
  }

  const [jobsSelected, _setJobsSelected] = useState([]);
  const setJobsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setJobsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setJobsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setJobsSelected([{...newV}]);
  }

  const [eventsSelected, _setEventsSelected] = useState([]);
  const setEventsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setEventsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setEventsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setEventsSelected([{...newV}]);
  }

  const [providersSelected, _setProvidersSelected] = useState([]);
  const setProvidersSelected = (newV) => {
    Logger.debug(`GlobalProvider > setProvidersSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setProvidersSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setProvidersSelected([{...newV}]);
  }

  const [usersSelected, _setUsersSelected] = useState([]);
  const setUsersSelected = (newV) => {
    Logger.debug(`GlobalProvider > setUsersSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setUsersSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setUsersSelected([{...newV}]);
  }

  const [usersessionsSelected, _setUsersessionsSelected] = useState([]);
  const setUsersessionsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setUsersessionsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setUsersessionsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setUsersessionsSelected([{...newV}]);
  }

  const [certsSelected, _setCertsSelected] = useState([]);
  const setCertsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setCertsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setCertsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setCertsSelected([{...newV}]);
  }

  const [fileUploadQueue, _setFileUploadQueue] = useState([]);
  const newFileUploadQueue = () => {
    _setFileUploadQueue((prev) => {
      Logger.debug(`GlobalProvider > newFileUploadQueue ... newV: ${prev.length+1}`)
      return [
        ...prev, (prev.length+1)
      ]
    })
  }
  const popFileUploadQueue = () => {
    _setFileUploadQueue((prev) => {
      Logger.debug(`GlobalProvider > popFileUploadQueue ... newV: ${prev.length+1}`)
      return [
        ...prev,
      ].slice(1)
    })
  }

  const [currentVncRfb, setCurrentVncRfb] = useState(null);
  const clearCurrentVncRfb = () => setCurrentVncRfb(null);

  const {
    data: top3VmsCpuUsed = [],
    status: vmCpuStatus,
    isRefetching: isVmCpuRefetching,
    refetch: vmCpuRefetch,
    isError: isVmCpuError,
    error: vmCpuError,
    isLoading: isVmCpuLoading,
  } = useDashboardVmCpu();
  

  const {
    data: top3VmsMemUsed = [],
    status: vmMemoryStatus,
    isRefetching: isVmMemoryRefetching,
    refetch: vmMemoryRefetch,
    isError: isVmMemoryError,
    error: vmMemoryError,
    isLoading: isVmMemoryLoading,
  } = useDashboardVmMemory();

  /* 
  const [top3VmsCpuUsed, _setTop3VmsCpuUsed] = useState([]);
  const setTop3VmsCpuUsed = (newV) => {
    Logger.debug(`GlobalProvider > setTop3VmsCpuUsed ... newV: `, newV)
    if (Array.isArray(newV))
      _setTop3VmsCpuUsed([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setTop3VmsCpuUsed([{...newV}]);
  }
  */
  
  const {
    data: top3StoragesUsed = [],
    status: storageMemoryStatus,
    isRefetching: isStorageMemoryRefetching,
    refetch: storageMemoryRefetch,
    isError: isStorageMemoryError,
    error: storageMemoryError,
    isLoading: isStorageMemoryeLoading,
  } = useDashboardStorageMemory();

  const [sourceContext, _setSourceContext] = useState("all"); // "fromDomain" ... 
  const setSourceContext = (newV) => {
    Logger.debug(`GlobalProvider > setSourceContext ... newV: `, newV)
    _setSourceContext(newV ?? "all")
  }

  const clearAllSelected = () => {
    Logger.debug(`GlobalProvider > clearAllSelected ... `)
    setDatacentersSelected([])
    setClustersSelected([])
    setHostsSelected([])
    setHostDevicesSelected([])
    setVmsSelected([])
    setSnapshotsSelected([])
    setNetworksSelected([])
    setNetworkProvidersSelected([])
    setNicsSelected([])
    setDomainsSelected([])
    setDisksSelected([])
    setDiskProfilesSelected([])
    setLunsSelected([])
    setVnicProfilesSelected([])
    setTemplatesSelected([])
    setJobsSelected([])
    setEventsSelected([])
    setProvidersSelected([])
    setUsersSelected([])
    setUsersessionsSelected([])
    setCertsSelected([])
    clearCurrentVncRfb([])
    setSourceContext(null)
  }

  return (
    <GlobalContext.Provider value={{
      datacentersSelected, setDatacentersSelected,
      clustersSelected, setClustersSelected,
      hostsSelected, setHostsSelected,
      hostDevicesSelected, setHostDevicesSelected,
      vmsSelected, setVmsSelected,
      applicationsSelected, setApplicationsSelected,
      snapshotsSelected, setSnapshotsSelected,
      networksSelected, setNetworksSelected,
      networkProvidersSelected, setNetworkProvidersSelected,
      nicsSelected, setNicsSelected,
      domainsSelected, setDomainsSelected,
      disksSelected, setDisksSelected,
      diskProfilesSelected, setDiskProfilesSelected,
      lunsSelected, setLunsSelected,
      vnicProfilesSelected, setVnicProfilesSelected,
      templatesSelected, setTemplatesSelected,
      jobsSelected, setJobsSelected,
      eventsSelected, setEventsSelected,
      providersSelected, setProvidersSelected,
      usersSelected, setUsersSelected,
      usersessionsSelected, setUsersessionsSelected,
      certsSelected, setCertsSelected,
      currentVncRfb, setCurrentVncRfb, clearCurrentVncRfb,
      fileUploadQueue, newFileUploadQueue, popFileUploadQueue,
      top3VmsCpuUsed, /*setTop3VmsCpuUsed,*/
      top3VmsMemUsed, /*setTop3VmsMemUsed,*/
      top3StoragesUsed, /*setTop3StoragesUsed,*/
      sourceContext, setSourceContext,
      clearAllSelected,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
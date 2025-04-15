// GlobalContext.jsx
import React, { createContext, useState } from "react";
import Logger from "../utils/Logger";

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

  const [usersSelected, _setUsersSelected] = useState([]);
  const setUsersSelected = (newV) => {
    Logger.debug(`GlobalProvider > setUsersSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setUsersSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setUsersSelected([{...newV}]);
  }

  const [userSessionsSelected, _setUserSessionsSelected] = useState([]);
  const setUserSessionsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setUserSessionsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setUserSessionsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setUserSessionsSelected([{...newV}]);
  }

  const [certsSelected, _setCertsSelected] = useState([]);
  const setCertsSelected = (newV) => {
    Logger.debug(`GlobalProvider > setCertsSelected ... newV: `, newV)
    if (Array.isArray(newV))
      _setCertsSelected([...newV]);
    else if (!Array.isArray(newV) && typeof newV === "object")
      _setCertsSelected([{...newV}]);
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
    setVnicProfilesSelected([])
    setTemplatesSelected([])
    setJobsSelected([])
    setEventsSelected([])
    setUsersSelected([])
    setUserSessionsSelected([])
    setCertsSelected([])
  }

  return (
    <GlobalContext.Provider value={{
      datacentersSelected, setDatacentersSelected,
      clustersSelected, setClustersSelected,
      hostsSelected, setHostsSelected,
      hostDevicesSelected, setHostDevicesSelected,
      vmsSelected, setVmsSelected,
      snapshotsSelected, setSnapshotsSelected,
      networksSelected, setNetworksSelected,
      networkProvidersSelected, setNetworkProvidersSelected,
      nicsSelected, setNicsSelected,
      domainsSelected, setDomainsSelected,
      disksSelected, setDisksSelected,
      vnicProfilesSelected, setVnicProfilesSelected,
      templatesSelected, setTemplatesSelected,
      jobsSelected, setJobsSelected,
      eventsSelected, setEventsSelected,
      usersSelected, setUsersSelected,
      userSessionsSelected, setUserSessionsSelected,
      certsSelected, setCertsSelected,
      clearAllSelected,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
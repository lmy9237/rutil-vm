import { useState, createContext, useEffect } from "react";
import Logger from "../utils/Logger";

const TMIStateContext = createContext({});

export const TMIStateProvider = ({ children }) => {
  const KEY_TMI_STATE = "tmiState";
  const KEY_TMI_LAST_SELECTED = "tmiLastSelected"                     /* 트리메뉴 선택 */
  const KEY_TMI_COMPUTING = "tmiComputing";                           /* computing 트리메뉴 그룹 상태 */
  const KEY_TMI_NETWORK = "tmiNetwork";                               /* network 트리메뉴 그룹 상태 */
  const KEY_TMI_STORAGE = "tmiStorage";                               /* storage 트리메뉴 그룹 상태 */
  const KEY_SECOND_VISIBLE = "secondVisible"                          /* 각 트리메뉴 안 Rutil Manager 확장처리 여부 */
  const KEY_TMI_OPEN_DATACENTER = "openDataCenter";                   /* 각 트리메뉴 안 Rutil Manager 확장처리 여부 */
  const KEY_TMI_OPEN_CLUSTER = "openCluster";
  const KEY_TMI_OPEN_HOST = "openHost";
  const KEY_TMI_OPEN_DOMAIN = "openDomain";

  const initialState = JSON.parse(sessionStorage.getItem(KEY_TMI_STATE)) ?? {
    [KEY_TMI_LAST_SELECTED]: "",
    [KEY_TMI_COMPUTING]: {
      [KEY_SECOND_VISIBLE]: false,
      [KEY_TMI_OPEN_DATACENTER]: {

      },
      [KEY_TMI_OPEN_CLUSTER]: {
        
      },
      [KEY_TMI_OPEN_HOST]: {
        
      },
    },
    [KEY_TMI_NETWORK]: {
      [KEY_SECOND_VISIBLE]: false,
      [KEY_TMI_OPEN_DATACENTER]: {
        
      }
    },
    [KEY_TMI_STORAGE]: {
      [KEY_SECOND_VISIBLE]: false,
      [KEY_TMI_OPEN_DATACENTER]: {
        
      },
      [KEY_TMI_OPEN_DOMAIN]: {
        
      },
    }
  }
  const [sTMIState, setTMIState] = useState(initialState)
  const _TMIState = () => {
    const res = Object.assign({}, JSON.parse(sessionStorage.getItem(KEY_TMI_STATE)), sTMIState) 
    Logger.debug(`TMIStateProvider > _TMIState ... res: `, res);
    return res;
  }

  useEffect(() => {
    return () => {
      sessionStorage.setItem(KEY_TMI_STATE, JSON.stringify(sTMIState));
    }
  }, [sTMIState])

  //#region: 최근 선택 왼쪽메뉴
  const tmiLastSelected = _TMIState()[KEY_TMI_LAST_SELECTED] ?? "computing";
  const setTmiLastSelected = (newV) => {
    Logger.debug(`TMIStateProvider > setTmiLastSelected ... newV: ${newV}`)
    setTMIState({
      ...sTMIState,
      [KEY_TMI_LAST_SELECTED]: newV
    });
  }
  //#endregion: 최근 선택 왼쪽메뉴

  //#region: 트리메뉴 데이터센터 보관값
  const _allTMIComputing = () => _TMIState()[KEY_TMI_COMPUTING] ?? {}
  const _allTMINetwork = () => _TMIState()[KEY_TMI_NETWORK] ?? {}
  const _allTMIStorage = () => _TMIState()[KEY_TMI_STORAGE] ?? {}
  const _browseTMI = (tmiId=KEY_TMI_COMPUTING) => {
    Logger.debug(`TMIStateProvider > _browseTMI ... tmiId: ${tmiId}`)
    const _default = {
      [KEY_TMI_COMPUTING]: {
        [KEY_SECOND_VISIBLE]: false,
        [KEY_TMI_OPEN_DATACENTER]: {

        },
        [KEY_TMI_OPEN_CLUSTER]: {
          
        },
        [KEY_TMI_OPEN_HOST]: {
          
        },
      },
      [KEY_TMI_NETWORK]: {
        [KEY_SECOND_VISIBLE]: false,
        [KEY_TMI_OPEN_DATACENTER]: {
          
        }
      },
      [KEY_TMI_STORAGE]: {
        [KEY_SECOND_VISIBLE]: false,
        [KEY_TMI_OPEN_DATACENTER]: {
          
        },
        [KEY_TMI_OPEN_DOMAIN]: {
          
        },
      }
    }
    switch(tmiId) {
    case KEY_TMI_COMPUTING: return _allTMIComputing() ?? _default
    case KEY_TMI_NETWORK: return _allTMINetwork() ?? _default
    case KEY_TMI_STORAGE: return _allTMIStorage() ?? _default
    default: return _default
    }
  }
  //#region: 왼쪽메뉴 안 트리표출여부
  const _secondVisible = (tmiId=KEY_TMI_COMPUTING) => _browseTMI(tmiId)[KEY_SECOND_VISIBLE] ?? false;
  const _setSecondVisible = (tmiId=KEY_TMI_COMPUTING, newV) => {
    Logger.debug(`TMIStateProvider > _setSecondVisible ... tmiId: ${tmiId}, newV: ${newV}`)
    setTMIState({
      ...sTMIState,
      [tmiId] : {
        ..._browseTMI(tmiId),
        [KEY_SECOND_VISIBLE]: newV
      }
    });
  }
  const _toggleSecondVisible = (tmiId=KEY_TMI_COMPUTING) => {
    Logger.debug(`TMIStateProvider > _toggleSecondVisible ... tmiId: ${tmiId}`)
    _setSecondVisible(tmiId, !_secondVisible(tmiId))
  }
  
  const secondVisibleComputing = () => _secondVisible(KEY_TMI_COMPUTING)
  const setSecondVisibleComputing = (newV) => _setSecondVisible(KEY_TMI_COMPUTING, newV)
  const toggleSecondVisibleComputing = () => _toggleSecondVisible(KEY_TMI_COMPUTING)

  const secondVisibleNetwork = () => _secondVisible(KEY_TMI_NETWORK)
  const setSecondVisibleNetwork = (newV) => _setSecondVisible(KEY_TMI_NETWORK, newV)
  const toggleSecondVisibleNetwork = () => _toggleSecondVisible(KEY_TMI_NETWORK)

  const secondVisibleStorage = () => _secondVisible(KEY_TMI_STORAGE)
  const setSecondVisibleStorage = (newV) => _setSecondVisible(KEY_TMI_STORAGE, newV)
  const toggleSecondVisibleStorage = () => _toggleSecondVisible(KEY_TMI_STORAGE)

  //#endregion: 왼쪽메뉴 안 트리 표출여부

  const _browseOpenDataCenters = (tmiId=KEY_TMI_COMPUTING) => _browseTMI(tmiId)[KEY_TMI_OPEN_DATACENTER] ?? {}
  const _openDataCenters = (tmiId, target) => {
    Logger.debug(`TMIStateProvider > _openDataCenters ... tmiId: ${tmiId}, target: ${target}`)
    const _tmiFound = _browseOpenDataCenters(tmiId) ?? {}
    return _tmiFound[target] ?? false;
  }
  const _setOpenDataCenters = (tmiId, target, newV) => {
    Logger.debug(`TMIStateProvider > _setOpenDataCenters ... tmiId: ${tmiId}, target: ${target}, newV: ${newV}`)
    setTMIState({ 
      ...sTMIState,
      [tmiId] : {
        ..._browseTMI(tmiId),
        [KEY_TMI_OPEN_DATACENTER]: {
          ..._browseOpenDataCenters(tmiId),
          [target]: newV
        }
      }
    });
  }
  const _toggleOpenDataCenters = (tmiId, target) => {
    Logger.debug(`TMIStateProvider > _toggleOpenDataCenters ... tmiId: ${tmiId}, target: ${target}`)
    _setOpenDataCenters(tmiId, target, !_openDataCenters(tmiId, target))
  }
  const openDataCentersComputing = (target) => _openDataCenters(KEY_TMI_COMPUTING, target)
  const setOpenDataCentersComputing = (target, newV) => _setOpenDataCenters(KEY_TMI_COMPUTING, target, newV)
  const toggleOpenDataCentersComputing = (target) => _toggleOpenDataCenters(KEY_TMI_COMPUTING, target);

  const _browseOpenClusters = (tmiId=KEY_TMI_COMPUTING) => _browseTMI(tmiId)[KEY_TMI_OPEN_CLUSTER] ?? {}
  const _openClusters = (tmiId, target) => {
    Logger.debug(`TMIStateProvider > _openClusters ... tmiId: ${tmiId}, target: ${target}`)
    const _tmiFound = _browseOpenClusters(tmiId) ?? {}
    return _tmiFound[target] ?? false;
  }
  const _setOpenClusters = (tmiId, target, newV) => {
    Logger.debug(`TMIStateProvider > _setOpenClusters ... tmiId: ${tmiId}, target: ${target}, newV: ${newV}`)
    setTMIState({ 
      ...sTMIState,
      [tmiId] : {
        ..._browseTMI(tmiId),
        [KEY_TMI_OPEN_CLUSTER]: {
          ..._browseOpenClusters(tmiId),
          [target]: newV
        }
      }
    });
  }
  const _toggleOpenClusters = (tmiId, target) => {
    Logger.debug(`TMIStateProvider > _toggleOpenClusters ... tmiId: ${tmiId}, target: ${target}`)
    _setOpenClusters(tmiId, target, !_openClusters(tmiId, target))
  }

  const _browseOpenHosts = (tmiId=KEY_TMI_COMPUTING) => _browseTMI(tmiId)[KEY_TMI_OPEN_HOST]
  const _openHosts = (tmiId, target) => {
    Logger.debug(`TMIStateProvider > _openHosts ... tmiId: ${tmiId}, target: ${target}`)
    const _tmiFound = _browseOpenHosts(tmiId) ?? {}
    return _tmiFound[target] ?? false;
  }
  const _setOpenHosts = (tmiId, target, newV) => {
    Logger.debug(`TMIStateProvider > _setOpenHosts ... tmiId: ${tmiId}, target: ${target}, newV: ${newV}`)
    setTMIState({ 
      ...sTMIState,
      [tmiId] : {
        ..._browseTMI(tmiId),
        [KEY_TMI_OPEN_HOST]: {
          ..._browseOpenHosts(tmiId),
          [target]: newV
        }
      }
    });
  }
  const _toggleOpenHosts = (tmiId, target) => {
    Logger.debug(`TMIStateProvider > _toggleOpenHosts ... tmiId: ${tmiId}, target: ${target}`)
    _setOpenHosts(tmiId, target, !_openHosts(tmiId, target))
  }

  const _browseOpenDomains = (tmiId=KEY_TMI_STORAGE) => _browseTMI(tmiId)[KEY_TMI_OPEN_DOMAIN]
  const _openDomains = (tmiId, target) => {
    Logger.debug(`TMIStateProvider > _openDomains ... tmiId: ${tmiId}, target: ${target}`)
    const _tmiFound = _browseOpenDomains(tmiId) ?? {}
    const _openDomainsState = _tmiFound ?? {}
    return _openDomainsState[target] ?? false;
  }
  const _setOpenDomains = (tmiId, target, newV) => {
    Logger.debug(`TMIStateProvider > _setOpenDomains ... tmiId: ${tmiId}, target: ${target}, newV: ${newV}`)
    setTMIState({ 
      ...sTMIState,
      [tmiId] : {
        ..._browseTMI(tmiId),
        [KEY_TMI_OPEN_HOST]: {
          ..._browseOpenDomains(tmiId),
          [target]: newV
        }
      }
    });
  }
  const _toggleOpenDomains = (tmiId, target) => {
    Logger.debug(`TMIStateProvider > _toggleOpenDomains ... tmiId: ${tmiId}, target: ${target}`)
    _setOpenHosts(tmiId, target, !_openDomains(tmiId, target))
  }

  const openClustersComputing = (target) => _openClusters(KEY_TMI_COMPUTING, target)
  const setOpenClustersComputing = (target, newV) => _setOpenClusters(KEY_TMI_COMPUTING, target, newV)
  const toggleOpenClustersComputing = (target) => _toggleOpenClusters(KEY_TMI_COMPUTING, target)
  
  const openHostsComputing = (target) => _openHosts(KEY_TMI_COMPUTING, target)
  const setOpenHostsComputing = (target, newV) => _setOpenHosts(KEY_TMI_COMPUTING, target, newV)
  const toggleOpenHostsComputing = (target) => _toggleOpenHosts(KEY_TMI_COMPUTING, target)

  const openDataCentersNetwork = (target) => _openDataCenters(KEY_TMI_NETWORK, target);
  const setOpenDataCentersNetwork = (target, newV) => _setOpenDataCenters(KEY_TMI_NETWORK, target, newV)
  const toggleOpenDataCentersNetwork = (target) => _toggleOpenDataCenters(KEY_TMI_NETWORK, target)

  const openDataCentersStorage = (target) => _openDataCenters(KEY_TMI_STORAGE, target);
  const setOpenDataCentersStorage = (target, newV) => _setOpenDataCenters(KEY_TMI_STORAGE, target, newV);
  const toggleDataCentersStorage = (target) => _toggleOpenDataCenters(KEY_TMI_STORAGE, target);

  const openDomainsStorage = (target) => _openDomains(KEY_TMI_STORAGE, target)
  const setOpenDomainsStorage = (target, newV) => _setOpenDomains(KEY_TMI_STORAGE, target, newV)
  const toggleOpenDomainsStorage = (target) => _toggleOpenDomains(KEY_TMI_STORAGE, target)
  //#endregion: 트리메뉴 데이터센터 보관값

  return (
    <TMIStateContext.Provider value={
      {
        tmiLastSelected, setTmiLastSelected,

        secondVisibleComputing, setSecondVisibleComputing, toggleSecondVisibleComputing,
        secondVisibleNetwork, setSecondVisibleNetwork, toggleSecondVisibleNetwork,
        secondVisibleStorage, setSecondVisibleStorage, toggleSecondVisibleStorage,

        openDataCentersComputing, setOpenDataCentersComputing, toggleOpenDataCentersComputing,
        openClustersComputing, setOpenClustersComputing, toggleOpenClustersComputing,
        openHostsComputing, setOpenHostsComputing, toggleOpenHostsComputing,

        openDataCentersNetwork, setOpenDataCentersNetwork, toggleOpenDataCentersNetwork,
        
        openDataCentersStorage, setOpenDataCentersStorage, toggleDataCentersStorage,
        openDomainsStorage, setOpenDomainsStorage, toggleOpenDomainsStorage,
      }
    }>
      {children}
    </TMIStateContext.Provider>
  )
}

export default TMIStateContext;

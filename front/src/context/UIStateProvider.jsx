import { useState, createContext } from "react";
import Logger from "../utils/Logger";

const UIStateContext = createContext({});

export const UIStateProvider = ({ children }) => {
  const KEY_UI_STATE = "uiState";
  const KEY_FOOTER_VISIBLE = "footerVisible"
  const KEY_ASIDE_VISIBLE = "asideVisible"
  const KEY_TMI_LAST_SELECTED = "tmiLastSelected"
  const KEY_SECOND_VISIBLE = "secondVisible"
  const KEY_TMI_COMPUTING = "tmiComputing";
  const KEY_TMI_NETWORK = "tmiNetwork";
  const KEY_TMI_STORAGE = "tmiStorage";
  const KEY_TMI_OPEN_DATACENTER = "openDataCenter";
  const KEY_TMI_OPEN_CLUSTER = "openCluster";
  const KEY_TMI_OPEN_HOST = "openHost";
  const KEY_TMI_OPEN_DOMAIN = "openDomain";
  const KEY_EVENT_BOX_EXPANDED = "eventBoxExpanded";
  const KEY_EVENT_BOX_VISIBLE = "eventBoxVisible";
  const KEY_EVENT_BOX_SECTION_ACTIVE = "eventBoxSectionActive"; // '알림', '이벤트'
  const KEY_EVENT_BADGE_NUM = "eventBadgeNum";
  // const KEY_EVENT_IDS_READ = "eventIdsRead"; 
  const KEY_LOGIN_BOX_VISIBLE = "loginBoxVisible";

  const initialState = JSON.parse(localStorage.getItem(KEY_UI_STATE)) ?? {
    [KEY_FOOTER_VISIBLE]: false,
    [KEY_ASIDE_VISIBLE]: false,
    [KEY_TMI_LAST_SELECTED]: "",
    [KEY_EVENT_BOX_VISIBLE]: false,
    [KEY_EVENT_BOX_EXPANDED]: false,
    [KEY_EVENT_BOX_SECTION_ACTIVE]: "알림",
    [KEY_EVENT_BADGE_NUM]: 0,
    // [KEY_EVENT_IDS_READ]: [],
    [KEY_LOGIN_BOX_VISIBLE]: false,
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
  const [sUIState, sSetUIState] = useState(initialState)
  const _UIState = () => {
    const res = Object.assign({}, sUIState) 
    Logger.debug(`UIStateProvider > _UIState ... res: ${JSON.stringify(res, null, 2)}`);
    return res;
  }
  const _setUIState = (newUIState) => {
    // Logger.debug(`UIStateProvider > _setUIState ... newUIState: ${JSON.stringify(newUIState, null, 2)}`);
    sSetUIState(newUIState)
    localStorage.setItem(KEY_UI_STATE, JSON.stringify(newUIState, null, 2));
  }

  //#region: Footer 표출
  const footerVisible = _UIState()[KEY_FOOTER_VISIBLE] ?? false;
  const setFooterVisible = (newV) => {
    Logger.debug(`UIStateProvider > setFooterVisible ... newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
      [KEY_FOOTER_VISIBLE]: newV
    })
  }
  const toggleFooterVisible = () => {
    Logger.debug(`UIStateProvider > toggleFooterVisible`)
    setFooterVisible(!footerVisible)
  }

  //#region: 왼쪽메뉴 활성화
  const asideVisible = _UIState()[KEY_ASIDE_VISIBLE] ?? false;
  const setAsideVisible = (newV) => {
    Logger.debug(`UIStateProvider > setAsideVisible ... newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
      [KEY_ASIDE_VISIBLE]: newV
    });
  }
  const toggleAsideVisible = () => {
    Logger.debug(`UIStateProvider > toggleAsideVisible`)
    setAsideVisible(!asideVisible)
  }
  //#endregion: 왼쪽메뉴 활성화

  //#region: 최근 선택 왼쪽메뉴
  const tmiLastSelected = _UIState()[KEY_TMI_LAST_SELECTED] ?? "computing";
  const setTmiLastSelected = (newV) => {
    _setUIState({
      ...sUIState,
      [KEY_TMI_LAST_SELECTED]: newV
    });
  }
  //#endregion: 최근 선택 왼쪽메뉴

  //#region: 밸 박스 활성화 여부
  const eventBoxVisible = _UIState()[KEY_EVENT_BOX_VISIBLE] ?? false;
  const setEventBoxVisible = (newV) => {
    Logger.debug(`UIStateProvider > setEventBoxVisible ... newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
      [KEY_EVENT_BOX_VISIBLE]: newV
    });
  }
  const toggleEventBoxVisible = () => {
    Logger.debug(`UIStateProvider > toggleEventBoxVisible`)
    setEventBoxVisible(!eventBoxVisible)
  }
  //#endregion: 밸 박스 활성화 여부
  
  //#region: 이벤트 박스 (벨버튼) 메뉴 확장여부
  const eventBoxExpanded = _UIState()[KEY_EVENT_BOX_EXPANDED] ?? false;
  const setEventBoxExpanded = (newV) => {
    Logger.debug(`UIStateProvider > setEventBoxExpanded ... newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
      [KEY_EVENT_BOX_EXPANDED]: newV
    });
  }
  const toggleEventBoxExpanded = () => {
    Logger.debug(`UIStateProvider > toggleEventBoxExpanded`)
    setEventBoxExpanded(!eventBoxExpanded)
  }
  //#endregion: 이벤트 박스 (벨버튼) 메뉴 확장여부

  //#region: 이벤트 박스 (벨버튼) 활성화 탭
  const eventBoxSectionActive = _UIState()[KEY_EVENT_BOX_SECTION_ACTIVE] ?? "알림";
  const setEventBoxSectionActive = (newV) => {
    _setUIState({
      ...sUIState,
      [KEY_EVENT_BOX_SECTION_ACTIVE]: newV
    });
  }
  //#endregion: 이벤트 박스 (벨버튼) 활성화 탭

  //#region: 이벤트 박스 알림 개수
  const eventBadgeNum = _UIState()[KEY_EVENT_BADGE_NUM] ?? 0;
  const setEventBadgeNum = (newV) => {
    Logger.debug(`UIStateProvider > setEventBadgeNum ... newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
      [KEY_EVENT_BADGE_NUM]: newV
    });
  }
  //#endregion: 

  //#region: 로그인박스 표출 여부
  const loginBoxVisible = _UIState()[KEY_LOGIN_BOX_VISIBLE] ?? false;
  const setLoginBoxVisible = (newV) => {
    Logger.debug(`UIStateProvider > setLoginBoxVisible ... newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
      [KEY_LOGIN_BOX_VISIBLE]: newV
    });
  }
  const toggleLoginBoxVisible = () => {
    Logger.debug(`UIStateProvider > toggleBellACtive`)
    setLoginBoxVisible(!loginBoxVisible)
  }
  //#endregion: 로그인박스 표출 여부

  //#region: 트리메뉴 데이터센터 보관값
  const _allTMIComputing = () => _UIState()[KEY_TMI_COMPUTING] ?? {}
  const _allTMINetwork = () => _UIState()[KEY_TMI_NETWORK] ?? {}
  const _allTMIStorage = () => _UIState()[KEY_TMI_STORAGE] ?? {}
  const _browseTMI = (tmiId=KEY_TMI_COMPUTING) => {
    Logger.debug(`UIStateProvider > _browseTMI ... tmiId: ${tmiId}`)
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
    Logger.debug(`UIStateProvider > _setSecondVisible ... tmiId: ${tmiId}, newV: ${newV}`)
    _setUIState({
      ...sUIState,
      [tmiId] : {
        ..._browseTMI(tmiId),
        [KEY_SECOND_VISIBLE]: newV
      }
    });
  }
  const _toggleSecondVisible = (tmiId=KEY_TMI_COMPUTING) => {
    Logger.debug(`UIStateProvider > _toggleSecondVisible ... tmiId: ${tmiId}`)
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
    Logger.debug(`UIStateProvider > _openDataCenters ... tmiId: ${tmiId}, target: ${target}`)
    const _tmiFound = _browseOpenDataCenters(tmiId) ?? {}
    return _tmiFound[target] ?? false;
  }
  const _setOpenDataCenters = (tmiId, target, newV) => {
    Logger.debug(`UIStateProvider > _setOpenDataCenters ... tmiId: ${tmiId}, target: ${target}, newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
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
    Logger.debug(`UIStateProvider > _toggleOpenDataCenters ... tmiId: ${tmiId}, target: ${target}`)
    _setOpenDataCenters(tmiId, target, !_openDataCenters(tmiId, target))
  }
  const openDataCentersComputing = (target) => _openDataCenters(KEY_TMI_COMPUTING, target)
  const setOpenDataCentersComputing = (target, newV) => _setOpenDataCenters(KEY_TMI_COMPUTING, target, newV)
  const toggleOpenDataCentersComputing = (target) => _toggleOpenDataCenters(KEY_TMI_COMPUTING, target);

  const _browseOpenClusters = (tmiId=KEY_TMI_COMPUTING) => _browseTMI(tmiId)[KEY_TMI_OPEN_CLUSTER] ?? {}
  const _openClusters = (tmiId, target) => {
    Logger.debug(`UIStateProvider > _openClusters ... tmiId: ${tmiId}, target: ${target}`)
    const _tmiFound = _browseOpenClusters(tmiId) ?? {}
    return _tmiFound[target] ?? false;
  }
  const _setOpenClusters = (tmiId, target, newV) => {
    Logger.debug(`UIStateProvider > _setOpenClusters ... tmiId: ${tmiId}, target: ${target}, newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
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
    Logger.debug(`UIStateProvider > _toggleOpenClusters ... tmiId: ${tmiId}, target: ${target}`)
    _setOpenClusters(tmiId, target, !_openClusters(tmiId, target))
  }

  const _browseOpenHosts = (tmiId=KEY_TMI_COMPUTING) => _browseTMI(tmiId)[KEY_TMI_OPEN_HOST]
  const _openHosts = (tmiId, target) => {
    Logger.debug(`UIStateProvider > _openHosts ... tmiId: ${tmiId}, target: ${target}`)
    const _tmiFound = _browseOpenHosts(tmiId) ?? {}
    return _tmiFound[target] ?? false;
  }
  const _setOpenHosts = (tmiId, target, newV) => {
    Logger.debug(`UIStateProvider > _setOpenHosts ... tmiId: ${tmiId}, target: ${target}, newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
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
    Logger.debug(`UIStateProvider > _toggleOpenHosts ... tmiId: ${tmiId}, target: ${target}`)
    _setOpenHosts(tmiId, target, !_openHosts(tmiId, target))
  }

  const _browseOpenDomains = (tmiId=KEY_TMI_STORAGE) => _browseTMI(tmiId)[KEY_TMI_OPEN_DOMAIN]
  const _openDomains = (tmiId, target) => {
    Logger.debug(`UIStateProvider > _openDomains ... tmiId: ${tmiId}, target: ${target}`)
    const _tmiFound = _browseOpenDomains(tmiId) ?? {}
    const _openDomainsState = _tmiFound ?? {}
    return _openDomainsState[target] ?? false;
  }
  const _setOpenDomains = (tmiId, target, newV) => {
    Logger.debug(`UIStateProvider > _setOpenDomains ... tmiId: ${tmiId}, target: ${target}, newV: ${newV}`)
    _setUIState({ 
      ...sUIState,
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
    Logger.debug(`UIStateProvider > _toggleOpenDomains ... tmiId: ${tmiId}, target: ${target}`)
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
    <UIStateContext.Provider value={
      {
        footerVisible, setFooterVisible, toggleFooterVisible,
        asideVisible, setAsideVisible, toggleAsideVisible,
        tmiLastSelected, setTmiLastSelected,
        eventBoxVisible, setEventBoxVisible, toggleEventBoxVisible,
        eventBoxExpanded, setEventBoxExpanded, toggleEventBoxExpanded,
        eventBoxSectionActive, setEventBoxSectionActive,
        eventBadgeNum, setEventBadgeNum,
        loginBoxVisible, setLoginBoxVisible, toggleLoginBoxVisible,

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
    </UIStateContext.Provider>
  )
}

export default UIStateContext;
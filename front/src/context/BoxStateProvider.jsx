import { useState, createContext, useEffect } from "react";
import Logger from "../utils/Logger";

const BoxStateContext = createContext({});

export const BoxStateProvider = ({ children }) => {
  const KEY_BOX_STATE = "boxState"
  const KEY_EVENT_BOX_VISIBLE = "eventBoxVisible";                    /* 이벤트 박스 표출여부 */
  const KEY_EVENT_BOX_EXPANDED = "eventBoxExpanded";                  /* 이벤트 박스 확장여부 */
  const KEY_EVENT_BOX_SECTION_ACTIVE = "eventBoxSectionActive";       /* 이벤트 박스 내 활성화 된 탭: '알림' / '이벤트' */
  const KEY_EVENT_BADGE_NUM = "eventBadgeNum";                        /* 이벤트 박스 표출개수 */ 
  // const KEY_EVENT_IDS_READ = "eventIdsRead"; 
  const KEY_LOGIN_BOX_VISIBLE = "loginBoxVisible";                    /* 로그인 박스 표출여부 */
  
  const initialState = JSON.parse(sessionStorage.getItem(KEY_BOX_STATE)) ?? {
    [KEY_EVENT_BOX_VISIBLE]: false,
    [KEY_EVENT_BOX_EXPANDED]: false,
    [KEY_EVENT_BOX_SECTION_ACTIVE]: "알림",
    [KEY_EVENT_BADGE_NUM]: 0,
    // [KEY_EVENT_IDS_READ]: [],
    [KEY_LOGIN_BOX_VISIBLE]: false,
  }

  const [sBoxState, sSetBoxState] = useState(initialState)
  const _boxState = () => Object.assign({}, sBoxState, JSON.parse(sessionStorage.getItem(KEY_BOX_STATE)))
  const _setBoxState = (newUIState) => {
    Logger.debug(`FooterStateProvider > _setBoxState ... newUIState: `, newUIState);
    sSetBoxState(newUIState)
    sessionStorage.setItem(KEY_BOX_STATE, JSON.stringify(newUIState));
  }

  //#region: 밸 박스 활성화 여부
  const eventBoxVisible = () => _boxState()[KEY_EVENT_BOX_VISIBLE] ?? false;
  const setEventBoxVisible = (newV) => {
    Logger.debug(`UIStateProvider > setEventBoxVisible ... newV: ${newV}`)
    _setBoxState({
      ...sBoxState,
      [KEY_EVENT_BOX_VISIBLE]: newV
    });
  }
  const toggleEventBoxVisible = () => {
    Logger.debug(`UIStateProvider > toggleEventBoxVisible`)
    setEventBoxVisible(!eventBoxVisible())
  }
  //#endregion: 밸 박스 활성화 여부
  
  //#region: 이벤트 박스 (벨버튼) 메뉴 확장여부
  const eventBoxExpanded = () => _boxState()[KEY_EVENT_BOX_EXPANDED] ?? false;
  const setEventBoxExpanded = (newV) => {
    Logger.debug(`UIStateProvider > setEventBoxExpanded ... newV: ${newV}`)
    _setBoxState({
      ...sBoxState,
      [KEY_EVENT_BOX_EXPANDED]: newV
    });
  }
  const toggleEventBoxExpanded = () => {
    Logger.debug(`UIStateProvider > toggleEventBoxExpanded`)
    setEventBoxExpanded(!eventBoxExpanded())
  }
  //#endregion: 이벤트 박스 (벨버튼) 메뉴 확장여부

  //#region: 이벤트 박스 (벨버튼) 활성화 탭
  const eventBoxSectionActive = () => _boxState()[KEY_EVENT_BOX_SECTION_ACTIVE] ?? "알림";
  const setEventBoxSectionActive = (newV) => {
    _setBoxState({
      ...sBoxState,
      [KEY_EVENT_BOX_SECTION_ACTIVE]: newV
    });
  }
  //#endregion: 이벤트 박스 (벨버튼) 활성화 탭

  //#region: 이벤트 박스 알림 개수
  const eventBadgeNum = () => _boxState()[KEY_EVENT_BADGE_NUM] ?? 0;
  const setEventBadgeNum = (newV) => {
    Logger.debug(`UIStateProvider > setEventBadgeNum ... newV: ${newV}`)
    _setBoxState({
      ...sBoxState,
      [KEY_EVENT_BADGE_NUM]: newV
    });
  }
  //#endregion: 

  //#region: 로그인박스 표출 여부
  const loginBoxVisible = () => _boxState()[KEY_LOGIN_BOX_VISIBLE] ?? false;
  const setLoginBoxVisible = (newV) => {
    Logger.debug(`UIStateProvider > setLoginBoxVisible ... newV: ${newV}`)
    _setBoxState({
      ...sBoxState,
      [KEY_LOGIN_BOX_VISIBLE]: newV
    });
  }
  const toggleLoginBoxVisible = () => {
    Logger.debug(`UIStateProvider > toggleBellACtive`)
    setLoginBoxVisible(!loginBoxVisible())
  }
  //#endregion: 로그인박스 표출 여부

  Logger.debug(`BoxStateProvider ... `)
  return (
    <BoxStateContext.Provider value={
      {
        eventBoxVisible, setEventBoxVisible, toggleEventBoxVisible,
        eventBoxExpanded, setEventBoxExpanded, toggleEventBoxExpanded,
        eventBoxSectionActive, setEventBoxSectionActive,
        eventBadgeNum, setEventBadgeNum,
        loginBoxVisible, setLoginBoxVisible, toggleLoginBoxVisible,
      }
    }>
      {children}
    </BoxStateContext.Provider>
  )
}

export default BoxStateContext;

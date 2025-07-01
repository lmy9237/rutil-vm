import { useState, createContext, useEffect } from "react";
import Logger from "../utils/Logger";

const UIStateContext = createContext({});

export const UIStateProvider = ({ children }) => {
  const KEY_UI_STATE = "uiState";
  const KEY_CURRENT_PAGE = "currentPage"                              /* 현재위치 (in File) */
  const KEY_ACTIVE_MODAL = "activeModal";                             /* (활성화 된) 모달 */
  const KEY_VNC_SCREENSHOT_DATA_URLS = "vncScreenshotDataUrls";                  /* VNC 화면 */

  const initialState = JSON.parse(sessionStorage.getItem(KEY_UI_STATE)) ?? {
    [KEY_CURRENT_PAGE]: "",
    [KEY_ACTIVE_MODAL]: [],
    [KEY_VNC_SCREENSHOT_DATA_URLS]: {},
  }
  const [sUIState, sSetUIState] = useState(initialState)
  const _UIState = () => Object.assign({}, sUIState, JSON.parse(sessionStorage.getItem(KEY_UI_STATE)))
  const _setUIState = (newUIState) => {
    Logger.debug(`UIStateProvider > _setUIState ... newUIState: `, newUIState);
    sSetUIState(newUIState)
    sessionStorage.setItem(KEY_UI_STATE, JSON.stringify(newUIState));
  }

  //#region: 현재 위치 (in File)
  const currentPage = () => _UIState()[KEY_CURRENT_PAGE] ?? "";
  const setCurrentPage = (newV) => {
    Logger.debug(`UIStateProvider > setCurrentPage ... newV: ${newV}`)
    _setUIState({
      ...sUIState,
      [KEY_CURRENT_PAGE]: newV
    });
  }
  
  //#endregion: 현재 위치 (in File)

  //#region: 활성화 된 모달
  const activeModal = () => _UIState()[KEY_ACTIVE_MODAL] ?? [];
  const setActiveModal = (newV) => {
    Logger.debug(`UIStateProvider > setActiveModal ... newV: `, newV)
    if (Array.isArray(newV))
        // 빈 배열값을 주었을 때 초기화 하도록
        _setUIState({
          ...sUIState,
          [KEY_ACTIVE_MODAL]: [...newV].length === 0 ? [] : [...newV],
        })
    else
      // 문자열 값을 주었을 때 계속 추가 하도록
      _setUIState({
        ...sUIState,
        [KEY_ACTIVE_MODAL]: [..._UIState()[KEY_ACTIVE_MODAL], newV]
      });
  }
  const closeModal = (target=null) => {
    if (target === null) // 비었을 떄, 빈 배열로
      setActiveModal([])
    else // 특정 문자열 값을 주었을 때, 그것만 제거
      setActiveModal(
        [..._UIState()[KEY_ACTIVE_MODAL]]?.filter((e) => e !== target)
      )
  }
  //#endregion: 활성화 된 모달

  //#region: Vnc 스크린샷 이미지 데이터
  const _allVncScreenshotDataUrls = _UIState()[KEY_VNC_SCREENSHOT_DATA_URLS] ?? {}
  const vncScreenshotDataUrl = (vmId) => {
    Logger.debug(`UIStateProvider > vncScreenshotDataUrl ... vmId: ${vmId}`)
    const itemSelected = _allVncScreenshotDataUrls[vmId]
    if (itemSelected === null || itemSelected === undefined) {
      Logger.debug(`UIStateProvider > vncScreenshotDataUrl ... NO item for vmId: ${vmId}`)
      return ""
    }
    if (itemSelected !== null && itemSelected?.dateCreated !== null) {
      const currentDate = new Date()
      const dateCreated = new Date(itemSelected?.dateCreated)
      const diff = Math.abs(currentDate - dateCreated);
      Logger.debug(`UIStateProvider > vncScreenshotDataUrl ... currentDate: ${currentDate.toJSON()}, dateCreated: ${dateCreated.toJSON()}, diff: ${diff}`)
      const seconds = Math.floor((diff/1000)); 
      /* if (seconds > 10) { // 10초 지날 때 마다 새로운 값으로 갱신
        clearVncScreenshotDataUrl(vmId)
        return ""
      } */
    }
    return itemSelected?.url || ""
  }
  const setVncScreenshotDataUrl = (vmId, newV) => {
     Logger.debug(`UIStateProvider > setVnsScreenshot ... vmId: ${vmId}, newV: ${newV}`)
    _setUIState({
      ...sUIState,
      [KEY_VNC_SCREENSHOT_DATA_URLS]: {
        ..._allVncScreenshotDataUrls,
        [vmId]: (newV !== null) ? {
          url: newV,
          dateCreated: (new Date()).toJSON(),
        } : {}
      }
    });
  }
  const clearVncScreenshotDataUrl = (vmId="") => setVncScreenshotDataUrl(vmId, null)
  
  //#endregion: Vnc 스크린샷 이미지 데이터

  return (
    <UIStateContext.Provider value={
      {
        _setUIState,
        currentPage, setCurrentPage,
        activeModal, setActiveModal, closeModal,
        vncScreenshotDataUrl, setVncScreenshotDataUrl, clearVncScreenshotDataUrl
      }
    }>
      {children}
    </UIStateContext.Provider>
  )
}

export default UIStateContext;
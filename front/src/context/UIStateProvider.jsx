import { useState, createContext, useEffect } from "react";
import Logger from "../utils/Logger";

const UIStateContext = createContext({});

export const UIStateProvider = ({ children }) => {
  const KEY_UI_STATE = "uiState";
  const KEY_CURRENT_PAGE = "currentPage"                              /* 현재위치 (in File) */
  
  const KEY_ACTIVE_MODAL = "activeModal";                             /* (활성화 된) 모달 */

  const initialState = JSON.parse(sessionStorage.getItem(KEY_UI_STATE)) ?? {
    [KEY_CURRENT_PAGE]: "",
    [KEY_ACTIVE_MODAL]: null,
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
  const activeModal = () => _UIState()[KEY_ACTIVE_MODAL] ?? null;
  const setActiveModal = (newV) => {
    Logger.debug(`UIStateProvider > setActiveModal ... newV: `, newV)
    _setUIState({
      ...sUIState,
      [KEY_ACTIVE_MODAL]: newV
    });
  }
  //#endregion: 활성화 된 모달

  return (
    <UIStateContext.Provider value={
      {
        _setUIState,
        currentPage, setCurrentPage,
        activeModal, setActiveModal,
      }
    }>
      {children}
    </UIStateContext.Provider>
  )
}

export default UIStateContext;
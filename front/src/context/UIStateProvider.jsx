import { useState, createContext, useEffect } from "react";
import Logger from "../utils/Logger";

const UIStateContext = createContext({});

export const UIStateProvider = ({ children }) => {
  const KEY_UI_STATE = "uiState";
  const KEY_CURRENT_PAGE = "currentPage"                              /* 현재위치 (in File) */
  const KEY_ASIDE_VISIBLE = "asideVisible"                            /* aside 표출여부 */
  const KEY_ASIDE_DRAGGING = "asideDragging"                          /* aside 표출여부 */
  const KEY_ASIDE_OFFSET_X = "asideOffsetX"                           /* aside 표출여부 */
  
  const KEY_CONTEXT_MENU = "contextMenu";                             /* 우클릭 팝업 */
  const KEY_ACTIVE_MODAL = "activeModal";                             /* (활성화 된) 모달 */
  const KEY_CONTEXT_MENU_CLIENT_X = "clientX";                        /* 우클릭 팝업 표츨 X좌표 */
  const KEY_CONTEXT_MENU_CLIENT_Y = "clientY";                        /* 우클릭 팝업 표츨 Y좌표 */
  const KEY_CONTEXT_MENU_ITEM = "item";                               /* 우클릭 팝업 내용물 */
  const KEY_CONTEXT_MENU_TREE_TYPE = "treeType";                      /* 우클릭 팝업 트리유형 (예: "network", "storage", "computing") */

  const initialState = JSON.parse(sessionStorage.getItem(KEY_UI_STATE)) ?? {
  [KEY_CURRENT_PAGE]: "",
    [KEY_ASIDE_VISIBLE]: true,
    [KEY_ASIDE_DRAGGING]: false,
    [KEY_ASIDE_OFFSET_X]: 0,

    [KEY_ACTIVE_MODAL]: null,
    [KEY_CONTEXT_MENU]: {

    },
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

  //#region: 왼쪽메뉴 활성화
  const asideVisible = () => _UIState()[KEY_ASIDE_VISIBLE] ?? false;
  const setAsideVisible = (newV) => {
    Logger.debug(`UIStateProvider > setAsideVisible ... newV: ${newV}`)
    _setUIState({
      ...sUIState,
      [KEY_ASIDE_VISIBLE]: newV
    });
  }
  const toggleAsideVisible = () => {
    Logger.debug(`UIStateProvider > toggleAsideVisible`)
    setAsideVisible(!asideVisible())
  }
  //#endregion: 왼쪽메뉴 활성화

 

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

  //#region: 우클릭 메뉴 내용
  const contextMenu = () => _UIState()[KEY_CONTEXT_MENU] ?? null;
  const setContextMenu = (newV) => {
    Logger.debug(`UIStateProvider > setContextMenu ... newV: `, newV)
    _setUIState({
      ...sUIState,
      [KEY_CONTEXT_MENU]: newV
    });
  }
  //#endregion: 우클릭 메뉴 내용

  return (
    <UIStateContext.Provider value={
      {
        sUIState, _setUIState,
        currentPage, setCurrentPage,
        asideVisible, setAsideVisible, toggleAsideVisible,
        activeModal, setActiveModal,
        contextMenu, setContextMenu,
      }
    }>
      {children}
    </UIStateContext.Provider>
  )
}

export default UIStateContext;
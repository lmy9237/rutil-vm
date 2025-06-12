import { useState, createContext, useEffect } from "react";
import Logger from "../utils/Logger";

const ContextMenuStateContext = createContext({});

export const ContextMenuStateProvider = ({ children }) => {
  const KEY_CONTEXT_MENU_STATE = "contextMenuState";
  
  const KEY_CONTEXT_MENU_CONTENT = "content";              /* 우클릭 팝업 */
  const KEY_CONTEXT_MENU_TYPE = "type";                    /* 우클릭 메뉴 내용출력 유형 */

  const initialState = JSON.parse(sessionStorage.getItem(KEY_CONTEXT_MENU_STATE)) ?? {
    [KEY_CONTEXT_MENU_CONTENT]: {

    },
    [KEY_CONTEXT_MENU_TYPE]: "",
  }
  const [sContextMenuState, sSetContextMenuState] = useState(initialState)
  const _UIState = () => Object.assign({}, sContextMenuState, JSON.parse(sessionStorage.getItem(KEY_CONTEXT_MENU_STATE)))
  const _setContextMenuState = (newUIState) => {
    Logger.debug(`ContextMenuStateProvider > _setUIState ... newUIState: `, newUIState);
    sSetContextMenuState(newUIState)
    sessionStorage.setItem(KEY_CONTEXT_MENU_STATE, JSON.stringify(newUIState));
  }

  //#region: 우클릭 메뉴 내용
  const contextMenu = () => _UIState()[KEY_CONTEXT_MENU_CONTENT] ?? null;
  const setContextMenu = (newV, type) => {
    Logger.debug(`UIStateProvider > setContextMenu ... newV: `, newV, `, type: ${type}`)
    _setContextMenuState({
      ...sContextMenuState,
      [KEY_CONTEXT_MENU_CONTENT]: { 
        ...newV,
        /*"item": {
          _name: [newV]?.item?.name,
          icon: '',
        }*/
      },
      [KEY_CONTEXT_MENU_TYPE]: type
    });
  }
  //#endregion: 우클릭 메뉴 내용

  //#ergion: 우클릭 메뉴 내용출력 유형
  const contextMenuType = () => _UIState()[KEY_CONTEXT_MENU_TYPE] ?? "";
  const setContextMenuType = (newV) => {
    Logger.debug(`ContextMenuStateProvider > setContextMenuType ... newV: ${newV}`)
    _setContextMenuState({
      ...sContextMenuState,
      [KEY_CONTEXT_MENU_TYPE]: newV
    });
  }
  //#endergion: 우클릭 메뉴 내용출력 유형
 
  //#region: 우클릭 메뉴 관련 모두 초기화
  const clearAllContextMenu = () => {
    Logger.debug(`ContextMenuStateProvider > clearAllContextMenu ... `)
    _setContextMenuState({
      ...sContextMenuState,
      [KEY_CONTEXT_MENU_CONTENT]: null,
      [KEY_CONTEXT_MENU_TYPE]: null
    });
  }
  //#endregion: 우클릭 메뉴 관련 모두 초기화

  return (
    <ContextMenuStateContext.Provider value={
      {
        contextMenu, setContextMenu,
        contextMenuType, setContextMenuType, 
        clearAllContextMenu,
      }
    }>
      {children}
    </ContextMenuStateContext.Provider>
  )

}

export default ContextMenuStateContext;

import { useState, createContext, useEffect } from "react";
import Logger from "../utils/Logger";

const AsideStateContext = createContext({});

export const AsideStateProvider = ({ children }) => {
  const KEY_ASIDE_STATE = "asideState"
  const KEY_ASIDE_WIDTH_IN_PX = "asideWidthInPx"                 /* aside 넓이 */
  
  const initialState = JSON.parse(sessionStorage.getItem(KEY_ASIDE_STATE)) ?? {
    [KEY_ASIDE_WIDTH_IN_PX]: 0,
  }
  const [sFooterState, sSetFooterState] = useState(initialState)
  const _asideState = () => Object.assign({}, JSON.parse(sessionStorage.getItem(KEY_ASIDE_STATE)), sFooterState)
  const _setAsideState = (newUIState) => {
    Logger.debug(`UIStateProvider > _setAsideState ... newUIState: `, newUIState);
    sSetFooterState(newUIState)
    sessionStorage.setItem(KEY_ASIDE_STATE, JSON.stringify(newUIState));
  }

  //#region: aside 표출
  const asideVisible = () => _asideState()[KEY_ASIDE_WIDTH_IN_PX] > 0 ?? false;
  const setAsideVisible = (newV) => {
    Logger.debug(`UIStateProvider > setAsideVisible ... newV: ${newV}`)
    _setAsideState({
      ..._asideState,
      [KEY_ASIDE_WIDTH_IN_PX]: newV ? 236 : 0,
    })
  }
  const toggleAsideVisible = () => {
   Logger.debug(`UIStateProvider > toggleAsideVisible ... `)
   const newV = !asideVisible()
   _setAsideState({
     ..._asideState,
     [KEY_ASIDE_WIDTH_IN_PX]: newV ? 236 : 0,
   })
  }
  //#endregion: aside 표출
 
   //#region: aside 넓이조절
   const asideWidthInPx = () => _asideState()[KEY_ASIDE_WIDTH_IN_PX] ?? 0;
   const setAsideWidthInPx = (newV) => {
     Logger.debug(`UIStateProvider > setAsideWidthInPx ... newV: ${newV}`)
     _setAsideState({
       ..._asideState,
       [KEY_ASIDE_WIDTH_IN_PX]: newV
     })
   }
   //#endregion: Footer 높이조절

  return (
    <AsideStateContext.Provider value={
      {
        asideVisible, setAsideVisible, toggleAsideVisible,
        asideWidthInPx, setAsideWidthInPx,
      }
    }>
      {children}
    </AsideStateContext.Provider>
  )
}

export default AsideStateContext
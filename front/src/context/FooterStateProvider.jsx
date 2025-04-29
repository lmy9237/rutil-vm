import { useState, createContext } from "react";
import Logger from "../utils/Logger";

const FooterStateContext = createContext({});

export const FooterStateProvider = ({ children }) => {
  const KEY_FOOTER_STATE = "footerState"
  const KEY_FOOTER_HEIGHT_IN_PX = "footerHeightInPx"                  /* Footer 높이 */
  const KEY_FOOTER_JOB_REFETCH_INTERVAL = "footerJobRefetchInterval"; /* 최근작업 조회 처리 주기 (기본 5초) */
  
  const initialState = JSON.parse(sessionStorage.getItem(KEY_FOOTER_STATE)) ?? {
    [KEY_FOOTER_HEIGHT_IN_PX]: 0,
    [KEY_FOOTER_JOB_REFETCH_INTERVAL]: 5000,
  }
  const [sFooterState, sSetFooterState] = useState(initialState)
  const _footerState = () => Object.assign({}, JSON.parse(sessionStorage.getItem(KEY_FOOTER_STATE)), sFooterState)
  const _setFooterState = (newUIState) => {
    Logger.debug(`FooterStateProvider > _setFooterState ... newUIState: `, newUIState);
    sSetFooterState(newUIState)
    sessionStorage.setItem(KEY_FOOTER_STATE, JSON.stringify(newUIState));
  }

   //#region: Footer 표출
   const footerVisible = () => _footerState()[KEY_FOOTER_HEIGHT_IN_PX] > 40;
   const setFooterVisible = (newV) => {
     Logger.debug(`UIStateProvider > setFooterVisible ... newV: ${newV}`)
     _setFooterState({
       ..._footerState,
       [KEY_FOOTER_HEIGHT_IN_PX]: newV ? 168 : 40,
     })
   }
   const toggleFooterVisible = () => {
    Logger.debug(`UIStateProvider > toggleFooterVisible ... `)
    const newV = !footerVisible()
    _setFooterState({
      ..._footerState,
      [KEY_FOOTER_HEIGHT_IN_PX]: newV ? 168 : 40,
    })
   }
   //#endregion: Footer 표출
 
   //#region: Footer 높이조절
   const footerHeightInPx = () => _footerState()[KEY_FOOTER_HEIGHT_IN_PX] ?? 0;
   const setFooterHeightInPx = (newV) => {
     Logger.debug(`UIStateProvider > setFooterHeightInPx ... newV: ${newV}`)
     _setFooterState({
       ..._footerState,
       [KEY_FOOTER_HEIGHT_IN_PX]: newV
     })
   }
   //#endregion: Footer 높이조절
 
 
   //#region: 최근작업 조회 처리 주기 (기본 5초)
   const footerJobRefetchInterval = () => _footerState()[KEY_FOOTER_JOB_REFETCH_INTERVAL] ?? 5000;
   const setFooterJobRefetchInterval = (newV) => {
     Logger.debug(`UIStateProvider > footerJobRefetchInterval ... newV: ${newV}`)
     _setFooterState({
       ..._footerState,
       [KEY_FOOTER_JOB_REFETCH_INTERVAL]: newV
     });
   }
   //#endregion: 최근작업 조회 처리 주기 (기본 5초)

  return (
    <FooterStateContext.Provider value={
      {
        footerVisible, setFooterVisible, toggleFooterVisible,
        footerHeightInPx, setFooterHeightInPx,
        footerJobRefetchInterval, setFooterJobRefetchInterval, 
      }
    }>
      {children}
    </FooterStateContext.Provider>
  )
}

export default FooterStateContext
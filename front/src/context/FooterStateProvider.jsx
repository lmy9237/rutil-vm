import { useState, createContext, useEffect } from "react";
import Logger from "../utils/Logger";

const FooterStateContext = createContext({});

export const FooterStateProvider = ({ children }) => {
  const KEY_FOOTER_STATE = "footerState"
  const KEY_FOOTER_VISIBLE = "footerVisible"                          /* Footer 표출여부 */
  const KEY_FOOTER_DRAGGING = "footerDragging"                        /* Footer 높이조절 상태 */
  const KEY_FOOTER_OFFSET_Y = "footerOffsetY"                         /* Footer 높이 */
  const KEY_FOOTER_JOB_REFETCH_INTERVAL = "footerJobRefetchInterval"; /* 최근작업 조회 처리 주기 (기본 5초) */
  
  const initialState = JSON.parse(sessionStorage.getItem(KEY_FOOTER_STATE)) ?? {
    [KEY_FOOTER_VISIBLE]: false,
    [KEY_FOOTER_DRAGGING]: false,
    [KEY_FOOTER_OFFSET_Y]: 0,
    [KEY_FOOTER_JOB_REFETCH_INTERVAL]: 5000,
  }
  const [sFooterState, sSetFooterState] = useState(initialState)
  const _footerState = () => Object.assign({}, sFooterState, JSON.parse(sessionStorage.getItem(KEY_FOOTER_STATE)))
  const _setFooterState = (newUIState) => {
    Logger.debug(`FooterStateProvider > _setFooterState ... newUIState: `, newUIState);
    sSetFooterState(newUIState)
    sessionStorage.setItem(KEY_FOOTER_STATE, JSON.stringify(newUIState));
  }

   //#region: Footer 표출
   const footerVisible = () => _footerState()[KEY_FOOTER_VISIBLE] ?? false;
   const setFooterVisible = (newV) => {
     Logger.debug(`UIStateProvider > setFooterVisible ... newV: ${newV}`)
     _setFooterState({
       ..._footerState,
       [KEY_FOOTER_VISIBLE]: newV
     })
   }
   const toggleFooterVisible = () => {
     Logger.debug(`UIStateProvider > toggleFooterVisible ... `)
     setFooterVisible(!footerVisible())
   }
   //#endregion: Footer 표출
 
   //#region: Footer 높이조절 상태
   const footerDragging = () => _footerState()[KEY_FOOTER_DRAGGING] ?? false;
   const setFooterDragging = (newV) => {
     Logger.debug(`UIStateProvider > setFooterDragging ... newV: ${newV}`)
     _setFooterState({
       ..._footerState,
       [KEY_FOOTER_DRAGGING]: newV
     })
   }
   const toggleFooterDragging = () => {
     Logger.debug(`UIStateProvider > toggleFooterDragging ... `)
     setFooterDragging(!footerDragging())
   }
   //#endregion: Footer 높이조절 상태
 
   //#endregion: Footer 높이
   const footerOffsetY = () => _footerState()[KEY_FOOTER_OFFSET_Y] ?? 0;
   const setFooterOffsetY = (newV) => {
     Logger.debug(`UIStateProvider > setFooterOffsetY ... newV: ${newV}`)
     _setFooterState({
       ..._footerState,
       [KEY_FOOTER_OFFSET_Y]: parseInt(newV)
     })
   }
   //#endregion: Footer 높이
 
 
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

  Logger.debug(`FooterStateProvider ... `)
  return (
    <FooterStateContext.Provider value={
      {
        footerVisible, setFooterVisible, toggleFooterVisible,
        footerDragging, setFooterDragging, toggleFooterDragging,
        footerOffsetY, setFooterOffsetY,
        footerJobRefetchInterval, setFooterJobRefetchInterval, 
      }
    }>
      {children}
    </FooterStateContext.Provider>
  )
}

export default FooterStateContext
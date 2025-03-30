import Logger from "./utils/Logger";

/**
 * @name openNewTab
 * 
 * @param {string} action 액션코드
 */
export const openNewTab = (action, id="") => {
  Logger.debug(`navigation > openNewTab ... action: ${action}, id: ${id}`)
  let path = "/"
  switch(action) {
    case "console": path = id === "" ? path : `#/vnc/${id}`;break;
    default: path = "/";
  }
  window.open(path, "_blank", "noopener,noreferrer");
};

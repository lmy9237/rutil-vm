import { useContext, }  from "react";
import ContextMenuStateContext from "../context/ContextMenuStateProvider";

const useContextMenu = () => {
  return useContext(ContextMenuStateContext)
}

export default useContextMenu;
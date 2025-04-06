import { useContext, }  from "react";
import UIStateContext from "../context/UIStateProvider";

const useUIState = () => {
  return useContext(UIStateContext)
}

export default useUIState;
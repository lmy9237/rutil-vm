import { useContext, }  from "react";
import AsideStateContext from "../context/AsideStateProvider";

const useAsideState = () => {
  return useContext(AsideStateContext)
}

export default useAsideState;
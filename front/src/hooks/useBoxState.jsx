import { useContext, }  from "react";
import BoxStateContext from "../context/BoxStateProvider";

const useBoxState = () => {
  return useContext(BoxStateContext)
}

export default useBoxState;
import { useContext, }  from "react";
import FooterStateContext from "../context/FooterStateProvider";

const useFooterState = () => {
  return useContext(FooterStateContext)
}

export default useFooterState;
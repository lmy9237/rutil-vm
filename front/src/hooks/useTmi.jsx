import { useContext, }  from "react";
import TMIStateContext from "../context/TMIStateProvider";

const useTmi = () => {
  return useContext(TMIStateContext)
}

export default useTmi;
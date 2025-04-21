import React from "react"
import Spinner from "./Spinner";
import Localization from "../../utils/Localization";
import "./Loading.css";

const Loading = () => {
  
  return (
    <div className="f-center">
      <Spinner />
      <span>{Localization.kr.LOADING}{Localization.kr.IN_PROGRESS}</span>
    </div>
  );
};

export default Loading;

import React from "react"
import Spinner from "./Spinner";
import Localization from "../../utils/Localization";
import "./Loading.css";

const Loading = () => (
  <div className="f-center">
    <Spinner />
    <span>{Localization.kr.LOADING}{Localization.kr.IN_PROGRESS}</span>
  </div>
);

export default Loading;

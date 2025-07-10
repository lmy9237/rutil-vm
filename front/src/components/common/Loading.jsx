import React from "react"
import Spinner                from "@/components/common/Spinner";
import Localization           from "@/utils/Localization";
import "./Loading.css";

const Loading = ({
  text="",
  ...props
}) => (
  <div className="f-center loading-outer"
    {...props}
  >
    <Spinner />
    <span>{`${text} ${Localization.kr.LOADING}${Localization.kr.IN_PROGRESS}`}</span>
  </div>
);

export default Loading;

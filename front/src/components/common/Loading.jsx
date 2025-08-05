import React from "react"
import Spinner                from "@/components/common/Spinner";
import Localization           from "@/utils/Localization";
import "./Loading.css";

export const Loading = ({
  text="",
  ...props
}) => (
  <div className="f-center gap-4 loading-outer"
    {...props}
  >
    <Spinner />
    <span className="loading-text">{text || `${Localization.kr.LOADING}${Localization.kr.IN_PROGRESS}`}</span>
  </div>
);

export const LoadingFetch = ({
  isLoading, isRefetching,
  ...props
}) => (
  (isRefetching) && <div className="f-center gap-4"
    {...props}
  >
    <Spinner mini/>
    <span className="loading-text fs-10">{`${Localization.kr.SEARCH}${Localization.kr.IN_PROGRESS}`}</span>
  </div>
);

export default Loading;

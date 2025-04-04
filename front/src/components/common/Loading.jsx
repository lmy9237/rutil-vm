import Logger from "../../utils/Logger";
import "./Loading.css";

const Loading = () => {
  Logger.debug("Loading ...")
  return (
    <div className="f-center">
      <div className="spinner" />
      <span>로딩중 ...</span>
    </div>
  );
};

export default Loading;

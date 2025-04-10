import Logger from "../../utils/Logger";
import Spinner from "./Spinner";
import "./Loading.css";

const Loading = () => {
  Logger.debug("Loading ...")
  return (
    <div className="f-center">
      <Spinner />
      <span>로딩중 ...</span>
    </div>
  );
};

export default Loading;

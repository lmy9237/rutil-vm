import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useClickOutside from "../../hooks/useClickOutside";
import useUIState from "../../hooks/useUIState";
import Logger from "../../utils/Logger";
import "./BoxUser.css";

const BoxUser = ({

}) => {
  const navigate = useNavigate();
  const userBoxRef = useRef(null)
  const { setAuth } = useAuth();
  const stopPropagation = (e) => e.stopPropagation();

  const {
    loginBoxVisible, setLoginBoxVisible
  } = useUIState();

  useClickOutside(userBoxRef, (e) => {
    Logger.debug(`BoxUser > useClickOutside ...`);
    if (loginBoxVisible) setLoginBoxVisible(false)
  })

  const doLogout = (e) => {
    Logger.debug(`Header > doLogout ...`)
    e.preventDefault();
    setAuth({});
    navigate("/login");
  };

  Logger.debug(`BoxUser ...`)
  return (
    <div ref={userBoxRef}
      className="box-user"
      onClick={stopPropagation}
    >
      <div>계정설정</div>
      <div onClick={(e) => doLogout(e)}>로그아웃</div>
    </div>
  );
}

export default BoxUser;

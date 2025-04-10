import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useClickOutside from "../../hooks/useClickOutside";
import useUIState from "../../hooks/useUIState";
import Logger from "../../utils/Logger";
import "./BoxUser.css";

const BoxUser = ({ onOpenSetting }) => {
  const navigate = useNavigate();
  const userBoxRef = useRef(null);
  const { setAuth } = useAuth();

  const {
    loginBoxVisible, setLoginBoxVisible
  } = useUIState();

  const stopPropagation = (e) => e.stopPropagation();

  useClickOutside(userBoxRef, (e) => {
    if (loginBoxVisible) {
      setLoginBoxVisible(false);
    }
  });

  const handleOpenSetting = () => {
    Logger.debug("BoxUser > 계정 설정 클릭");
    onOpenSetting();               // 상위에서 모달 열기
    setLoginBoxVisible(false);     // 드롭다운 닫기
  };

  const doLogout = (e) => {
    Logger.debug("Header > doLogout ...");
    e.preventDefault();
    setAuth({});
    navigate("/login");
  };

  return (
    <div ref={userBoxRef} className="box-user" onClick={stopPropagation}>
      <div onClick={handleOpenSetting}>계정설정</div>
      <div onClick={(e) => doLogout(e)}>로그아웃</div>
    </div>
  );
};

export default BoxUser;

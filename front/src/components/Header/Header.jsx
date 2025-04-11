import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogoIcon,
  TopMenuIcon,
  rvi24Hamburger,
  rvi24Refresh,
  rvi24Gear,
  rvi24Bell,
  rvi24PersonCircle,
  rvi24BellNew,
} from "../icons/RutilVmIcons";
import useUIState from "../../hooks/useUIState";
import BoxEvent from "./BoxEvent";
import BoxUser from "./BoxUser";
import "./Header.css";
import SettingUsersModal from "../modal/settings/SettingUsersModal";
import "./Header.css";
import Logger from "../../utils/Logger";

/**
 * @name Header
 * @description 헤더
 *
 * @prop {JSX.useState} setAuthenticated
 * @returns {JSX.Element} Header
 */
const Header = () => {
  const navigate = useNavigate();
  const {
    eventBadgeNum, toggleAsideVisible,
    eventBoxVisible, toggleEventBoxVisible,
    loginBoxVisible, toggleLoginBoxVisible,
  } = useUIState();

  const [activeModal, setActiveModal] = useState(null); 
  const user = JSON.parse(localStorage.getItem("user")) || [];
  const handleOpenChangePassword = () => {
    setActiveModal("changePassword");
  };
  

  Logger.debug(`Header ...`)
  return (
    <div className="header f-btw">
      <div id="header-left" className="f-start">
        <TopMenuIcon 
          iconDef={rvi24Hamburger("white")} 
          onClick={() => toggleAsideVisible()} />
        <LogoIcon disableHover={true} 
          onClick={() => navigate("/")} />
      </div>

      <div id="header-right" className="f-end">
        {/* 새로고침 */}
        <TopMenuIcon
          iconDef={rvi24Refresh("white")}
          onClick={() => window.location.reload()}
        />
        {/* 설정 */}
        <TopMenuIcon
          iconDef={rvi24Gear("white")}
          onClick={() => navigate("/settings/users")}
        />
        {/* 알림 */}
        <TopMenuIcon
          iconDef={
            (eventBadgeNum > 0) 
              ? rvi24BellNew("white")
              : rvi24Bell("white")
          }
          onClick={(e) => {
            e.stopPropagation();
            toggleEventBoxVisible()
          }}
        />
        {eventBoxVisible && <BoxEvent />}
        
        {/* 사용자 버튼 */}
        <TopMenuIcon
          iconDef={rvi24PersonCircle("white")}
          onClick={(e) => {
            e.stopPropagation();
            toggleLoginBoxVisible();
          }}
        />
        {loginBoxVisible && <BoxUser onOpenSetting={handleOpenChangePassword} />}
      </div>
      <SettingUsersModal
        isOpen={activeModal === "changePassword"}
        onClose={() => setActiveModal(null)}
        targetName={"사용자"}
        user={user[0]}
        changePassword
      />
    </div>
  );
};

export default Header;

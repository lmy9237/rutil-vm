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
} from "../icons/RutilVmIcons";
import useUIState from "../../hooks/useUIState";
import BoxEvent from "./BoxEvent";
import Logger from "../../utils/Logger";
import BoxUser from "./BoxUser";
import "./Header.css";

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
    toggleAsideVisible,
    eventBoxVisible, toggleEventBoxVisible,
    loginBoxVisible, toggleLoginBoxVisible,
  } = useUIState();

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
          iconDef={rvi24Bell("white")}
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
        {loginBoxVisible && <BoxUser />}
      </div>
    </div>
  );
};

export default Header;

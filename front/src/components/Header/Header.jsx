import React from "react";
import { useNavigate } from "react-router-dom";
import useSearch              from "@/hooks/useSearch";
import useAsideState          from "@/hooks/useAsideState";
import useBoxState            from "@/hooks/useBoxState";
import useFooterState         from "@/hooks/useFooterState";
import useTmi                 from "@/hooks/useTmi";
import {
  LogoIcon,
  TopMenuIcon,
  rvi24Hamburger,
  rvi24Refresh,
  rvi24Gear,
  rvi24Bell,
  rvi24PersonCircle,
  rvi24BellNew,
} from "@/components/icons/RutilVmIcons";
import Logger                 from "@/utils/Logger";
import "./Header.css";
import BoxEvent               from "./BoxEvent";
import BoxUser                from "./BoxUser";

/**
 * @name Header
 * @description 헤더
 *
 * @prop {JSX.useState} setAuthenticated
 * @returns {JSX.Element} Header
 */
const Header = () => {
  const navigate = useNavigate();
  const { toggleAsideVisible } = useAsideState();
  const { setFooterHeightInPx } = useFooterState()
  const {
    eventBadgeNum,
    eventBoxVisible, toggleEventBoxVisible,
    loginBoxVisible, toggleLoginBoxVisible,
  } = useBoxState()
  const {
    setTmiLastSelected
  } = useTmi();

  Logger.debug(`Header ...`)
  return (
    <div className="header f-btw">
      <div id="header-left" className="f-start">
        <TopMenuIcon 
          iconDef={rvi24Hamburger("white")} 
          onClick={(e) => {
            e.stopPropagation()
            toggleAsideVisible()
          }} />
        <LogoIcon disableHover={true} 
          onClick={() => navigate("/")} />
      </div>

      <div id="header-right" className="f-end">
        <TopMenuIcon iconDef={rvi24Refresh("white")}
          onClick={() => {
            setFooterHeightInPx(40)
            window.location.reload()
          }}
        />
        {/* 설정 */}
        <TopMenuIcon iconDef={rvi24Gear("white")}
          onClick={(e) => {
            navigate("/settings/users")
            setTmiLastSelected("settings")
          }}
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
        {eventBoxVisible() && <BoxEvent />}
        
        {/* 사용자 버튼 */}
        <TopMenuIcon iconDef={rvi24PersonCircle("white")}
          onClick={(e) => {
            e.stopPropagation();
            toggleLoginBoxVisible();
          }}
        />
        {loginBoxVisible() && <BoxUser />}
      </div>
    </div>
  );
};

export default Header;

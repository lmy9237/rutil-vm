import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUIState from "../../hooks/useUIState";
import useTmi from "../../hooks/useTmi";
import SideNavbar from "./SideNavbar";
import SidebarTree from "./SidebarTree";
import Logger from "../../utils/Logger";
import "./MainOuter.css";
import useAsideState from "../../hooks/useAsideState";

/**
 * @name MainOuter
 * @description ...
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} MainOuter
 *
 */
const MainOuter = ({ 
  children, 
}) => {
  const { tmiLastSelected, setTmiLastSelected, } = useTmi();
  const { 
    asideVisible, asideWidthInPx,
    setAsideWidthInPx
  } = useAsideState()

  const [asidePopupVisible, setAsidePopupVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("general");

  useEffect(() => {
    const waveGraph = document.querySelector(".wave_graph");
    if (waveGraph) {
      if (tmiLastSelected === "dashboard" && asidePopupVisible) {
        waveGraph.style.marginLeft = "0"; // Dashboard일 때 aside-popup 열려있으면 margin-left를 0으로
      } else {
        waveGraph.style.marginLeft = "1rem"; // 기본값
      }
    }
  }, [tmiLastSelected, asidePopupVisible]); // selected와 asidePopupVisible이 변경될 때 실행
  // 상태가 변경될 때마다 localStorage에 저장

  /* aside-popup 화면사이즈드레그 */
  const ASIDE_RIGHT_VERT_BAR_WIDTH = 236
  const [asideWidth, setAsideWidth] = useState(ASIDE_RIGHT_VERT_BAR_WIDTH); // 초기 사이드바 너비
  const handleMouseDown = (mouseDownEvent) => {
    Logger.debug(`MainOuter > handleMouseDown ... `)

    function onMouseMove(mouseMoveEvent) {
      const totalWidth = window.innerWidth;
      Logger.debug(`MainOuter > handleMouseDown > onMouseMove ... totalWidth: ${totalWidth}, clientX: ${mouseMoveEvent.clientX}`)
      // setAsideWidth(totalWidth - mouseMoveEvent.clientX)
      setAsideWidth(mouseMoveEvent.clientX)
    }
    function onMouseUp() {
      Logger.debug(`MainOuter > handleMouseDown > onMouseUp ... `)
      document.body.removeEventListener("mousemove", onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }
    
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  }
  
  useEffect(() => {
    Logger.debug(`JobFooter > useEffect ... asideWidth: ${asideWidth}`)
    setAsideWidthInPx(asideWidth)
  }, [asideWidth])

  return (
    <>
      <div
        className={`main-outer f-start`}
      >
        
        <div
          style={{ 
            display: asideVisible() ? `block` : `none`,
            width: `${asideWidth}px`,
            minWidth: asideWidth < 236 ? 236 : asideWidth
          }}
          className={`aside-outer `}
        >
          <SideNavbar />
          <SidebarTree />{/* 크기 조절 핸들 */}
        </div>
        
        <div className="resizer" 
          style={{ left: `${asideWidth}px` }}
          onMouseDown={handleMouseDown}
        />
        {React.cloneElement(children, {
          activeSection, setActiveSection,
        })}
      </div>
    </>
  );
};

export default MainOuter;

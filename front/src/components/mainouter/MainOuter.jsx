import React, { useEffect, useState } from "react";
import useAsideState from "../../hooks/useAsideState";
import SideNavbar from "./SideNavbar";
import SidebarTree from "./SidebarTree";
import Logger from "../../utils/Logger";
import "./MainOuter.css";

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
  const { 
    asideVisible, setAsideWidthInPx
  } = useAsideState()

  const [activeSection, setActiveSection] = useState("general");

  /* aside-popup 화면사이즈드레그 */
  const [asideWidth, setAsideWidth] = useState(asideVisible ?? 236); // 초기 사이드바 너비
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
    Logger.debug(`MainOuter > useEffect ... asideWidth: ${asideWidth}`)
    setAsideWidthInPx(asideWidth)
  }, [asideWidth])

  useEffect(() => {
    Logger.debug(`MainOuter > useEffect ... asideVisible: ${asideVisible}`)
    setAsideWidth(asideVisible ? asideWidth : 0)
  }, [asideVisible])

  return (
    <>
      <div
        className={`main-outer f-start`}
      >
        <div
          style={{ 
            display: asideVisible ? `block` : `none`,
            width: `${asideWidth}px`,
            minWidth: asideWidth < 236 ? 236 : asideWidth
          }}
          className={`aside-outer${(asideVisible ? `` : " closed")}`}
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

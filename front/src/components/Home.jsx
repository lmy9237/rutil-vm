import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import useUIState from "../hooks/useUIState";
import Header from "./Header/Header";
import MainOuter from "./mainouter/MainOuter";
import JobFooter from "./footer/JobFooter";
import Logger from "../utils/Logger";
import "./Home.css"
import useFooterState from "../hooks/useFooterState";

const Home = () => {
  const [_footerOffsetY, _setFooterOffsetY] = useState(10)
  const {
    footerVisible, toggleFooterVisible,
    footerDragging, setFooterDragging,
    footerOffsetY, setFooterOffsetY,
    footerJobRefetchInterval
  } = useFooterState()

  /*
  const handleMouseDown = (e) => {
    Logger.debug(`JobFooter > handleMouseDown ... `)
    setFooterDragging(true)
  }
  
  useEffect(() => {
    if (!footerDragging()) {
      setFooterOffsetY(_footerOffsetY)
      return;
    }
  
    const handleMouseMove = (e) => {
      _setFooterOffsetY(Math.max(0, e.clientY));
    };
    const handleMouseUp = () => {
      setFooterDragging(false);
    };
  
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [footerDragging]);
  */

  Logger.debug(`Home ...`)
  return (
    <>
      <Header/>
      <MainOuter>
        <Outlet/>
      </MainOuter>
      
      {/* 드래그바 */}
      <div className="footer-resizer f-center"
      />
      <JobFooter/>
    </>
  );
};

export default Home;

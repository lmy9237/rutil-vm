import { useEffect, useState } from "react"
import RightClickMenu from "./common/RightClickMenu";
import { Outlet } from "react-router-dom";
import useFooterState from "../hooks/useFooterState";
import Header from "./Header/Header";
import MainOuter from "./mainouter/MainOuter";
import JobFooter from "./footer/JobFooter";
import Logger from "../utils/Logger";
import "./Home.css"

const Home = () => {
  const {
    footerVisible, toggleFooterVisible,
    footerDragging, setFooterDragging,
    footerOffsetY, setFooterOffsetY,
    footerJobRefetchInterval
  } = useFooterState()

  return (
    <>
      <Header/>
      <MainOuter>
        <Outlet/>
      </MainOuter>
      
      {/* 드래그바 */}
      {/* <div className="footer-resizer f-center"
        onMouseDown={handler}
        style={{
          bottom: `${footerHeight}px`
        }}
      />
      <JobFooter
        style={{ height: `${footerHeight}px` }}
      /> */}
      <JobFooter />
      <RightClickMenu />
    </>
  );
};

export default Home;

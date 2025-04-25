import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import RightClickMenu from "./common/RightClickMenu";
import MainOuter from "./mainouter/MainOuter";
import JobFooter from "./footer/JobFooter";
import "./Home.css"

const Home = () => {

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

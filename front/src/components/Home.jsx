import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import MainOuter from "./mainouter/MainOuter";
import JobFooter from "./footer/JobFooter";
import Logger from "../utils/Logger";

const Home = () => {
  Logger.debug(`Home ...`)
  return (
    <>
      <Header/>
      <MainOuter>
        <Outlet/>
      </MainOuter>
      <JobFooter/>
    </>
  );
};

export default Home;

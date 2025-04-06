import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import MainOuter from "./mainouter/MainOuter";
import Footer from "./footer/Footer";
import Logger from "../utils/Logger";

const Home = () => {
  Logger.debug(`Home ...`)
  return (
    <>
      <Header/>
      <MainOuter>
        <Outlet/>
      </MainOuter>
      <Footer/>
    </>
  );
};

export default Home;

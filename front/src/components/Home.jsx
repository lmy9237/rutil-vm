import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "./Header/Header";
import MainOuter from "./mainouter/MainOuter";
import Footer from "./footer/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [asideVisible, setAsideVisible] = useState(true); // aside-outer 상태 관리
  const toggleAside = () => {
    console.log(`App > toggleAside ...`);
    setAsideVisible((prev) => !prev); // 열림/닫힘 상태만 변경
  };
  const [isFooterContentVisible, setIsFooterContentVisible] = useState(false);

  return (
    <>
      <Header toggleAside={toggleAside} />
      <MainOuter
        asideVisible={asideVisible}
        setAsideVisible={setAsideVisible}
        isFooterContentVisible={isFooterContentVisible}
      >
        <Outlet/>
      </MainOuter>
      <Footer
        isFooterContentVisible={isFooterContentVisible}
        setIsFooterContentVisible={setIsFooterContentVisible}
      />
    </>
  );
};

export default Home;

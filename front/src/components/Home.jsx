import { Outlet } from "react-router-dom";
import CONSTANT                      from "@/Constants";
import { Watermark }                 from "@/components/common/Watermark"
import Header                        from "./Header/Header";
import RightClickMenu                from "./common/RightClickMenu";
import MainOuter                     from "./mainouter/MainOuter";
import JobFooter                     from "./footer/JobFooter";
import {
  useDashboard,
} from "@/api/RQHook";
import Localization                  from "@/utils/Localization";
import "./Home.css"

const Home = () => {
  
  const {
    data: dashboard
  } = useDashboard();  

  return (
    <>
      <Watermark 
        text={!CONSTANT.isLicenseVerified 
          ? `v${dashboard?.version}-${dashboard?.buildNo || 0} (${CONSTANT.watermarkText})`
          : null
        }
        className="f-btw w-full h-full"
      />
      <Header/>
      <MainOuter>
        <Outlet/>
      </MainOuter>
      <JobFooter />
      <RightClickMenu />
    </>
  );
};

export default Home;

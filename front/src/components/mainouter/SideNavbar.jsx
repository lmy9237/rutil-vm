import React, { useEffect, useRef } from "react";
import { Link, useLocation, } from "react-router-dom";
import useTmi from "../../hooks/useTmi";
import {
  RVI24,
  rvi24Desktop,
  rvi24Network,
  rvi24Storage,
  rvi24Event,
} from "../icons/RutilVmIcons";
import Logger from "../../utils/Logger";
import "./MainOuter.css";

const SideNavbar = () => {
  const location = useLocation();
  const {
    tmiLastSelected, setTmiLastSelected
  } = useTmi();

  // 📌 현재 URL에 맞춰 버튼 활성화
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/computing"))     handleClick("computing");
    else if (path.includes("/networks")) handleClick("network");
    else if (path.includes("/storages")) handleClick("storage");
    else if (path.includes("/events"))   handleClick("event");
    else if (path.includes("/settings")) handleClick("settings"); // /settings가 들어가 있을 때
    else                                 handleClick("dashboard");
  }, [location.pathname]);

  // 📌 버튼 클릭 시 선택 처리
  const handleClick = (id) => {
    Logger.debug(`SideNavbar > handleClick ... id: ${id}`)
    // 이벤트/설정 제외, 마지막 선택 항목 저장
    if (id !== "settings") {
      setTmiLastSelected(id);
    }
  };

  // 📌 버튼 UI 설정
  const sections = [
    // { iconDef: rvi24Dashboard,    id: "dashboard", link: "/",  },
    { iconDef: rvi24Desktop("currentColor"),      id: "computing", link: "/computing/vms",  },
    { iconDef: rvi24Network("currentColor"),      id: "network",   link: "/networks",  },
    { iconDef: rvi24Storage("currentColor"),      id: "storage",   link: "/storages/domains",  },
    // 추가가 필요할 시 주석 해제
    // { iconDef: rvi24Gear("#9999999"),          id: "settings",  link: "/settings/session",  },
    { iconDef: rvi24Event("currentColor"),        id: "event",     link: "/events",  },
  ];

  return (
    <div id="aside" className="f-center fs-24">
      <div className="nav f-start">
        {sections.map(({ iconDef, id, link }) => (
          <Link key={id} to={link} 
            className={`rvi rvi-nav ${tmiLastSelected === id ? "active" : ""}`}
            onClick={() => handleClick(id)}
          >
            <RVI24 iconDef={iconDef} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideNavbar;

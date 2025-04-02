import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  RVI24,
  rvi24Desktop,
  rvi24Network,
  rvi24Storage,
  rvi24Event,
} from "../icons/RutilVmIcons";
import "./MainOuter.css"; // 기존 스타일 유지

const SideNavbar = ({
  asideVisible,
  selectedSection,
  setSelectedSection,
  getBackgroundColor,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const firstRender = useRef()
  const [lastSelected, setLastSelected] = useState(() => localStorage.getItem("lastSelected") || "computing");

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
    if (id !== selectedSection) {
      setSelectedSection(id);
      localStorage.setItem("selected", id);
    }

    // 이벤트/설정 제외, 마지막 선택 항목 저장
    if (id !== "event" && id !== "settings" && id !=="dashboard") {
      setLastSelected(id);
      localStorage.setItem("lastSelected", id);
    }
  };

  // 📌 버튼 UI 설정
  const sections = [
    // { iconDef: rvi24Dashboard,    id: "dashboard", link: "/",  },
    { iconDef: rvi24Desktop("currentColor"),      id: "computing", link: "/computing/vms",  },
    { iconDef: rvi24Network("currentColor"),      id: "network",   link: "/networks",  },
    { iconDef: rvi24Storage("currentColor"),      id: "storage",   link: "/storages/domains",  },
    // 추가가 필요할 시 주석 해제
    // { iconDef: rvi24Gear("#9999999"),       id: "settings",  link: "/settings/session",  },
    { iconDef: rvi24Event("currentColor"),        id: "event",     link: "/events",  },
  ];

  useEffect(() => {
    if (firstRender.currrent) {
      firstRender.current = false;
      setSelectedSection("computing");
    }
    return;
  });
  
  const isMenuActive = (id) => {
    if (id === "computing" && firstRender.current) return false
    return selectedSection === id
  }

  return (
    <div id="aside">
      <div className="nav">
        {sections.map(({ iconDef, id, link }) => (
          <Link key={id} to={link} 
            className={`rvi rvi-nav ${isMenuActive(id) ? "active" : ""}`}
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

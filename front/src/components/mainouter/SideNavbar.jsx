import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MainOuter.css"; // 기존 스타일 유지
import {
  NavIconDash,
  NavIconVM,
  NavIconNetwork,
  NavIconStorage,
  NavIconEvent,
} from "../icons/RutilVmIcons";

const SideNavbar = ({
  asideVisible,
  selectedSection,
  setSelectedSection,
  getBackgroundColor,
}) => {
  const location = useLocation();
  const [asidePopupVisible, setAsidePopupVisible] = useState(true);
  const [lastSelected, setLastSelected] = useState(
    () => localStorage.getItem("lastSelected") || "computing"
  );

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
      toggleAsidePopup(id);
      setAsidePopupVisible(true);
      localStorage.setItem("selected", id);
    }

    // 이벤트/설정 제외, 마지막 선택 항목 저장
    if (id !== "event" && id !== "settings" && id !== "dashboard") {
      setLastSelected(id);
      localStorage.setItem("lastSelected", id);
    }
  };

  // 📌 배경색 토글
  const toggleAsidePopup = (id) => {
    
  };

  // 📌 버튼 UI 설정
  const sections = [
    { icon: <NavIconDash />,    id: "dashboard", link: "/",  },
    { icon: <NavIconVM />,      id: "computing", link: "/computing/vms",  },
    { icon: <NavIconNetwork />, id: "network",   link: "/networks",  },
    { icon: <NavIconStorage />, id: "storage",   link: "/storages/domains",  },
    { icon: <NavIconEvent />,   id: "event",     link: "/events",  },
  ];

  return (
    <div id="aside">
      <div className="nav">
        {sections.map(({ icon, id, link }) => (
          <Link key={id} to={link} 
            className={`rvi rvi-nav ${selectedSection === id ? "active" : ""}`}
            onClick={() => handleClick(id)}
          >
            {icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideNavbar;

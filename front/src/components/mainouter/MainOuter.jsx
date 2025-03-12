import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { adjustFontSize } from "../../UIEvent";
import "./MainOuter.css";
import SideNavbar from "./SideNavbar";
import SidebarTree from "./SidebarTree";

/**
 * @name MainOuter
 * @description ...
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} MainOuter
 *
 */
const MainOuter = ({ 
  children, 
  asideVisible, 
  setAsideVisible,
  isFooterContentVisible
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  /* aside-popup화면사이즈드레그 */
  const [sidebarWidth, setSidebarWidth] = useState(240); // 초기 사이드바 너비 (%)
  const asideStyles = {
    width: asideVisible ? `${sidebarWidth}px` : "0px", // 닫힐 때 0px
    minWidth: asideVisible ? "240px" : "0px", // 최소 크기 설정
  };
  const resizerRef = useRef(null);
  const isResizing = useRef(false);
  const xRef = useRef(0);
  const leftWidthRef = useRef(0);
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    isResizing.current = true;
    xRef.current = e.clientX;
    leftWidthRef.current = sidebarWidth;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    document.body.style.userSelect = "none"; // ✅ 드래그 중 텍스트 선택 방lo지
    document.body.style.cursor = "col-resize"; // ✅ 드래그 중 커서 고정
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    requestAnimationFrame(() => {
      const dx = e.clientX - xRef.current; // 이동한 거리 (픽셀)
      const newWidth = leftWidthRef.current + dx; // 기존 너비에 이동 거리 더하기

      if (newWidth > 240 && newWidth < 700) {
        // 사이드바 최소/최대 너비 설정
        setSidebarWidth(newWidth);
      }
    });
  };
  const handleMouseUp = () => {
    isResizing.current = false;

    document.body.style.userSelect = "auto"; // ✅ 드래그 끝나면 다시 원래대로
    document.body.style.cursor = "default"; // ✅ 드래그 끝나면 기본 커서로 복구
  };

  /* */
  const [isResponsive, setIsResponsive] = useState(window.innerWidth <= 1420);

  useEffect(() => {
    const handleResize = () => {
      const isNowResponsive = window.innerWidth <= 1420;
      setIsResponsive(isNowResponsive);

      if (isNowResponsive) {
        setAsideVisible(false); // ✅ 1420px 이하일 때 aside 자동 닫기
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 렌더링 시 체크

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [lastSelected, setLastSelected] = useState(null); // 마지막 선택 항목 저장
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [asidePopupVisible, setAsidePopupVisible] = useState(true);
  const [asidePopupBackgroundColor, setAsidePopupBackgroundColor] = useState({
    dashboard: "",
    computing: "",
    storage: "",
    network: "",
    settings: "",
    event: "",
    default: "rgb(218, 236, 245)",
  });
  const [selected, setSelected] = useState(
    () => localStorage.getItem("selected") || "dashboard"
  );
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [activeSection, setActiveSection] = useState("general");
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 초기 대시보드섹션 설정

  // url에 따라 맞는버튼 색칠
  const [selectedDiv, setSelectedDiv] = useState(null);
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/computing")) {
      handleClick("computing"); // /computing이 들어가 있을 때
    } else if (path.includes("/networks")) {
      handleClick("network"); // /networks가 들어가 있을 때
    } else if (path.includes("/vnicProfiles")) {
      handleClick("network"); // /networks가 들어가 있을 때
    } else if (path.includes("/storages")) {
      handleClick("storage"); // /storages가 들어가 있을 때
    } else if (path.includes("/events")) {
      handleClick("event"); // /events가 들어가 있을 때
    } else if (path.includes("/settings")) {
      handleClick("settings"); // /settings가 들어가 있을 때
    } else {
      handleClick("dashboard"); // 기본적으로 dashboard로 설정
    }
  }, [location.pathname]);


  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split("/");
    const lastId = pathParts[pathParts.length - 1]; // 마지막 부분이 ID

    setSelectedDiv(lastId);
  }, [location.pathname]);



  useEffect(() => {
    const waveGraph = document.querySelector(".wave_graph");
    if (waveGraph) {
      if (selected === "dashboard" && asidePopupVisible) {
        waveGraph.style.marginLeft = "0"; // Dashboard일 때 aside-popup 열려있으면 margin-left를 0으로
      } else {
        waveGraph.style.marginLeft = "1rem"; // 기본값
      }
    }
  }, [selected, asidePopupVisible]); // selected와 asidePopupVisible이 변경될 때 실행
  // 새로고침해도 섹션유지-----------------------------
  
  const [isSecondVisible, setIsSecondVisible] = useState(
    JSON.parse(localStorage.getItem("isSecondVisible")) || false
  );
  const [openDataCenters, setOpenDataCenters] = useState(
    () => JSON.parse(localStorage.getItem("openDataCenters")) || {}
  );
  const [openClusters, setOpenClusters] = useState(
    () => JSON.parse(localStorage.getItem("openClusters")) || {}
  );
  const [openHosts, setOpenHosts] = useState(
    () => JSON.parse(localStorage.getItem("openHosts")) || {}
  );
  const [openDomains, setOpenDomains] = useState(
    () => JSON.parse(localStorage.getItem("openDomains")) || {}
  );
  const [openNetworks, setOpenNetworks] = useState(
    () => JSON.parse(localStorage.getItem("openNetworks")) || {}
  );
  const [openComputingDataCenters, setOpenComputingDataCenters] = useState(
    () => JSON.parse(localStorage.getItem("openComputingDataCenters")) || {}
  );
  const [openNetworkDataCenters, setOpenNetworkDataCenters] = useState(
    () => JSON.parse(localStorage.getItem("openNetworkDataCenters")) || {}
  );
  const getPaddingLeft = (hasChildren, basePadding = "1rem", extraPadding = "0.6rem") => {
    return hasChildren ? extraPadding : basePadding;
  };
  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("isSecondVisible", JSON.stringify(isSecondVisible));
  }, [isSecondVisible]);

  useEffect(() => {
    localStorage.setItem("openDataCenters", JSON.stringify(openDataCenters));
  }, [openDataCenters]);

  useEffect(() => {
    localStorage.setItem("openClusters", JSON.stringify(openClusters));
  }, [openClusters]);

  useEffect(() => {
    localStorage.setItem("openHosts", JSON.stringify(openHosts));
  }, [openHosts]);

  useEffect(() => {
    localStorage.setItem("openDomains", JSON.stringify(openDomains));
  }, [openDomains]);

  useEffect(() => {
    localStorage.setItem("openNetworks", JSON.stringify(openNetworks));
  }, [openNetworks]);
  useEffect(() => {
    localStorage.setItem(
      "openComputingDataCenters",
      JSON.stringify(openComputingDataCenters)
    );
  }, [openComputingDataCenters]);

  useEffect(() => {
    localStorage.setItem(
      "openNetworkDataCenters",
      JSON.stringify(openNetworkDataCenters)
    );
  }, [openNetworkDataCenters]);

  useEffect(() => {
    window.addEventListener("resize", adjustFontSize);
    adjustFontSize();
    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, []);

  const handleDetailClickStorage = (diskName) => {
    if (selectedDisk !== diskName) {
      setSelectedDisk(diskName);
      setSelectedDiv(null);
      navigate(`/storages/disks/${diskName}`);
    }
  };

  const handleClick = (id) => {
    if (id !== selected) {
      setSelected(id); // 선택한 섹션만 업데이트
      toggleAsidePopup(id); // 배경색 설정
      setAsidePopupVisible(true); // 항상 열림 상태 유지
      localStorage.setItem("selected", id); // 로컬 스토리지 저장
    }
    // 이벤트와 설정을 제외한 경우에만 마지막 선택 항목을 저장
    if (id !== "event" && id !== "settings" && id !== "dashboard") {
      setLastSelected(id);
      localStorage.setItem("lastSelected", id); // 로컬 스토리지에 저장
    }
  };

  // 초기에는 가상머신 섹션을 마지막 섹션으로 설정
  useEffect(() => {
    if (isInitialLoad && selected === "dashboard") {
      setLastSelected("computing");
    }
    setIsInitialLoad(false);
  }, [isInitialLoad, selected]);


  useEffect(() => {
    // 페이지가 처음 로드될 때 기본적으로 dashboard가 선택되도록 설정
    setSelected("dashboard");
    setLastSelected("computing");
    toggleAsidePopup("dashboard");
  }, []);
  useEffect(() => {
    // 페이지가 처음 로드될 때 기본적으로 computing 섹션이 선택되도록 설정
    setSelected("computing");
    toggleAsidePopup("computing");
    setSelectedDiv(null); // 루틸매니저가 선택되지 않도록 초기화
  }, []);

  const toggleAsidePopup = (id) => {
    const newBackgroundColor = {
      dashboard: "",
      computing: "",
      storage: "",
      network: "",
      setting: "",
      event: "",
      default: "",
    };
    // selected 값에 따라 색상을 변경하는 로직
    if (id === "dashboard") {
      newBackgroundColor.dashboard = "rgb(218, 236, 245)";
    } else if (id === "computing") {
      newBackgroundColor.computing = "rgb(218, 236, 245)";
    } else if (id === "storage") {
      newBackgroundColor.storage = "rgb(218, 236, 245)";
    } else if (id === "network") {
      newBackgroundColor.network = "rgb(218, 236, 245)";
    } else if (id === "event") {
      newBackgroundColor.event = "rgb(218, 236, 245)";
    } else if (id === "settings") {
      newBackgroundColor.settings = "rgb(218, 236, 245)";
    }
    setAsidePopupBackgroundColor(newBackgroundColor);
  };
  const [selectedSection, setSelectedSection] = useState(() => localStorage.getItem("selected") || "dashboard");
  // 저장된 항목에 맞춰 배경색 초기화
  useEffect(() => {
    const savedSelected = localStorage.getItem("selected");
    const savedLastSelected = localStorage.getItem("lastSelected");
    if (savedSelected) {
      setSelected(savedSelected);
      toggleAsidePopup(savedSelected);
    } else {
      setSelected("dashboard");
      toggleAsidePopup("dashboard");
    }
    if (savedLastSelected) {
      setLastSelected(savedLastSelected);
    }
  }, []);
  // id포함유무에 따라 배경색결정
  const getBackgroundColor = (id) => {
    const path = location.pathname;
    return path.includes(id) ? "rgb(218, 236, 245)" : "";
  };

  const handleMainClick = () => {
    setContextMenuVisible(false);
    setContextMenuTarget(null);
  };

  const asideClasses = `aside-outer ${asideVisible ? "open" : "closed"} ${window.innerWidth <= 1420 ? "responsive-closed" : ""}`;

  return (
    <div
      className={`main-outer${isFooterContentVisible ? " open" : ""}`}  
      onClick={handleMainClick}
    >
      <div className={asideClasses} style={asideStyles}>
        <SideNavbar
          asideVisible={asideVisible}
          setAsideVisible={setAsideVisible}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          getBackgroundColor={getBackgroundColor}
        />

        {/* 크기 조절 핸들 */}

        <SidebarTree
          selected={selectedSection}
          getBackgroundColor={(id) =>
            location.pathname.includes(id) ? "rgb(218, 236, 245)" : ""
          }
        />
          <div
            ref={resizerRef}
            className="resizer"
            onMouseDown={handleMouseDown}
          />
      </div>

      {React.cloneElement(children, {
        activeSection,
        setActiveSection,
        selectedDisk, // 선택된 디스크 이름을 자식 컴포넌트로 전달
        onDiskClick: handleDetailClickStorage, // 디스크 클릭 핸들러 전달
      })}

      <div
        className="context-menu"
        style={{
          display: contextMenuVisible ? "block" : "none",
          top: `${contextMenuPosition.y}px`,
          left: `${contextMenuPosition.x}px`,
        }}
      >
        <div>새로 만들기</div>
        <div>새로운 도메인</div>
        <div>도메인 가져오기</div>
        <div>도메인 관리</div>
        <div>삭제</div>
        <div>Connections</div>
      </div>
    </div>
  );
};

export default MainOuter;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import SidebarTree from "./SidebarTree";
import useUIState from "../../hooks/useUIState";
import Logger from "../../utils/Logger";
import "./MainOuter.css";

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
}) => {
  const {
    footerVisible , asideVisible, setAsideVisible,
    tmiLastSelected, setTmiLastSelected,
  } = useUIState();
  const navigate = useNavigate();
  const location = useLocation();

  /* aside-popup 화면사이즈드레그 */
  const [sidebarWidth, setSidebarWidth] = useState(240); // 초기 사이드바 너비 (%)
  const asideStyles = {
    width: asideVisible ? `${sidebarWidth}px` : "0px", // 닫힐 때 0px
    minWidth: asideVisible ? "245px" : "0px", // 최소 크기 설정
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
    Logger.debug(`MainOuter > handleMouseDown ... e.clientX: ${e.clientX}`)
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
    Logger.debug(`MainOuter > handleMouseUp ...`)
    isResizing.current = false;
    document.body.style.userSelect = "auto"; // ✅ 드래그 끝나면 다시 원래대로
    document.body.style.cursor = "default"; // ✅ 드래그 끝나면 기본 커서로 복구
  };

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

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [activeSection, setActiveSection] = useState("general");
  
  // url에 따라 맞는버튼 색칠
  const [selectedDiv, setSelectedDiv] = useState(null);

  useEffect(() => {
    const path = location.pathname;
    const pathParts = path.split("/");
    const lastId = pathParts[pathParts.length - 1]; // 마지막 부분이 ID
    setSelectedDiv(lastId);
  }, [location.pathname]);

  useEffect(() => {
    const waveGraph = document.querySelector(".wave_graph");
    if (waveGraph) {
      if (tmiLastSelected === "dashboard" && asidePopupVisible) {
        waveGraph.style.marginLeft = "0"; // Dashboard일 때 aside-popup 열려있으면 margin-left를 0으로
      } else {
        waveGraph.style.marginLeft = "1rem"; // 기본값
      }
    }
  }, [tmiLastSelected, asidePopupVisible]); // selected와 asidePopupVisible이 변경될 때 실행
  // 상태가 변경될 때마다 localStorage에 저장
  
  const handleDetailClickStorage = (diskName) => {
    Logger.debug(`MainOuter > handleDetailClickStorage ... diskName: ${diskName}`)
    if (selectedDisk !== diskName) {
      setSelectedDisk(diskName);
      setSelectedDiv(null);
      navigate(`/storages/disks/${diskName}`);
    }
  };

  const handleMainClick = () => {
    Logger.debug(`MainOuter > handleMainClick ... `)
    setContextMenuVisible(false);
    setContextMenuTarget(null);
  };

  const asideClasses = `aside-outer ${asideVisible ? "open" : "closed"} ${window.innerWidth <= 1420 ? "responsive-closed" : ""}`;
  Logger.debug(`MainOuter ... `)
  return (
    <div
      className={`main-outer f-start${footerVisible ? " open" : ""}`}  
      onClick={handleMainClick}
    >
      <div className={asideClasses} style={asideStyles}>
        <SideNavbar />

        {/* 크기 조절 핸들 */}
        <SidebarTree />
          <div ref={resizerRef}
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

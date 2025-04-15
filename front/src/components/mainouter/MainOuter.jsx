import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUIState from "../../hooks/useUIState";
import useTmi from "../../hooks/useTmi";
import SideNavbar from "./SideNavbar";
import SidebarTree from "./SidebarTree";
import RightClickMenu from "../common/RightClickMenu";
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
  const navigate = useNavigate();
  const location = useLocation();
  const { tmiLastSelected, setTmiLastSelected, } = useTmi();
  const { 
    asideVisible, setAsideVisible,
    asideOffsetX, setAsideOffsetX,
  } = useUIState()

  /* aside-popup 화면사이즈드레그 */
  const [sidebarWidth, setSidebarWidth] = useState(240); // 초기 사이드바 너비 (%)
  const asideStyles = {
    width: asideVisible() ? `${sidebarWidth}px` : "0px", // 닫힐 때 0px
    minWidth: asideVisible() ? "245px" : "0px", // 최소 크기 설정
  };
  const resizerRef = useRef(null);
  const isResizing = useRef(false);
  const xRef = useRef(0);
  const leftWidthRef = useRef(0);

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

  const asideClasses = `aside-outer ${asideVisible() ? "open" : "closed"} ${window.innerWidth <= 1420 ? "responsive-closed" : ""}`;
  Logger.debug(`MainOuter ... `)
  return (
    <>
      <div
        className={`main-outer f-start`}  
      >
        <div
          className={asideClasses} 
          style={asideStyles}
        >
          <SideNavbar />

          {/* 크기 조절 핸들 */}
          <SidebarTree />
            <div ref={resizerRef}
              className="resizer"
            />
        </div>

        {React.cloneElement(children, {
          activeSection, setActiveSection,
          selectedDisk, // 선택된 디스크 이름을 자식 컴포넌트로 전달
          onDiskClick: handleDetailClickStorage, // 디스크 클릭 핸들러 전달
        })}

      </div>
      <RightClickMenu />
    </>
  );
};

export default MainOuter;

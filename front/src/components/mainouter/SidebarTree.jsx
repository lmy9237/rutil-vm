import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ComputingTree from "./tree/ComputingTree";
import NetworkTree from "./tree/NetworkTree";
import StorageTree from "./tree/StorageTree";

const SidebarTree = ({ selected }) => {
  const location = useLocation();

  // 📌 마지막 선택한 섹션 유지
  const [lastSelected, setLastSelected] = useState(
    () => localStorage.getItem("lastSelected") || "computing"
  );

  useEffect(() => {
    const savedLastSelected = localStorage.getItem("lastSelected");
    if (savedLastSelected) {
      setLastSelected(savedLastSelected);
    }
  }, [selected]);

  // 📌 대시보드, 이벤트, 설정이면 lastSelected 값으로 변경
  const sectionToRender = ["dashboard", "event", "settings"].includes(selected) ? lastSelected : selected;

  // ✅ 상태 관리
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [isSecondVisible, setIsSecondVisible] = useState(
    JSON.parse(localStorage.getItem("isSecondVisible")) || false
  );

  const [openDataCenters, setOpenDataCenters] = useState(
    JSON.parse(localStorage.getItem("openDataCenters")) || {}
  );
  const [openClusters, setOpenClusters] = useState(
    JSON.parse(localStorage.getItem("openClusters")) || {}
  );
  const [openHosts, setOpenHosts] = useState(
    JSON.parse(localStorage.getItem("openHosts")) || {}
  );
  const [openDomains, setOpenDomains] = useState(
    JSON.parse(localStorage.getItem("openDomains")) || {}
  );
  const [openNetworks, setOpenNetworks] = useState(
    JSON.parse(localStorage.getItem("openNetworks")) || {}
  );


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
    // 열림/닫힘 상태 변경 함수


  useEffect(() => {
    localStorage.setItem("isSecondVisible", JSON.stringify(isSecondVisible));
    localStorage.setItem("openDataCenters", JSON.stringify(openDataCenters));
    localStorage.setItem("openClusters", JSON.stringify(openClusters));
    localStorage.setItem("openHosts", JSON.stringify(openHosts));
    localStorage.setItem("openDomains", JSON.stringify(openDomains));
    localStorage.setItem("openNetworks", JSON.stringify(openNetworks));
  }, [isSecondVisible, openDataCenters, openClusters, openHosts, openDomains, openNetworks]);



  const getBackgroundColor = (id) => {
    return location.pathname.includes(id) ? "rgb(218, 236, 245)" : "";
  };
  const getPaddingLeft = (hasChildren, basePadding = "1rem", extraPadding = "0.6rem") => {
    return hasChildren ? extraPadding : basePadding;
  };

// 우클릭박스
const menuRef = useRef(null); // ✅ context menu 영역 참조
const [contextMenu, setContextMenu] = useState(null);
const openContextMenu = (e, item, treeType) => {
  e.preventDefault();
  setContextMenu({
    mouseX: e.clientX,
    mouseY: e.clientY,
    item,
    treeType, // 예: "network", "storage", "computing"
  });
};
const closeContextMenu = () => setContextMenu(null);
useEffect(() => {
  const handleClickOutside = (e) => {
    // contextMenu가 열려 있고, 클릭한 곳이 menuRef 바깥이면 닫기
    if (contextMenu && menuRef.current && !menuRef.current.contains(e.target)) {
      setContextMenu(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [contextMenu]);
  
  return (
    <div className="aside-popup">
      {/* ✅ 가상머신 섹션 */}
      {sectionToRender === "computing" && 
        <ComputingTree 
          selectedDiv={selectedDiv} 
          setSelectedDiv={setSelectedDiv} 
          getBackgroundColor={getBackgroundColor}
          getPaddingLeft={getPaddingLeft}
        />
      }

      {/* ✅ 네트워크 섹션 */}
      {sectionToRender === "network" && (
        <NetworkTree 
          selectedDiv={selectedDiv} 
          setSelectedDiv={setSelectedDiv} 
          getBackgroundColor={getBackgroundColor}
          getPaddingLeft={getPaddingLeft}
          onContextMenu={openContextMenu} 
          contextMenu={contextMenu}        
          menuRef={menuRef} 
       />
      )}

      {/* ✅ 스토리지 섹션 */}
      {sectionToRender === "storage" && (
        <StorageTree 
          selectedDiv={selectedDiv} 
          setSelectedDiv={setSelectedDiv} 
          getBackgroundColor={getBackgroundColor}
          getPaddingLeft={getPaddingLeft}
        />
      )}

      
    </div>
  );
};

export default SidebarTree;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  RVI24,
  LogoIcon,
  TopMenuIcon,
  rvi24Hamburger,
  rvi24Refresh,
  rvi24Gear,
  rvi24Bell,
  rvi24PersonCircle,
  rvi16Warning,
  RVI16,
  rvi16Trash,
  rvi16Event,
  rvi16ArrowLeft,
  rvi16ArrowRight,
  rvi16CloseMenu,
  rvi24RightArrow,
  rvi24DownArrow,
} from "../icons/RutilVmIcons";
import Localization from "../../utils/Localization";
import useGlobal from "../../hooks/useGlobal";
import "./Header.css";

/**
 * @name Header
 * @description 헤더
 *
 * @prop {JSX.useState} setAuthenticated
 * @returns {JSX.Element} Header
 */
const Header = ({ toggleAside }) => {
  const { setAuth } = useAuth();
  const handleTitleClick = () => navigate("/");
  const navigate = useNavigate();  
  const [isLoginBoxVisible, setLoginBoxVisible] = useState(false);
  const [isBellActive, setBellActive] = useState(false);
  const { setValue, getValue } = useGlobal()
  // const [username, setUsername] = useState(localStorage["username"]);

  const toggleLoginBox = () => {
    setLoginBoxVisible(!isLoginBoxVisible);
    setBellActive(false);
  };

  const toggleBellActive = () => {
    setBellActive(!isBellActive);
    setLoginBoxVisible(false);
  };

  // 알림 또는 이벤트 저장
  const [activeSection, setActiveSection] = useState(""); // 기본값 '알림'
  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? "" : section);
  };
  const handleDelete = (id, type) => {
    if (type === "알림") {
      setNotifications(notifications.filter((item) => item.id !== id));
    } else {
      setEvents(events.filter((item) => item.id !== id));
    }
  };
  const [notifications, setNotifications] = useState(
    Array.from({ length: 20 }).map((_, index) => ({
      id: index + 1,
      type: "알림",
      message: `알림 메시지 ${index + 1}`,
      date: new Date().toLocaleString("ko-KR", { hour12: false }),
    }))
  );

  const [events, setEvents] = useState(
    Array.from({ length: 20 }).map((_, index) => ({
      id: index,
      message: `${Localization.kr.EVENT} 내용입니다. ${Localization.kr.EVENT} 내용입니다. ${Localization.kr.EVENT} 내용입니다. ${Localization.kr.EVENT} 내용입니다.`,
      date: new Date().toLocaleDateString(),
    }))
  );

  const stopPropagation = (e) => e.stopPropagation();

  useEffect(() => {}, [isLoginBoxVisible, isBellActive]);

  const doLogout = (e) => {
    e.preventDefault();
    setAuth({})
    setValue("isUserAuthenticated", false);
    setValue("username", false);
    localStorage.clear();
    navigate("/login");
  };

  //배경색바꾸기
  const [selectedIndex, setSelectedIndex] = useState(null);
  // .aside-outer 열림 상태 관리(반응형형)

  // 알림칸 넓이 늘어나게하기
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 박스를 제외한 배경누르면 닫히게하기
  const loginBoxRef = useRef(null);
  const bellBoxRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (loginBoxRef.current && loginBoxRef.current.contains(event.target)) ||
        (bellBoxRef.current && bellBoxRef.current.contains(event.target))
      ) {
        return; // 내부 클릭 시 닫히지 않음
      }
      setLoginBoxVisible(false);
      setBellActive(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header f-btw">
      <div className="header-left">
        <TopMenuIcon iconDef={rvi24Hamburger("white")} onClick={toggleAside} />
        <LogoIcon disableHover={true} onClick={handleTitleClick}/>
      </div>

      <div className="header-right">
        {/* 새로고침 */}
        <TopMenuIcon
          iconDef={rvi24Refresh("white")}
          onClick={() => window.location.reload()}
        />
        {/* 설정 */}
        <TopMenuIcon
          iconDef={rvi24Gear("white")}
          onClick={() => {
            setSelectedIndex(1);
            navigate("/settings/users"); // 기존 기능 유지
          }}
        />
        {/* 알림 */}
        <TopMenuIcon
          iconDef={rvi24Bell("white")}
          onClick={() => {
            setSelectedIndex(2);
            toggleBellActive(); // 기존 기능 유지
          }}
        />

        {isBellActive && (
          <div
            ref={bellBoxRef}
            className={`bell-box ${isExpanded ? "expanded" : ""}`}
            onClick={stopPropagation}
          >
            <div className="f-btw bell-cate">
              <RVI16 iconDef={isExpanded ? rvi16ArrowRight : rvi16ArrowLeft}
                className="hover-icon"
                onClick={handleExpand}
              />
              통지함
              <RVI16
                iconDef={rvi16CloseMenu}
                className="hover-icon"
                onClick={() => setBellActive(false)}
              />
            </div>
            {/* 알림 탭 */}
            <div className={`bell-cate ${activeSection === "알림" ? "active" : ""} f-start`}
              onClick={() => handleSectionClick("알림")}
            >
              <RVI24 iconDef={activeSection === "알림" ? rvi24DownArrow : rvi24RightArrow}/>
              <span className="ml-1">알림</span>
            </div>

            {/* 알림 내용 */}
            {activeSection === "알림" && (
              <>
                <div className="bell-content-outer">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="bell-content">
                      <RVI16 iconDef={rvi16Warning} />
                      <div className="bell-mid">
                        {notification.message}
                        <div className="mt-0.5">{notification.date}</div>
                      </div>
                      <RVI16 iconDef={rvi16Trash}
                        className="trash-icon"
                        onClick={() => handleDelete(notification.id, "알림")}
                      />
                    </div>
                  ))}
                </div>

                <div className="bell-btns">
                  <div className="mr-3">모두 삭제</div>
                  <div>모두 출력</div>
                </div>
              </>
            )}

            {/* 이벤트 탭 */}
            <div
              className={`bell-cate ${activeSection === "이벤트" ? "active" : ""} f-start`}
              onClick={() => handleSectionClick("이벤트")}
            >
              <RVI24
                iconDef={
                  activeSection === "이벤트" ? rvi24DownArrow : rvi24RightArrow
                }
              />
              <span className="ml-1">이벤트</span>
            </div>

            {/* 이벤트 내용 (알림 아래로 깔리도록 설정) */}
            {activeSection === "이벤트" && (
              <>
                <div className="bell-content-outer event-section">
                  {events.map((event) => (
                    <div key={event.id} className="bell-content">
                      <div>
                        <RVI16 iconDef={rvi16Event} />
                      </div>
                      <div className="bell-mid">
                        {event.message}
                        <div className="mt-0.5">{event.date}</div>
                      </div>
                      <div>
                        <RVI16
                          iconDef={rvi16Trash}
                          className="trash-icon"
                          onClick={() => handleDelete(event.id, "이벤트")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bell-btns">
                  <div className="mr-3">모두 삭제</div>
                  <div>모두 출력</div>
                </div>
              </>
            )}
          </div>
        )}
        {/* 사용자 버튼 */}
        <TopMenuIcon
          iconDef={rvi24PersonCircle("white")}
          onClick={() => {
            setSelectedIndex(3);
            toggleLoginBox(); // 기존 기능 유지
          }}
        />
        {isLoginBoxVisible && (
          <div
            ref={loginBoxRef}
            className="user-loginbox"
            onClick={stopPropagation}
          >
            <div>계정설정</div>
            <div onClick={(e) => doLogout(e)}>로그아웃</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

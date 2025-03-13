import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faBars,
  faBell,
  faChevronDown,
  faChevronRight,
  faCog,
  faExclamationTriangle,
  faInfoCircle,
  faRotate,
  faTimes,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import {
  HamburgerIcon,
  LogoIcon,
  NotificationIcon,
  RefreshIcon,
  SettingsIcon,
  TopMenuIcon,
  UserIcon,
} from "../icons/RutilVmIcons";

/**
 * @name Header
 * @description 헤더
 *
 * @prop {JSX.useState} setAuthenticated
 * @returns {JSX.Element} Header
 */
const Header = ({ setAuthenticated, toggleAside }) => {
  const handleTitleClick = () => navigate("/");
  const navigate = useNavigate();
  const [isLoginBoxVisible, setLoginBoxVisible] = useState(false);
  const [isBellActive, setBellActive] = useState(false);
  // const [username, setUsername] = useState(localStorage["username"]);

  const toggleLoginBox = () => {
    setLoginBoxVisible(!isLoginBoxVisible);
    setBellActive(false);
  };

  const toggleBellActive = () => {
    setBellActive(!isBellActive);
    setLoginBoxVisible(false);
  };

  // '알림' 또는 '이벤트' 저장
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
      message: `이벤트 메시지 ${index + 1}`,
      date: new Date().toLocaleDateString(),
    }))
  );

  const stopPropagation = (e) => e.stopPropagation();

  useEffect(() => {}, [isLoginBoxVisible, isBellActive]);

  const handleLogout = (e) => {
    e.preventDefault();
    setAuthenticated(false);
    localStorage.clear();
    navigate("/");
  };

  //배경색바꾸기
  const [selectedIndex, setSelectedIndex] = useState(null);
  // .aside-outer 열림 상태 관리(반응형형)

  // 알림칸 넓이 늘어나게하기
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="header center">
      <div className="header-right">
        <TopMenuIcon onClick={toggleAside}>
          <HamburgerIcon className="rvi rvi-menu" />
        </TopMenuIcon>

        <TopMenuIcon onClick={handleTitleClick}>
          <LogoIcon />
        </TopMenuIcon>
      </div>

      <div className="header-right">
        <TopMenuIcon onClick={() => window.location.reload()}>
          {/* 새로고침 */}
          <RefreshIcon className="rvi rvi-menu" />
        </TopMenuIcon>
        <TopMenuIcon
          onClick={() => {
            setSelectedIndex(1);
            navigate("/settings/users"); // 기존 기능 유지
          }}
        >
          {/* 설정 */}
          <SettingsIcon className="rvi rvi-menu" />
        </TopMenuIcon>
        <TopMenuIcon
          onClick={() => {
            setSelectedIndex(2);
            toggleBellActive(); // 기존 기능 유지
          }}
        >
          {/* 알림 */}
          <NotificationIcon className="rvi rvi-menu" />
        </TopMenuIcon>

        {isBellActive && (
          <div
            className={`bell-box ${isExpanded ? "expanded" : ""}`}
            onClick={stopPropagation}
          >
            <div className="f-btw py-0.5 px-1.5">
              <FontAwesomeIcon
                icon={isExpanded ? faAngleRight : faAngleLeft} // 방향 변경
                fixedWidth
                className="hover-icon"
                onClick={handleExpand}
              />
              통지함
              <FontAwesomeIcon
                icon={faTimes}
                fixedWidth
                className="hover-icon"
                onClick={() => setBellActive(false)}
              />
            </div>

            {/* 알림 탭 */}
            <div
              className={`bell-cate ${activeSection === "알림" ? "active" : ""}`}
              onClick={() => handleSectionClick("알림")}
            >
              <FontAwesomeIcon
                icon={activeSection === "알림" ? faChevronDown : faChevronRight}
                fixedWidth
              />
              <span className="ml-1">알림</span>
            </div>

            {/* 알림 내용 */}
            {activeSection === "알림" && (
              <>
                <div className="bell-content-outer">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="bell-content">
                      <div>
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          fixedWidth
                          style={{
                            color: "red",
                            fontSize: "14px",
                            paddingTop: "4px",
                          }}
                        />
                      </div>
                      <div className="bell-mid">
                        {notification.message}
                        <div className="mt-0.5">{notification.date}</div>
                      </div>
                      <div>
                        <FontAwesomeIcon
                          icon={faTrash}
                          fixedWidth
                          className="hover-icon"
                          style={{
                            fontSize: "15px",
                            paddingTop: "7px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleDelete(notification.id, "알림")}
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

            {/* 이벤트 탭 */}
            <div
              className={`bell-cate ${activeSection === "이벤트" ? "active" : ""}`}
              onClick={() => handleSectionClick("이벤트")}
            >
              <FontAwesomeIcon
                icon={
                  activeSection === "이벤트" ? faChevronDown : faChevronRight
                }
                fixedWidth
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
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          fixedWidth
                          style={{ fontSize: "17px", paddingTop: "4px" }}
                        />
                      </div>
                      <div className="bell-mid">
                        {event.message}
                        <div className="mt-0.5">{event.date}</div>
                      </div>
                      <div>
                        <FontAwesomeIcon
                          icon={faTrash}
                          fixedWidth
                          className="hover-icon"
                          style={{
                            fontSize: "15px",
                            paddingTop: "7px",
                            cursor: "pointer",
                          }}
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
        <TopMenuIcon
          onClick={() => {
            setSelectedIndex(3);
            toggleLoginBox(); // 기존 기능 유지
          }}
        >
          {/* 사용자 버튼 */}
          <UserIcon className="rvi rvi-menu" />
        </TopMenuIcon>
        {isLoginBoxVisible && (
          <div className="user-loginbox" onClick={stopPropagation}>
            <div>계정설정</div>
            <div onClick={(e) => handleLogout(e)}>로그아웃</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

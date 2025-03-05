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
import rutil_logo from "../../assets/images/rutil_logo.png";

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
  const [username, setUsername] = useState(localStorage["username"]);


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
  const [notifications, setNotifications] = useState([
    { id: 1, type: "알림", message: "첫 번째 알림 메시지", date: "25. 2. 24. | PM 8:54:04" },
    { id: 2, type: "알림", message: "두 번째 알림 메시지", date: "25. 2. 24. | PM 8:51:22" },
  ]);
  
  const [events, setEvents] = useState([
    { id: 1, type: "이벤트", message: "첫 번째 이벤트 메시지", date: "25. 2. 28. | PM 3:44:21" },
    { id: 2, type: "이벤트", message: "두 번째 이벤트 메시지", date: "25. 2. 28. | PM 3:46:14" },
  ]);
  


  const stopPropagation = (e) => e.stopPropagation();

  useEffect(() => {
    
  }, [isLoginBoxVisible, isBellActive]);

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
      <div className="header-left">
        <FontAwesomeIcon icon={faBars} className="menu-icon" fixedWidth
          onClick={toggleAside} // aside-outer 토글
        />
        <div className="logo-outer"
          onClick={handleTitleClick}
        >
          <img className="rutil-logo" src={rutil_logo} alt="logo Image" />
        </div>
      </div>

      <div className="header-right">
        {/* 새로고침 */}
        <FontAwesomeIcon className="menu-icon" fixedWidth 
          icon={faRotate}
          onClick={() => window.location.reload()}
        />
        {/* 설정 */}
        <FontAwesomeIcon className="menu-icon" fixedWidth 
          icon={faCog}
          onClick={() => {
            setSelectedIndex(1);
            navigate('/settings/users'); // 기존 기능 유지
          }} 
        />
        {/* 알림 */}
        <FontAwesomeIcon className="menu-icon" fixedWidth 
          icon={faBell}
          onClick={() => {
            setSelectedIndex(2);toggleBellActive(); // 기존 기능 유지
          }}/>

        {isBellActive && (
          <div className={`bell-box ${isExpanded ? "expanded" : ""}`} onClick={stopPropagation}>
            <div className="f-btw py-0.5 px-1.5">
              <FontAwesomeIcon
                icon={isExpanded ? faAngleRight : faAngleLeft} // 방향 변경
                fixedWidth
                className="hover-icon"
                onClick={handleExpand}
              />
              통지함
              <FontAwesomeIcon icon={faTimes} fixedWidth
                className="hover-icon"
                onClick={() => setBellActive(false)}
              />
            </div>

              {/* 알림 탭 */}
              <div className={`bell-cate ${activeSection === "알림" ? "active" : ""}`} onClick={() => handleSectionClick("알림")}>
                <FontAwesomeIcon icon={activeSection === "알림" ? faChevronDown : faChevronRight} fixedWidth />
                <span className="ml-1">알림</span>
              </div>

              {/* 알림 내용 */}
              {activeSection === "알림" && (
                <div className="bell-content-outer">
                  <div className="bell-content">

                    <div>
                      <FontAwesomeIcon 
                        icon={faExclamationTriangle} fixedWidt
                        style={{ color: "orange", fontSize: "20px"  , paddingTop:'7px'}}
                      />
                    </div>
                    <div className="bell-mid">
                      afdssssssssssssssssssssssssssssssssssssssssdsafsdfdsfasafdsfasdfsa
                      <div className="mt-0.5">
                        날짜 | 시간
                      </div>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faTrash} fixedWidth 
                        className="hover-icon"
                        style={{fontSize: "15px" , paddingTop:'7px'}}
                      />
                    </div>
                  </div>
                
                
                </div>
              )}

              {/* 이벤트 탭 */}
              <div className={`bell-cate ${activeSection === "이벤트" ? "active" : ""}`} onClick={() => handleSectionClick("이벤트")}>
                <FontAwesomeIcon icon={activeSection === "이벤트" ? faChevronDown : faChevronRight} fixedWidth />
                <span className="ml-1">이벤트</span>
              </div>

              {/* 이벤트 내용 (알림 아래로 깔리도록 설정) */}
              {activeSection === "이벤트" && (
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
                          style={{ fontSize: "15px", paddingTop: "7px", cursor: "pointer" }}
                          onClick={() => handleDelete(event.id, "이벤트")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}


                </div>
        )}



        {/* 사용자 버튼 */}
        <div  className="menu-icon" >
          <FontAwesomeIcon icon={faUser}fixedWidth
            onClick={() => {
              setSelectedIndex(3);toggleLoginBox();
            }}
          />
          {/* <span
            onClick={() => {
              setSelectedIndex(3);toggleLoginBox(); 
            }}
          >{username}</span> */}
        </div>
        {isLoginBoxVisible && (
          <div className="user-loginbox" 
            onClick={stopPropagation}
          >
            <div>계정설정</div>
            <div onClick={(e) => handleLogout(e)}>로그아웃</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

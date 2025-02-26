import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCog,
  faRotate,
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
          <div className="bell-box"
            onClick={stopPropagation}
          >
            <div>알림</div>
          </div>
        )}
        {/* 사용자 버튼 */}
        <FontAwesomeIcon icon={faUser} className="menu-icon" fixedWidth
          onClick={() => {
            setSelectedIndex(3);toggleLoginBox();
          }}
        />
        <span
          onClick={() => {
            setSelectedIndex(3);toggleLoginBox(); // 기존 기능 유지
          }}
        >{username}</span>
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

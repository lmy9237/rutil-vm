import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBell, faCog, faRotate, faUser
} from '@fortawesome/free-solid-svg-icons'
import { adjustFontSize } from '../../UIEvent';
import './Header.css';
import rutil_logo from '../../assets/images/rutil_logo.png'

const Header = ({ setAuthenticated,toggleAside  }) => {
    const navigate = useNavigate();
    const [isLoginBoxVisible, setLoginBoxVisible] = useState(false);
    const [isBellActive, setBellActive] = useState(false);
    const [username, setUsername] = useState(localStorage['username'])

    useEffect(() => {
      window.addEventListener('resize', adjustFontSize);
      adjustFontSize();
      return () => { window.removeEventListener('resize', adjustFontSize); };
    }, []);

    const handleTitleClick = () => navigate('/'); 

    const toggleLoginBox = () => {
        setLoginBoxVisible(!isLoginBoxVisible);
        setBellActive(false); // 다른 버튼을 누르면 Bell 비활성화
    };

    const toggleBellActive = () => {
        setBellActive(!isBellActive);
        setLoginBoxVisible(false); // 다른 버튼을 누르면 LoginBox 비활성화
    };

    const handleOutsideClick = (event) => {
        if (
            !event.target.closest('.user-btn') && 
            !event.target.closest('.user-loginbox') && 
            !event.target.closest('.fa-bell-wrapper') && 
            !event.target.closest('.bell_box')
        ) {
            setLoginBoxVisible(false);
            setBellActive(false);
        }
    };

    const stopPropagation = (e) => e.stopPropagation();

    useEffect(() => {
        if (isLoginBoxVisible || isBellActive) {
            document.addEventListener('click', handleOutsideClick);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isLoginBoxVisible, isBellActive]);

    const handleLogout = (e) => {
      e.preventDefault();
      setAuthenticated(false);
      localStorage.clear();
      navigate('/')
    }

    // .aside-outer 열림 상태 관리(반응형형)
 

    return (
        <div className="header">
            <div className="header-right">
            <FontAwesomeIcon
                icon={faBars}
                fixedWidth
                className="menu-icon"
                onClick={toggleAside} // aside-outer 토글
            />
                {/* <button id='aside_popup_btn'>
                                <FontAwesomeIcon icon={faBars} fixedWidth />
                            </button> */}
                <div className='logo-outer'  onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                    <img className='rutil-logo' src={rutil_logo} alt="logo Image" />
                </div>
            </div>

            <div className="header-left">
                {/* 새로고침 */}
                <div onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faRotate} fixedWidth />
                </div> 
                {/* 설정 */}
                <div 
                    onClick={() => navigate('/settings/users')} 
                    style={{ cursor: 'pointer' }}
                    >
                    <FontAwesomeIcon icon={faCog} fixedWidth />
                </div>
                {/* 알림 */}
                <div 
                  className="fa-bell-wrapper" 
                  onClick={toggleBellActive}
                >
                    <FontAwesomeIcon icon={faBell} fixedWidth/>
                    <div className='bell-box' style={{ display: isBellActive ? 'block' : 'none' }} onClick={stopPropagation}>
                        <div>알림</div>
                    </div>
                </div>

                {/*user */}
                <div className='user-btn' 
                  onClick={toggleLoginBox}
          
                >
                  <FontAwesomeIcon icon={faUser} fixedWidth/>&nbsp;<span>{username}</span>
                  <div className='user-loginbox' 
                      style={{ display: isLoginBoxVisible ? 'block' : 'none' }} 
                      onClick={stopPropagation}
                    >
                      <div>계정설정</div>
                      <div onClick={(e) => handleLogout(e)}>로그아웃</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;

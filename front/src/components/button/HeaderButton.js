import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import IconButton from '../Input/IconButton';
import './css/HeaderButton.css';

const HeaderButton = ({ title, status, buttons = [], popupItems = [], titleIcon }) => {
  const [isPopupBoxVisible, setIsPopupBoxVisible] = useState(false);

  const togglePopupBox = () => setIsPopupBoxVisible(!isPopupBoxVisible);

  const handlePopupBoxItemClick = (item) => {
    if (item.disabled) return; // disabled 상태면 클릭 이벤트 무시
    if (item.onClick) {
      item.onClick();
    }
    console.log(`Clicked on ${item.label}`);
    setIsPopupBoxVisible(false);
  };

  // 팝업 외부 클릭 시 닫히도록 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      const popupBox = document.querySelector('.popup-box');
      const popupBtn = document.querySelector('.popup-btn');
      if (
        popupBox &&
        !popupBox.contains(event.target) &&
        popupBtn &&
        !popupBtn.contains(event.target)
      ) {
        setIsPopupBoxVisible(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  

  return (
    <div className="section-header">
      <div className="section-header-left">
        <div className="section-header-title">
          {titleIcon && (
            <FontAwesomeIcon 
              icon={titleIcon} 
              className="title_icon" 
              style={{ marginRight: '0.34rem' }} 
            />
          )}
          <div>{title}</div>
        </div>
      </div>
      <div className="section-header-right">
        <div className="article-nav">
          <div className="subStatus">
            <p>{status}</p>
          </div>
          {buttons.map((button, index) => (
            <IconButton
              id={button.id}
              key={index}
              label={button.label}
              icon={button.icon}
              onClick={button.onClick}
              disabled={button.disabled}
            />
          ))}
          {popupItems && popupItems.length > 0 && (
            <button className="popup-btn" onClick={togglePopupBox}>
              <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
              <div
                className="popup-box"
                style={{ display: isPopupBoxVisible ? 'block' : 'none' }}
              >
                {popupItems.map((item, index) => (
                  <div
                    key={index}
                    className={`popup_item ${item.disabled ? "disabled" : ""}`}
                    onClick={(e) => {
                      if (!item.disabled) {
                        e.stopPropagation();
                        handlePopupBoxItemClick(item);
                      }
                    }}
                    disabled={item.disabled} // 실제 disabled 속성 반영
                  >
                  {item.label}
                </div>
                ))}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderButton;

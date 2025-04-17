import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { RVI24 } from "../icons/RutilVmIcons";
import IconButton from "../Input/IconButton";
import StatusBadge from "../common/StatusBadge";
import PopupBox from "../common/PopupBox";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";
import "./HeaderButton.css";
import useClickOutside from "../../hooks/useClickOutside";

/**
 * @name HeaderButton
 * @description 헤더 버튼
 * 
 * @param {string} title 제목
 * @param {string} status 상태태
 * @returns 
 */
const HeaderButton = ({
  title,
  status,
  buttons = [],
  popupItems = [],
  titleIcon,
  inverseColor = false,
}) => {
  const [isPopupBoxVisible, setIsPopupBoxVisible] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);

  const togglePopupBox = () => setIsPopupBoxVisible(!isPopupBoxVisible);
  const handlePopupBoxItemClick = (item) => {
    if (item.disabled) return;
    if (item.onClick) item.onClick();
    setIsPopupBoxVisible(false);
  };

  // 외부 클릭 시 팝업 닫기
  useClickOutside();
  useEffect(() => {
    const handleClickOutside = (event) => {
      const popupBox = document.querySelector(".popup-box");
      const popupBtn = document.querySelector(".popup-btn");
      if (
        popupBox && !popupBox.contains(event.target) &&
        popupBtn && !popupBtn.contains(event.target)
      ) {
        setIsPopupBoxVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 버튼이 넘치면 compact 모드로
  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(".section-header-right");
      const nav = document.querySelector(".article-nav");
      if (container && nav) {
        const isOverflowing = nav.scrollWidth > container.clientWidth;
        setIsCompactMode(isOverflowing || window.innerWidth < 1200);
      }
    };
    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // compact일 때는 모든 버튼을 popupItems로 이동
  const allPopupItems = isCompactMode ? [...buttons, ...popupItems] : popupItems;

  Logger.debug("HeaderButton ...");
  return (
    <div className="section-header f-btw">
      <div className="section-header-left f-btw">
        {titleIcon && <RVI24 iconDef={titleIcon} />}
        <p className={`section-header-title${inverseColor ? " inverse" : ""}`}>{title}</p>
        {status && (
          <StatusBadge
            status={
              status === Localization.kr.UP ? "running" :
              status === "중지" ? "stopped" : "default"
            }
            text={status}
          />
        )}
      </div>

      <div className="section-header-right f-btw">
        <div className="article-nav f-end">
          {!isCompactMode &&
            buttons.map((button, index) => (
              <IconButton
                id={button.id}
                key={index}
                label={button.label}
                icon={button.icon}
                onClick={button.onClick}
                disabled={button.disabled}
              />
            ))}

          {allPopupItems.length > 0 && (
            <div className="popup-container">
              <button className="popup-btn" onClick={togglePopupBox}>
                <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
              </button>
              <PopupBox
                isVisible={isPopupBoxVisible}
                items={allPopupItems}
                onClose={() => setIsPopupBoxVisible(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderButton;

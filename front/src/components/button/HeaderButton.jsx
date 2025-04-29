import React, { useState, useEffect, useMemo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import useClickOutside from "../../hooks/useClickOutside";
import { RVI24 } from "../icons/RutilVmIcons";
import IconButton from "../Input/IconButton";
import StatusBadge from "../common/StatusBadge";
import PopupBox from "../common/PopupBox";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";
import "./HeaderButton.css";

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
  const popupBoxRef = useRef(null)
  const [isPopupBoxVisible, setIsPopupBoxVisible] = useState(false);
  const togglePopupBox = () => setIsPopupBoxVisible(!isPopupBoxVisible);

  const [isCompactMode, setIsCompactMode] = useState(false);
  /*const handlePopupBoxItemClick = (item) => {
    if (item.disabled) return;
    if (item.onClick) item.onClick();
    setIsPopupBoxVisible(false);
  };*/

  useClickOutside(popupBoxRef, (e) => {
    setIsPopupBoxVisible(false);
  })

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
        <h1 className={`section-header-title fs-24 fw-700 ${inverseColor ? " inverse" : ""}`}>{title}</h1>
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
            buttons.map((button, i) => (
              <IconButton key={i} id={button.id}
                label={button.label}
                icon={button.icon}
                onClick={button.onClick}
                disabled={button.disabled}
              />
            ))}

          {allPopupItems.length > 0 && (<div
            className="popup-container"
            ref={popupBoxRef}
          >
            <button className="popup-btn" onClick={togglePopupBox}>
              <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
            </button>
            <PopupBox
              isVisible={isPopupBoxVisible}
              items={[...allPopupItems]}
              onClose={() => setIsPopupBoxVisible(false)}
            />
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default HeaderButton;

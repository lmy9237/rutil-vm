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
  inverseColor=false,
}) => {
  const [isPopupBoxVisible, setIsPopupBoxVisible] = useState(false);
  const togglePopupBox = () => setIsPopupBoxVisible(!isPopupBoxVisible);
  const handlePopupBoxItemClick = (item) => {
    Logger.debug(`HeaderButton > handlePopupBoxItemClick ... item: ${item}`)
    if (item.disabled) 
      return; // disabled 상태면 클릭 이벤트 무시
    if (item.onClick)
      item.onClick();
    Logger.debug(`Clicked on ${item.label}`);
    setIsPopupBoxVisible(false);
  };
  useClickOutside()
  // 팝업 외부 클릭 시 닫히도록 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      Logger.debug("HeaderButton > handleClickOutside ...")
      const popupBox = document.querySelector(".popup-box");
      const popupBtn = document.querySelector(".popup-btn");
      if (
        popupBox && !popupBox.contains(event.target) 
        && popupBtn && !popupBtn.contains(event.target)
      ) {
        setIsPopupBoxVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  Logger.debug("HeaderButton ...")
  return (
    <div className="section-header f-btw">
      <div className="section-header-left f-btw">
        {titleIcon && (<RVI24 iconDef={titleIcon} />)}
        <p className={`section-header-title${inverseColor ? " inverse" : ""}`}>{title}</p>
        {status && <StatusBadge 
          status={status === Localization.kr.UP ? "running" : status === "중지" ? "stopped" : "default"}
          text={status}
        />}
      </div>
      <div className="section-header-right f-btw">
        <div className="article-nav f-end">
          {buttons.map((button, index) => (
            <IconButton id={button.id}
              key={index}
              label={button.label}
              icon={button.icon}
              onClick={button.onClick}
              disabled={button.disabled}
            />
          ))}
          {popupItems.length > 0 && (
            <div className="popup-container">
              <button className="popup-btn" onClick={togglePopupBox}>
                <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
              </button>
              <PopupBox
                isVisible={isPopupBoxVisible}
                items={popupItems}
                onClose={() => setIsPopupBoxVisible(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

HeaderButton.CREATE = ({

}) => {

}

HeaderButton.UPDATE = ({
  
}) => {

}

export default HeaderButton;

import React, { useState, useEffect, useMemo, useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import {
  RVI16, RVI24,
  rvi16DotsVertical,
} from "@/components/icons/RutilVmIcons";
import IconButton      from "@/components/Input/IconButton";
import { BadgeStatus } from "@/components/common/Badges";
import PopupBox        from "@/components/common/PopupBox";
import Localization    from "@/utils/Localization";
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
  const allPopupItems = isCompactMode 
    ? [...buttons, ...popupItems] 
    : popupItems;

  return (
    <div className="section-header f-btw">
      <div className="section-header-left f-btw">
        {titleIcon && <RVI24 iconDef={titleIcon} />}
        <h1 className={`section-header-title fs-24 fw-700 ${inverseColor ? " inverse" : ""}`}>{title}</h1>
        {status && (
          <BadgeStatus
            status={
              [Localization.kr.UP, Localization.kr.ACTIVATE].includes(status) 
                ? "running" 
                : status === Localization.kr.DOWN 
                  ? "stopped"
                  : "default"
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
            <IconButton className="popup-btn" 
              iconDef={rvi16DotsVertical()}
              onClick={togglePopupBox}
            />
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

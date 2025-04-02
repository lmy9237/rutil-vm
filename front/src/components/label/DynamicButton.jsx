import React, { useState } from "react";
import {
  RVI36,
  rvi36Add,
  rvi36AddHover,
  rvi36AddDisabled,
  rvi36Remove,
  rvi36RemoveHover,
  rvi36RemoveDisabled,
} from "../icons/RutilVmIcons";

/**
 * @name DynamicButton
 * @description NIC 추가/제거 아이콘 버튼 (hover/disabled 대응)
 *
 * @param {"add" | "remove"} type - 아이콘 종류
 * @param {boolean} disabled - 버튼 비활성화 여부
 * @param {function} onClick - 클릭 핸들러
 */
const DynamicButton = ({ type = "add", disabled = false, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => setIsHovering(true);
  const handleMouseOut = () => setIsHovering(false);

  const getIcon = () => {
    if (type === "add") {
      if (disabled) return rvi36AddDisabled;
      return isHovering ? rvi36AddHover : rvi36Add(false);
    } else if (type === "remove") {
      if (disabled) return rvi36RemoveDisabled;
      return isHovering ? rvi36RemoveHover : rvi36Remove(false);
    }
    return null;
  };

  return (
    <button
      type="button"
      className="btn-icon"
      onClick={onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      disabled={disabled}
    >
      <RVI36 iconDef={getIcon()} />
    </button>
  );
};

export default DynamicButton;

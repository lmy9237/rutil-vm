import React, { useState } from "react";
import { RVI24, rvi24ChevronLeftRect, rvi24ChevronLeftRectDisabled, rvi24ChevronRightRect, rvi24ChevronRightRectDisabled } from "../icons/RutilVmIcons";
import "./Table.css";

/**
 * @name PagingButton
 * @description 테이블 페이징 네비게이션 화살표 버튼
 * @param {"prev" | "next"} type - 이전/다음 버튼 타입
 * @param {boolean} disabled - 버튼 비활성화 여부
 * @param {function} onClick - 버튼 클릭 핸들러
 */
const PagingButton = ({ type = "prev", ...props }) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => setIsHovering(true);
  const handleMouseOut = () => setIsHovering(false);

  const getIcon = () => {
    if (type === "prev") {
      return props.disabled
        ? rvi24ChevronLeftRectDisabled
        : rvi24ChevronLeftRect(isHovering);
    } else {
      return props.disabled
        ? rvi24ChevronRightRectDisabled
        : rvi24ChevronRightRect(isHovering);
    }
  };

  return (
    <button
      className={`paging-arrow${isHovering ? " on" : ""}`}
      {...props}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <RVI24 iconDef={getIcon()} />
    </button>
  );
};

export default PagingButton;

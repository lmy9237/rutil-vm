import React from "react";
import "./GeneralLayout.css";

/**
 * @name GeneralLayout
 * @description General 화면 공통 레이아웃: top 영역과 bottom 영역을 자유롭게 배치할 수 있는 유연한 구조
 *
 * @param {JSX.Element} top - 상단 콘텐츠 (예: InfoTable 박스들)
 * @param {JSX.Element} [bottom] - 하단 콘텐츠 (예: 차트 등)
 */
const GeneralLayout = ({ top, bottom }) => {
  return (
    <div className="vm-detail-grid">
      {/* 상단 영역 */}
      <div className="vm-section section-top">
        {top}
      </div>

      {/* 하단 영역 */}
      {bottom && (
        <div className="vm-section section-bottom">
          {bottom}
        </div>
      )}
    </div>
  );
};

export default GeneralLayout;

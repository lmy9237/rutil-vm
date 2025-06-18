import React from "react";
import GeneralBoxProps from "@/components/common/GeneralBoxProps";
import { InfoTable } from "@/components/table/InfoTable";
import "./GeneralLayout.css";

/**
 * @name GeneralLayout
 * @description VmGeneral 또는 HostGeneral 화면에서 공통으로 사용하는 일반 정보 + 테이블 + 바차트 레이아웃
 * @param {JSX.Element} [leftBox] - 상단 왼쪽 대표 아이콘 (옵션)
 * @param {Array} topTable - 상단 InfoTable rows
 * @param {JSX.Element} topRightContent - 상단 우측 콘텐츠 (예: 바차트)
 * @param {Array} bottomTables - 하단 InfoTable rows 또는 커스텀 콘텐츠 배열 [{ title, rows?, content? }]
 *
 * @returns {JSX.Element} 공통 레이아웃
 */
const GeneralLayout = ({
  leftBox,
  topTable,
  topRightContent,
  bottomTables = [],
}) => {
  return (
    <div className="vm-detail-grid">
      {/* 상단 영역 */}
      <div className="vm-section section-top">
        <div className="vm-info-box-outer grid-col-span-2 vm-box-default">
          <h3 className="box-title">게스트 운영체제</h3>
          <hr className="w-full" />
          <div className={`flex ${leftBox ? "flex-wrap gap-4" : ""}`}>
            {leftBox && <div className="half-box">{leftBox}</div>}
            <div className="half-box vm-info-content">
              <InfoTable tableRows={topTable} />
            </div>
          </div>
        </div>

        <GeneralBoxProps title="용량 및 사용량">
          {topRightContent}
        </GeneralBoxProps>
      </div>

      {/* 하단 영역 */}
      {bottomTables.length > 0 && (
        <div className="vm-section section-bottom">
          {bottomTables.map(({ title, rows, content }, idx) => (
            <GeneralBoxProps key={idx} title={title}>
              {content ?? <InfoTable tableRows={rows} />}
            </GeneralBoxProps>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneralLayout;
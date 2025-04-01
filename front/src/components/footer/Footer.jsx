import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";
import { RVI24, rvi24ChevronUp, rvi24DownArrow } from "../icons/RutilVmIcons";
import Localization from "../../utils/Localization";

/**
 * @name Footer
 * @description Footer
 *
 * @returns {JSX.Element} Footer
 */
const Footer = ({
  isFooterContentVisible = false,
  setIsFooterContentVisible,
}) => {


  // 드레그
  const footerBarHeight = 40;
  const [footerHeight, setFooterHeight] = useState(300);
  const isResizing = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  
  const handleResizeStart = (e) => {
    isResizing.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = footerHeight;
  
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";
  };
  
  const handleResizeMove = (e) => {
    if (!isResizing.current) return;
  
    requestAnimationFrame(() => {
      const dy = startYRef.current - e.clientY; // 아래로 내리면 양수
      const newHeight = startHeightRef.current + dy;
  
      if (newHeight >= 184 && newHeight <= 600) {
        setFooterHeight(newHeight);
      }
    });
  };
  
  const handleResizeEnd = () => {
    isResizing.current = false;
  
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  
    document.body.style.userSelect = "auto";
    document.body.style.cursor = "default";
  };
  
  // 임시 데이터
  const tableData = Array.from({ length: 20 }).map((_, index) => ({
    id: index + 1,
    taskName: `작업 ${index + 1}`,
    target:
      index % 2 === 0 ? "CentOS 7.9 Shell Script 테스트 - MYK" : "Datacenter",
    status: `완료 ${Localization.kr.TIME}`,
    details: "",
    startTime: "2025.02.28",
    waitTime: `${index + 1}ms`,
    morningTime: "2025.02.28. 오전",
  }));

  return (
    <>
    {/* 드래그바 */}
    {isFooterContentVisible && (
      <div className="footer-resizer" onMouseDown={handleResizeStart} />
    )}
    <div
      className={`footer-outer${isFooterContentVisible ? " open" : ""}`}
      style={{
        height: isFooterContentVisible ? `${footerHeight + footerBarHeight}px` : "0px",
      }}
    >
      {/* 상단 "최근 작업" 바 */}
      <div className="footer f-start" style={{ height: `${footerBarHeight}px` }}>
        <RVI24
          iconDef={isFooterContentVisible ? rvi24DownArrow() : rvi24ChevronUp()}
          onClick={() => setIsFooterContentVisible(!isFooterContentVisible)}
        />
        <div onClick={() => setIsFooterContentVisible(!isFooterContentVisible)}>
          최근 작업
        </div>
      </div>

      {/* 테이블 */}
      <div
        className={`footer-content${isFooterContentVisible ? " open" : ""}`}
        // style={{ height: `${footerHeight}px` }}
      >
        <div className="footer-nav">
          <div className="section-table-outer p-0.5">
            <table>
              <thead>
                <tr>
                  <th>작업 이름 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>{Localization.kr.TARGET} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>{Localization.kr.STATUS} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>{Localization.kr.DETAILS} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>시작 {Localization.kr.TIME} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>대기 {Localization.kr.TIME} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>시작 {Localization.kr.TIME} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.taskName}</td>
                    <td>{row.target}</td>
                    <td>{row.status}</td>
                    <td>{row.details}</td>
                    <td>{row.startTime}</td>
                    <td>{row.waitTime}</td>
                    <td>{row.morningTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
    </>
  );

};

export default Footer;

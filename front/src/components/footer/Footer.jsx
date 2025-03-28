import React, { useState } from "react";
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
  const [selectedFooterTab, setSelectedFooterTab] = useState("recent");
  const handleFooterTabClick = (tab) => setSelectedFooterTab(tab);

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
    <div className={`footer-outer${isFooterContentVisible ? " open" : ""}`}>
      <div className="footer f-start">
        <RVI24 iconDef={isFooterContentVisible ? rvi24DownArrow() : rvi24ChevronUp()}
          onClick={() => setIsFooterContentVisible(!isFooterContentVisible)}
        />
        <div onClick={() => setIsFooterContentVisible(!isFooterContentVisible)}>최근 작업</div>
      </div>

      <div className={`footer-content${isFooterContentVisible ? " open" : ""}`}>
        <div className="footer-nav">
          <div className="section-table-outer p-0.5">
            <table>
              <thead>
                <tr>
                  <th>작업 이름 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>{Localization.kr.TARGET} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>{Localization.kr.STATUS} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>{Localization.kr.DETAILS} <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>시작 {Localization.kr.TIME}<FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>대기 {Localization.kr.TIME}<FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>시작 {Localization.kr.TIME}<FontAwesomeIcon icon={faFilter} fixedWidth /></th>
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
  );
};

export default Footer;

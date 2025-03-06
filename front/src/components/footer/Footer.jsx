import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";

/**
 * @name Footer
 * @description Footer
 *
 * @returns {JSX.Element} Footer
 */
const Footer = ({
  isFooterContentVisible = false,
  setIsFooterContentVisible
}) => {
  const [selectedFooterTab, setSelectedFooterTab] = useState("recent");
  const handleFooterTabClick = (tab) => setSelectedFooterTab(tab);

  // 임시 데이터
  const tableData = Array.from({ length: 20 }).map((_, index) => ({
    id: index + 1,
    taskName: `작업 ${index + 1}`,
    target: index % 2 === 0 ? "CentOS 7.9 Shell Script 테스트 - MYK" : "Datacenter",
    status: "완료 시간",
    details: "",
    startTime: "2025.02.28",
    waitTime: `${index + 1}ms`,
    morningTime: "2025.02.28. 오전"
  }));
  return (
    <div className={`footer-outer${isFooterContentVisible ? " open" : ""}`}>
      <div className="footer">
        <button onClick={() => {
          setIsFooterContentVisible(!isFooterContentVisible)
        }}>
          <FontAwesomeIcon icon={faChevronDown} fixedWidth />
        </button>
        <div>
          <div
            style={{
              color: selectedFooterTab === "recent" ? "black" : "#4F4F4F",
              borderBottom:
                selectedFooterTab === "recent" ? "1px solid blue" : "none",
            }}
            onClick={() => handleFooterTabClick("recent")}
          >
            최근 작업
          </div>
          {/* <div
            style={{
              color: selectedFooterTab === "alerts" ? "black" : "#4F4F4F",
              borderBottom:
                selectedFooterTab === "alerts" ? "1px solid blue" : "none",
            }}
            onClick={() => handleFooterTabClick("alerts")}
          >
            경보
          </div> */}
        </div>
      </div>
  
      <div className={`footer-content${isFooterContentVisible ? " open" : ""}`}>
          <div className="footer-nav">
            <table>
              <thead>
                <tr>
                  <th>작업 이름 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>대상 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>상태 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>세부 정보 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>시작 시간 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>대기 시간 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
                  <th>시작 시간 <FontAwesomeIcon icon={faFilter} fixedWidth /></th>
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
      )}
   


export default Footer;

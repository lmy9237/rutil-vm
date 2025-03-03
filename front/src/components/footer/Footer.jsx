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
const Footer = () => {
  const [isFooterContentVisible, setIsFooterContentVisible] = useState(false);
  const [selectedFooterTab, setSelectedFooterTab] = useState("recent");

  const toggleFooterContent = () => setIsFooterContentVisible(!isFooterContentVisible);
  const handleFooterTabClick = (tab) => setSelectedFooterTab(tab);

  return (
    <div className="footer-outer">
      <div className="footer">
        <button onClick={toggleFooterContent}>
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
  
      <div className="footer-content" style={{ display: isFooterContentVisible ? "block" : "none" }}>
          <div className="footer-nav">
            <table>
              <thead>
                <tr >
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
                <tr>
                  <td>가상 시스템 전원 켜기</td>
                  <td>CentOS 7.9 Shell Script 테스트 - MYK</td>
                  <td>완료 시간</td>
                  <td></td>
                  <td>2025.02.28</td>
                  <td>2ms</td>
                  <td>2025.02.28. 오전</td>
                </tr>
                <tr>
                  <td>전원 켜기 초기화</td>
                  <td>Datacenter</td>
                  <td>완료 시간</td>
                  <td></td>
                  <td>2025.02.28</td>
                  <td>3ms</td>
                  <td>2025.02.28. 오전</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        </div>
      )}
   


export default Footer;

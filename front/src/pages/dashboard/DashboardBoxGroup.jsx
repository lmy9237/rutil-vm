import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faBatteryEmpty,
  faStarOfLife,
  faLink,
  faWarning,
  faEraser,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import "./DashboardBoxGroup.css";
import React from "react";
import { AlertIcon, ArrowDownBoxIcon, ArrowUpBoxIcon, BoxErrorIcon } from "../../components/icons/icons";

/**
 * @name DashboardBox
 * @description 단위 대시보드 박스
 * 
 * @param {string} icon fontawesome 아이콘 
 * @param {string} title 명칭
 * @param {number} cntTotal 총 개수
 * @param {number} cntUp 기동 개수
 * @param {number} cntDown 중지 개수
 * 
 * @returns 
 */
const DashboardBox = ({
  icon,
  title,
  cntTotal, cntUp, cntDown,
  alert, error, warning, 
  navigatePath,
}) => {
  const navigate = useNavigate();

  console.log("...")
  return (
    <div className="box" onClick={() => navigatePath && navigate(navigatePath)}>
      <span className="box-icon-title center">
        {/* FontAwesome 아이콘인지, SVG 아이콘인지 체크 후 렌더링 */}
        {React.isValidElement(icon) ? (
          icon // ✅ SVG 아이콘 렌더링
        ) : (
          <FontAwesomeIcon icon={icon} fixedWidth /> // ✅ FontAwesome 아이콘 렌더링
        )}
        <p className="ml-0.5">{title}</p>
      </span>

      <div className="box-text flex">
        <div className="arrows flex center mr-2">
          {cntUp && (
            <>
              <ArrowUpBoxIcon width={18} height={18} /> {cntUp}&nbsp;
            </>
          )}
          {cntDown && (
            <>
              <ArrowDownBoxIcon width={18} height={18} /> {cntDown}&nbsp;
            </>
          )}
          {alert && (
            <>
              <AlertIcon width={18} height={18} /> {alert}&nbsp;
            </>
          )}
          {error && (
            <>
              <FontAwesomeIcon icon={faEraser} fixedWidth /> {error}&nbsp;
            </>
          )}
          {warning && (
            <>
              <BoxErrorIcon width={18} height={18} /> {warning}&nbsp;
            </>
          )}
        </div>
        <h1>{cntTotal}</h1>
      </div>
    </div>
  );
};

/**
 * @name DashboardBoxGroup
 * @description 대시보드 박스 그룹
 * 
 * @param {Array} boxItems 박스정보 목록
 * @returns 
 */
const DashboardBoxGroup = ({ boxItems }) => {
  console.log("...")
  return (
    <div className="dash-boxs">
      {boxItems &&
        boxItems.map((e, i) => (
          <DashboardBox
            key={i}
            icon={e.icon}
            title={e.title}
            cntTotal={e.cntTotal}
            cntUp={e.cntUp}
            cntDown={e.cntDown}
            alert={e.alert}
            error={e.error}
            warning={e.warning}
            navigatePath={e.navigatePath}
          />
        ))}
    </div>
  );
};

export default DashboardBoxGroup;

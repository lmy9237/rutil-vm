import React from "react";
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
import {
  RVI24,
  rvi24DiagonalUp,
  rvi24DiagonalDown,
  rvi24Bell,
  rvi24Error,
  rvi24Warning,
} from "../../components/icons/RutilVmIcons";

/**
 * @name DashboardBox
 * @description 단위 대시보드 박스
 *
 * @param {string} iconDef rutilVM 아이콘
 * @param {string} title 명칭
 * @param {number} cntTotal 총 개수
 * @param {number} cntUp 기동 개수
 * @param {number} cntDown 중지 개수
 *
 * @returns
 */
const DashboardBox = ({
  iconDef,
  title,
  cntTotal,
  cntUp,
  cntDown,
  alert,
  error,
  warning,
  navigatePath,
}) => {
  const navigate = useNavigate();

  console.log("...");
  return (
    <div className="box" onClick={() => navigatePath && navigate(navigatePath)}>
      <span className="box-icon-title">
        {/* FontAwesome 아이콘인지, SVG 아이콘인지 체크 후 렌더링 */}
        <RVI24 className="box-icon" iconDef={iconDef} />
        <p className="ml-0.5">{title}</p>
      </span>

      <div className="box-text flex">
        <div className="arrows flex center mr-2">
        {cntUp && (
            <>
              <RVI24 className="box-icon up-icon" iconDef={rvi24DiagonalUp} />
              <span className="up-text">{cntUp}</span>&nbsp;
            </>
          )}
          {cntDown && (
            <>
              <RVI24 className="box-icon down-icon" iconDef={rvi24DiagonalDown} />
              <span className="down-text">{cntDown}</span>&nbsp;
            </>
          )}
          {alert && (<>
            <RVI24 className="box-icon" iconDef={rvi24Bell} />{alert}&nbsp;
          </>)}
          {error && (<>
            <RVI24 className="box-icon" iconDef={rvi24Error} />{error}&nbsp;
          </>)}
          {warning && (<>
            <RVI24 className="box-icon" iconDef={rvi24Warning} />{warning}&nbsp;
          </>)}
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
  console.log("...");
  return (
    <div className="dash-boxs">
      {boxItems &&
        boxItems.map((e, i) => (
          <DashboardBox key={i}
            iconDef={e.iconDef}
            title={e.title}
            cntTotal={e.cntTotal} cntUp={e.cntUp} cntDown={e.cntDown}
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

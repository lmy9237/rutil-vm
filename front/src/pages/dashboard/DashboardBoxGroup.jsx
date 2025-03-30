import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardBoxGroup.css";
import {
  RVI24,
  rvi16DiagonalUp,
  rvi16DiagonalDown,
  RVI16,
  severity2Icon,
} from "../../components/icons/RutilVmIcons";
import Logger from "../../utils/Logger";

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

  return (
    <div className="box v-btw" onClick={() => navigatePath && navigate(navigatePath)}>
      <span className="box-icon-title f-start">
        {/* FontAwesome 아이콘인지, SVG 아이콘인지 체크 후 렌더링 */}
        <RVI24 className="box-icon" iconDef={iconDef} />
        <p className="box-icon-name">{title}</p>
      </span>

      <div className="box-detail f-end">
        <div className="box-detail-icons f-end">
          {cntUp && (<div className="box-detail-icon f-end">
            <RVI16 className="box-icon sml" iconDef={rvi16DiagonalUp()} />
            <span className="txt up v-end">{cntUp}</span>
          </div>)}
          {cntDown && (<div className="box-detail-icon f-end">
            <RVI16 className="box-icon sml" iconDef={rvi16DiagonalDown()} />
            <span className="txt down v-end">{cntDown}</span>
          </div>)}
          {alert && (<div className="box-detail-icon f-end">
            <RVI16 className="box-icon sml" iconDef={severity2Icon("ALERT", true)} />
            <span className="txt alert v-end">{alert}</span>
          </div>)}
          {error && (<div className="box-detail-icon f-end">
            <RVI16 className="box-icon sml" iconDef={severity2Icon("ERROR", true)} />
            <span className="txt error v-end">{error}</span>
          </div>)}
          {warning && (<div className="box-detail-icon f-end">
            <RVI16 className="box-icon sml" iconDef={severity2Icon("WARNING", true)} />
            <span className="txt warning f-start">{warning}</span>
          </div>)}
        </div>
        <h1 className="f-center">{cntTotal}</h1>
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
  Logger.debug("...");
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

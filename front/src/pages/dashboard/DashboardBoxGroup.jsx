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
        {icon && <FontAwesomeIcon icon={icon} fixedWidth />}
        <p>{title}</p>
      </span>
      <h1>{cntTotal}</h1>
      <div className="arrows">
        {cntUp && (
          <>
            <FontAwesomeIcon icon={faArrowUp} fixedWidth /> {cntUp}&nbsp;
          </>
        )}
        {cntDown && (
          <>
            <FontAwesomeIcon icon={faArrowDown} fixedWidth /> {cntDown}&nbsp;
          </>
        )}
        {alert && (
          <>
            <FontAwesomeIcon icon={faMessage} fixedWidth /> {alert}&nbsp;
          </>
        )}
        {error && (
          <>
            <FontAwesomeIcon icon={faEraser} fixedWidth /> {error}&nbsp;
          </>
        )}
        {warning && (
          <>
            <FontAwesomeIcon icon={faWarning} fixedWidth /> {warning}&nbsp;
          </>
        )}
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

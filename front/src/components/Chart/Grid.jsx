import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip"; // ✅ 툴팁 import
import "react-tooltip/dist/react-tooltip.css"; // ✅ 스타일
import Logger from "../../utils/Logger";
import "./Grid.css";

const Grid = ({ 
  type,
  data = []
}) => {
  const [gridData, setGridData] = useState([]);
  const navigate = useNavigate();
  const tooltipId = useMemo(() => ("grid-tooltip"), []);

  useEffect(() => {
    const filledData = [...data];
    while (filledData.length < 15) {
      filledData.push({
        id: `placeholder-${filledData.length}`,
        cpuPercent: null,
        memoryPercent: null,
        name: "",
        status: "",
      });
    }
    if (JSON.stringify(filledData) !== JSON.stringify(gridData)) {
      setGridData(filledData);
    }
  }, [data, gridData]);

  const severity2Label = useCallback((value) => {
    Logger.debug(`Grid > severity2Label ... value: ${value}`)
    if (value === 0 || value === null) return "disabled";
    if (value < 65) return "okay";
    else if (value >= 65 && value < 75) return "norm";
    else if (value >= 75 && value < 90) return "warn";
    else if (value >= 90) return "crit";
  }, [])

  const displayMetric = useCallback((type, item) => (
    type==="cpu" ? item.cpuPercent : item.memoryPercent
  ), []);

  const handleClick = useCallback((id) => {
    if (id && id.startsWith("placeholder")) return;
    if (type === "domain") {
      navigate(`/storages/domains/${id}`);
    } else {
      navigate(`/computing/vms/${id}`);
    }
  }, []);

  return (
    <div className="grid-container">
      {gridData.map((item, index) => {
        const hasAnyData = item.cpuPercent !== null || item.memoryPercent !== null;

        return (
          <div key={item.id || index}
            className={
              `grid-item f-center ${severity2Label(displayMetric(type, item))}${hasAnyData ? `` : ` disabled`}`
            }
            onClick={() => hasAnyData && handleClick(item.id)}
            data-tooltip-id={tooltipId}
            data-tooltip-content={item.name || ""}
            data-tooltip-place="top"
          >
            {hasAnyData ? (
              <>
                <div>
                  <div className="percent f-center">
                    <h1>{displayMetric(type, item)}</h1>
                    <div className="percent unit">%</div>
                  </div>
                  <div className="grid-item-name">( {item.name} )</div>
                </div>
              </>
            ) : (
              <div className="percent" style={{ color: "rgb(0 0 0)" }}></div>
            )}
          </div>
        );
      })}

      {/* ✅ 툴팁 컴포넌트는 한 번만 선언 */}
      <Tooltip id={tooltipId}
        className="grid-tooltip"
        effect="solid"
        delayShow={100}
      />
    </div>
  );
};

export default Grid;

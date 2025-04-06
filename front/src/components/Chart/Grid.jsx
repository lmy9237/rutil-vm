import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip"; // ✅ 툴팁 import
import "react-tooltip/dist/react-tooltip.css"; // ✅ 스타일
import "./Grid.css";

const Grid = ({ type, data = [] }) => {
  const [gridData, setGridData] = useState([]);
  const navigate = useNavigate();
  const tooltipId = "grid-tooltip";

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

  const getBackgroundColor = (value) => {
    if (value === 0 || value === null) return "#F8F8F8";
    if (value < 65) return "#E7F2FF";
    // if (value < 65) return "yellow";
    if (value >= 65 && value < 75) return "#FFF3C9";
    if (value >= 75 && value < 90) return "#FFC58A";
    if (value >= 90) return "rgb(226,29,29)";
    return "white";
  };

  const handleClick = (id) => {
    if (id && id.startsWith("placeholder")) return;
    if (type === "domain") {
      navigate(`/storages/domains/${id}`);
    } else {
      navigate(`/computing/vms/${id}`);
    }
  };

  return (
    <div className="grid-container">
      {gridData.map((item, index) => {
        const hasAnyData = item.cpuPercent !== null || item.memoryPercent !== null;

        return (
          <div
            key={item.id || index}
            className={`grid-item f-center${hasAnyData ? `` : ` disabled`}`}
            onClick={() => hasAnyData && handleClick(item.id)}
            data-tooltip-id={tooltipId}
            data-tooltip-content={item.name || ""}
            data-tooltip-place="top"
            style={{
              backgroundColor:
                type === "cpu"
                  ? getBackgroundColor(item.cpuPercent)
                  : getBackgroundColor(item.memoryPercent),
            }}
          >
            {hasAnyData ? (
              <>
                <div>
                  <div className="percent f-center">
                    <h1>{type === "cpu" ? item.cpuPercent : item.memoryPercent}</h1>
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
      <Tooltip
        id={tooltipId}
        className="grid-tooltip"
        effect="solid"
        delayShow={100}
      />
    </div>
  );
};

export default Grid;

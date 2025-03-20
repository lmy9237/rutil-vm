import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Grid.css";

const Grid = ({ type, data = [] }) => {
  const [gridData, setGridData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filledData = [...data];
    while (filledData.length < 15) {
      filledData.push({
        id: `placeholder-${filledData.length}`,
        cpuPercent: null,
        memoryPercent: null,
        name: "",
      });
    }
    if (JSON.stringify(filledData) !== JSON.stringify(gridData)) {
      setGridData(filledData);
    }
  }, [data, gridData]);

  const getBackgroundColor = (value) => {
    if (value === 0 || value === null) return "#F8F8F8";
    if (value < 65) return "#E7F2FF";
    if (value >= 65 && value < 75) return "#FFF3C9";
    if (value >= 75 && value < 90) return "#FFC58A";
    if (value >= 90) return "rgb(226,29,29)";
    return "white";
  };

  const handleClick = (id) => {
    if (id && id.startsWith("placeholder")) return; // placeholder 클릭 방지
    if (type === "domain") {
      navigate(`/storages/domains/${id}`);
    } else {
      navigate(`/computing/vms/${id}`);
    }
  };

  return (
    <div className="grid-container">
      {gridData.map((item, index) => (
        <div
          key={item.id || index}
          className="grid-item"
          onClick={() => handleClick(item.id)}
          title={item.name}
          style={{
            backgroundColor:
              type === "cpu"
                ? getBackgroundColor(item.cpuPercent)
                : getBackgroundColor(item.memoryPercent),
          }}
        >
          {item.cpuPercent !== null || item.memoryPercent !== null ? (
            <div className="percent">
              {type === "cpu" ? item.cpuPercent : item.memoryPercent}%
            </div>
          ) : (
            <div
              className="percent placeholder"
              style={{ color: "rgb(0 0 0)" }}
            >
              -
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Grid;

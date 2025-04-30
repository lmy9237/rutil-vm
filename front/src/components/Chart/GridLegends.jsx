import React from "react";
import "./GridLegends.css";

const GridLegends = () => {
  const legends = [
    { type: "crit", "value": "90%" },
    { type: "warn", "value": "75-90%" },
    { type: "norm", "value": "65-75%" },
    { type: "okay", "value": "<65%" },
  ]

  return (
    <div className="legend-bar-container f-start pl-3.5">
      {legends.map(({ type, value }) => (
        <div className="legend-item f-center">
          <span className={`legend ${type} fs-8`} />
          <span className="fs-8">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default GridLegends;

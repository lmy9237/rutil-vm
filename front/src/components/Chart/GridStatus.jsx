import React from "react";
import "./GridStatus.css";

const GridStatus = () => {
    return (
      <div className="legend-bar-container">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "rgb(226,29,29)" }}></span>
          <span>90%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#F46C53" }}></span>
          <span>75-90%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#FFC58A" }}></span>
          <span>65-75%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#E7F2FF" }}></span>
          <span>&lt;65%</span>
        </div>
      </div>
    );
  };

export default GridStatus;

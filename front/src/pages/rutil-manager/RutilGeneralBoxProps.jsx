import React from "react";
import "./RutilGeneralBoxProps.css"

const RutilGeneralBoxProps = ({ title, icon, badge, children }) => {
  return (
    <div className="summary-box">
      <div className="summary-box-header f-between">
        <div className="f-start items-center gap-1">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="rutil-box-title fw-700 fs-13">{title}</span>
        </div>
        {badge !== undefined && <span className="badge">{badge}</span>}
      </div>
      <hr className="w-full my-2" />
      <div className="summary-box-content">
        {children}
      </div>
    </div>
  );
};

export default RutilGeneralBoxProps;

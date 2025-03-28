import React from "react";
import "./StatusBadge.css"

const StatusBadge = ({
  status="default",
  text="없음",
  ...props
}) => {
  return (
    <span className={`status-label f-center ${status}`}
      {...props}
    >
      {text}
    </span>
  );
};

export default StatusBadge;

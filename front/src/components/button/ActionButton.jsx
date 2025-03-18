import React from "react"
import { RVI16 } from "../icons/RutilVmIcons";
import "./ActionButton.css"

const ActionButton = ({ 
  actionType = "default",
  label = "", iconDef, ...props 
}) => {
  return (
    <button className={actionType === "context" ? "btn-right-click" : "btn-action"}
      {...props}
    >
      {label}
      {iconDef && <RVI16 iconDef={iconDef} />}
    </button>
 );
}

export default ActionButton;

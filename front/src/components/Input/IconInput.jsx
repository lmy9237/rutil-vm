import React, { useMemo } from "react";
import { RVI16 } from "../icons/RutilVmIcons";
import "./IconInput.css"; // Import the CSS file
import Logger from "../../utils/Logger";

const IconInput = ({
  iconDef,
  type = "text",
  placeholder = "Enter text...",
  ...props
}) => {
  const isPassword = useMemo(() => type === "password")

  return (
    <div className="icon-input-container">
      {iconDef && (
        <div className="icon-container">
          <RVI16 iconDef={iconDef} className="input-icon" />
        </div>
      )}
      <input type={type}
        className="icon-input"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
export default IconInput;

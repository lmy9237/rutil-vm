import React, { useState, useMemo } from "react";
import { RVI16 } from "../icons/RutilVmIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./../label/LabelInput.css"; // Import the CSS file
import "./IconInput.css"; // Import the CSS file

const IconInput = ({
  iconDef,
  type = "text",
  placeholder = "Enter text...",
  ...props
}) => {
  const isPassword = useMemo(() => type === "password")
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="icon-input-container" style={{ position: "relative" }}>
      {iconDef && (
        <span className="icon-container">
          <RVI16 iconDef={iconDef} />
        </span>
      )}
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        className="icon-input"
        placeholder={placeholder}
        {...props}
      />
      {isPassword && (
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}
          onClick={handleTogglePassword}
          className="password-toggle-icon fs-14"
        />        
      )}
    </div>
  );
};
export default IconInput;

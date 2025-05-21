import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { RVI16 }              from "@/components/icons/RutilVmIcons";
import "./../label/LabelInput.css"; // Import the CSS file
import Localization           from "@/utils/Localization";
import "./IconInput.css"; // Import the CSS file

const IconInput = ({
  iconDef,
  type = "text",
  placeholder = Localization.kr.PLACEHOLDER,
  register, target, options={},
  ...props
}) => {
  const isPassword = useMemo(() => type === "password")
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div 
      className="icon-input-container" 
    >
      {iconDef && (
        <span className="icon-container">
          <RVI16 iconDef={iconDef} />
        </span>
      )}
      <input 
        type={isPassword ? (showPassword ? "text" : "password") : type}
        className="icon-input"
        placeholder={placeholder}
        {...register(target, options)}
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

import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { RVI16, rvi16EyeIcon, rvi16EyeOffIcon }              from "@/components/icons/RutilVmIcons";
import {
  RVI16,
  rvi16EyeIcon, 
  rvi16EyeOffIcon
} from "@/components/icons/RutilVmIcons";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./../label/LabelInput.css"; // Import the CSS file
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
        <RVI16 iconDef={showPassword ? rvi16EyeOffIcon() : rvi16EyeIcon()}
          onClick={handleTogglePassword}
          className="password-toggle-icon fs-14"
        />
      )}
    </div>
  );
};
export default IconInput;

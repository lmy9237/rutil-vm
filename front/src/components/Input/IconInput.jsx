import React, { useState, useMemo } from "react";
import {
  RVI16, rvi16Eye,  rvi16EyeSlash
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
      <input 
        type={isPassword ? (showPassword ? "text" : "password") : type}
        className="icon-input pl-8"
        // placeholder={placeholder}
        {...register(target, options)}
      />
      {iconDef && (
        <span className="input-icon-left">
          <RVI16 iconDef={iconDef} />
        </span>
      )}
      {isPassword && (
        <RVI16 iconDef={showPassword ? rvi16EyeSlash() : rvi16Eye()}
          onClick={handleTogglePassword}
          className="password-toggle-icon fs-14"
        />
      )}
    </div>
  );
};
export default IconInput;

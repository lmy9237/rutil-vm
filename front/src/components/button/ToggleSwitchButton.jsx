import React from "react";
import { Label } from "@/components/ui/label";
import "./ToggleSwitchButton.css";

const ToggleSwitchButton = ({
  id,
  label,
  checked,
  disabled,
  tType, fType,
  ...props
}) => {
  return (
    <div className="input-container input-select f-start">
      <Label htmlFor={id}>{label}</Label>
      <div className="switch-outer flex ml-auto w-[330px]">
        {!disabled && <Label className="switch">
          <input type="checkbox"
            checked={checked}
            onChange={props.onChange}
            disabled={disabled}
          />
          <span className="slider round"></span>
        </Label>}
        <span className="toggle-status f-start">{checked ? tType : fType}</span>
      </div>
    </div>
  )
}

export default ToggleSwitchButton;
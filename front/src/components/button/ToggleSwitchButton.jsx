import React from "react";
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
      <label htmlFor={id}>{label}</label>
      <div className="switch-outer ml-auto">
        <label className="switch">
          <input type="checkbox"
            checked={checked}
            onChange={props.onChange}
            disabled={disabled}
          />
          <span className="slider round"></span>
        </label>
        <span className="toggle-status f-start">{checked ? tType : fType}</span>
      </div>
    </div>
  )
{/* 
    <div className="input-container input-select f-start">
      <Label htmlFor={id}
        className="h-full"
      >
        {label}
      </Label>
      <div className="switch-outer f-end ml-auto">
        <Switch id={id} className="ml-auto" 
          checked={checked}
          onCheckedChange={props.onChange}
        />
        <Label className="switch w-full h-full">
          {checked ? tType : fType}
        </Label>
      </div>
    </div>
*/}
}

export default ToggleSwitchButton;

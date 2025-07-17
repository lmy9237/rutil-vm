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
      <div className="switch-outer flex ml-auto">
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
}

export default ToggleSwitchButton;

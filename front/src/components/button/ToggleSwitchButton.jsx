import React from 'react';
import './ToggleSwitchButton.css';

const ToggleSwitchButton = ({ id, label, checked, onChange, disabled, tType, fType }) => {
  return (
    <div className="input-select">
      <label htmlFor={id}>{label}</label>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="slider small"></span>
      </label>
      <span className="toggle-status">{checked ? tType : fType}</span>
    </div>
  );
};

export default ToggleSwitchButton;

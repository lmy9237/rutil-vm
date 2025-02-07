import React from 'react';

const LabelInputNum = ({ className, label, id, value, autoFocus=false, onChange, disabled }) => (
  <div className={className}>
    <label htmlFor={id}>{label}</label>
    <input
      type="number"
      id={id}
      value={value}
      autoFocus={autoFocus}
      onChange={onChange}
      disabled={disabled}
      min="0"
    />
  </div>
);

export default LabelInputNum;
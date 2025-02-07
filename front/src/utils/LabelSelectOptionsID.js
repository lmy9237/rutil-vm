import React from 'react';

const LabelSelectOptionsID = ({ className, label, value, onChange, disabled, loading, options }) => (
  <div className={className}>
    <label>{label}</label>
    <select value={value} onChange={onChange} disabled={disabled}>
      { loading ? (
        <option>로딩중~</option>
      ): (
        options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}: {opt.id}
        </option>
        ))
      )}
    </select>
  </div>
);

export default LabelSelectOptionsID;
const LabelSelectOptions = ({
  className,
  label,
  value,
  onChange,
  disabled,
  options,
}) => (
  <div className={className}>
    <label>{label}</label>
    <select value={value} onChange={onChange} disabled={disabled}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default LabelSelectOptions;
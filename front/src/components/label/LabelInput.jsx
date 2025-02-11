const LabelInput = ({
  className,
  label,
  id,
  value,
  autoFocus = false,
  onChange,
  disabled,
}) => (
  <div className={className}>
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      value={value}
      autoFocus={autoFocus}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

export default LabelInput;
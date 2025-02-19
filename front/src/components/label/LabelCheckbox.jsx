import "./LabelInput.css"

const LabelCheckbox = ({
  className,
  label,
  id,
  checked,
  onChange,
  disabled,
}) => (
  <div className={className}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);


export default LabelCheckbox;
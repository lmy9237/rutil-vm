import LabelInput from "./LabelInput";

/**
 * @name LabelCheckbox
 * @description 레이블 체크박스
 * 
 * @prop {string} className 
 * @prop {string} label 
 * @prop {string} id
 * @prop {string} value
 * @prop {boolean} autoFocus
 * @prop {function} onChange
 * @prop {boolean} disabled
 *  
 * @returns {JSX.Element} LabelInput
 */
const LabelCheckbox = ({
  className,
  label,
  id,
  autoFocus = false,
  checked,
  onChange,
  disabled,
  required,
}) => (
  <LabelInput className={className}
    id={id} type={"checkbox"}
    value={checked}
    label={label}
    autoFocus={autoFocus}
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    required={required}
  />
);


export default LabelCheckbox;
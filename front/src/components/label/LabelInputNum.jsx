import LabelInput from "./LabelInput";
/**
 * @name LabelInputNum
 * @description 레이블 숫자 입력란
 * 
 * @prop {string} className 
 * @prop {string} label 
 * @prop {string} id
 * @prop {string} value
 * @prop {boolean} autoFocus
 * @prop {function} onChange
 * @prop {boolean} disabled
 *  
 * @returns {JSX.Element} LabelInputNum
 */
const LabelInputNum = ({
  className,
  label,
  id,
  value,
  autoFocus = false,
  onChange,
  disabled,
}) => (
  <LabelInput className={className}
    label={label}
    id={id}
    value={value}
    autoFocus={autoFocus}
    onChange={onChange}
    disabled={disabled}
  />
);

export default LabelInputNum;

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
  label,
  id,
  value,
  autoFocus = false,
  ...props
}) => ( 
  <LabelInput id={id}
    label={label}
    value={value}
    autoFocus={autoFocus}
    {...props}
  />
);

export default LabelInputNum;

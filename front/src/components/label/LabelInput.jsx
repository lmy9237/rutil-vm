/**
 * @name LabelInput
 * @description 레이블 입력란
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
const LabelInput = ({
  className = "",
  type="text",
  label,
  id,
  value,
  autoFocus = false,
  onChange,
  disabled,
}) => (
  <div className={`flex justify-center items-center mb-1 w-full px-[10px] ${className}`}>
    <label className="flex justify-end items-center mx-1 min-w-[60px] max-w-[100px] text-end" htmlFor={id}>
      {label}
    </label>
    <input className="w-full min-w-30"
      id={id} type={type}
      value={value}
      autoFocus={autoFocus}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

export default LabelInput;
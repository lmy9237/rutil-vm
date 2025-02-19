import "./LabelInput.css"

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
  onInvalid,
  disabled,
  required,
}) => (
  <>
  {/*}
  <div className={`flex justify-center items-center mb-1 w-full  ${className}`}>
    <label className="flex  items-center mx-1 min-w-[60px] max-w-[100px] text-end" htmlFor={id}>*/}
  <div className='input-text'>
    <label htmlFor={id}>
      {label}
    </label>
    {/*}  <input className="w-[15vw]"*/}
    <input
      id={id} type={type}
      placeholder={label}
      value={value}
      autoFocus={autoFocus}
      onChange={onChange}
      onInvalid={onInvalid}
      disabled={disabled}
      required={required}
    />
  </div>
 </>
);

export default LabelInput;
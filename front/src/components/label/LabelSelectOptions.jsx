import "./LabelInput.css"

/**
 * @name LabelSelectOptions
 * @description 레이블 선택란
 *
 * @prop {string} className
 * @prop {string} label
 * @prop {string} id
 * @prop {string} value
 * @prop {function} onChange
 * @prop {boolean} disabled
 * @prop {Array} options
 *
 * @returns {JSX.Element} LabelSelectOptions
 */
const LabelSelectOptions = ({
  className = "",
  label,
  id,
  value,
  onChange,
  disabled,
  options,
}) => (
  <>
  {/*<div className={`flex justify-center items-center mb-1 w-full px-[25px] ${className}`}>
    <label className="flex justify-end items-center mx-1 w-[60px] max-w-[100px] text-end" htmlFor={id}>*/}
   <div className='input-select'>
    <label htmlFor={id}>{label}</label>
    <select value={value} onChange={onChange} disabled={disabled}>
      {options.map((opt) => (
        <option className="option-box" key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
  </>
);

export default LabelSelectOptions;

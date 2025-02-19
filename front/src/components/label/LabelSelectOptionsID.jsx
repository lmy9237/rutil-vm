/**
 * @name LabelSelectOptionsID
 * @description 레이블 선택란 (ID)
 *
 * @prop {string} className
 * @prop {string} label
 * @prop {string} id
 * @prop {string} value
 * @prop {function} onChange
 * @prop {boolean} disabled
  loading,
 * @prop {Array} options
 *
 * @returns {JSX.Element} LabelSelectOptionsID
 */
const LabelSelectOptionsID = ({
  className = "",
  label,
  id,
  value,
  onChange,
  disabled,
  loading,
  options,
}) => (
  <>
  {/*
   <div className={`flex justify-center items-center mb-1 w-full px-[10px] ${className}`}>
     <label className="flex justify-end items-center mx-1 min-w-[60px] max-w-[100px] text-end" htmlFor={id}>*/}
  <div className='input-select'>
    <label className="" htmlFor={id}>
      {label}
    </label>
    <select 
      value={value} onChange={onChange} disabled={disabled}
    >
      {loading ? (
        <option>로딩중~</option>
      ) : (
        options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {/* {opt.name} */}
            {opt.name}: {opt.id}
          </option>
        ))
      )}
    </select>
  </div>
  </>
);

export default LabelSelectOptionsID;
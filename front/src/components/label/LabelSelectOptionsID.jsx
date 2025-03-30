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
  etcLabel
}) => (
  <>
  <div className='input-select'>
    <label className="" htmlFor={id}>{label} </label>
    <select value={value} onChange={onChange} disabled={disabled}>
      {loading ? (
        <option>로딩중~</option>
      ) : options.length === 0 ? (
        <option>항목 없음</option>
      ) : (
        options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {/* {opt.name} */}
            {opt.name}: {opt.id} {etcLabel}
            {/* {opt.name} {etcLabel} */}
          </option>
        ))
      )}
    </select>
  </div>
  </>
);

export default LabelSelectOptionsID;
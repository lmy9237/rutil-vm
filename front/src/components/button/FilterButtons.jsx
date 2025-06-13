import "./FilterButtons.css";

/**
 * @name FilterButtons
 * @description 필터처리 버튼
 * (/computing/hosts/<hostId>)
 *
 * @param {[string]} options 선택목록
 * @param {string} activeOption 선택 된 옵션
 * 
 * 
 * @returns {JSX.Element} FilterButtons
 */
const FilterButtons = ({
  options,
  activeOption,
  onClick=()=>{},
}) => (
  <div className="host-filter-btns f-start">
    {options.map(({ key, label }) => (
      <FilterButton key={key}
        onClick={() => onClick(key)}
        label={label}
        isActive={activeOption === key}
      />
    ))}
  </div>
);

const FilterButton = ({
  label,
  isActive,
  ...props
}) => (
  <button key={props.key}
    className={isActive ? "active" : ""}
    {...props}
  >
    {label}
  </button>
)


export default FilterButtons;


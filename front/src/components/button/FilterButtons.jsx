import { RVI16 } from "../icons/RutilVmIcons";
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
    {options.map(({ key, label, icon=null, }) => (
      <FilterButton key={key} icon={icon}
        onClick={() => onClick(key)}
        label={label}
        isActive={activeOption === key}
      />
    ))}
  </div>
);

const FilterButton = ({
  label,
  icon,
  isActive,
  ...props
}) => (
  <button key={props.key}
    className={`f-center ${isActive ? "active" : ""}`}
    {...props}
  >
    {icon && <RVI16 iconDef={icon} />}
    {label}
  </button>
)


export default FilterButtons;


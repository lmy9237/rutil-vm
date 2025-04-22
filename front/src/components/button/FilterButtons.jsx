/* 디스크 유형 : 이미지|  전체 이런거 컴포넌트 */
import "./FilterButtons.css";

const FilterButtons = ({
  options,
  activeOption,
  onClick 
}) => (
  <div className="host-filter-btns f-center">
    {options.map(({ key, label }) => (
      /* <button
        key={key}
        onClick={() => onClick(key)}
        className={activeOption === key ? "active" : ""}
      >
        {label}
      </button>
      */
      <FilterButton key={key}
        label={label}
        onClick={() => onClick(key)}
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


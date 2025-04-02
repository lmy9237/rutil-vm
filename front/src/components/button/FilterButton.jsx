/* 디스크 유형 : 이미지|  전체 이런거 컴포넌트 */
import "./FilterButton.css";

const FilterButton = ({
  options,
  activeOption,
  onClick 
}) => {
  return (
    <div className="host-filter-btns">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onClick(key)}
          className={activeOption === key ? "active" : ""}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default FilterButton;
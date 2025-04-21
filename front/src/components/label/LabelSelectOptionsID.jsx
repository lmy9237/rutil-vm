import { useState, useRef } from "react";
import "./LabelInput.css";
import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
import useClickOutside from "../../hooks/useClickOutside"; // ✅ import 추가

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
 * @prop {boolean} loading
 * @prop {Array} options
 * @prop {string} etcLabel
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
  options = [],
  etcLabel = "",
}) => {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);        // ✅ 전체 감지
  const selectBoxRef = useRef(null);       // ✅ custom-select-box만 허용

  const handleOptionClick = (optionValue) => {
    if (disabled) return;
    onChange({ target: { value: optionValue } });
    setOpen(false);
  };

  useClickOutside(wrapperRef, (e) => {
    setOpen(false);
  });

  const selectedLabel = loading
    ? "로딩중~"
    : options.length === 0
      ? "항목 없음"
      : options.find(opt => opt.id === value)
        ? `${options.find(opt => opt.id === value).name}: ${options.find(opt => opt.id === value).id} ${etcLabel}`
        : "선택하세요";

  return (
    <div className={`input-select custom-select-wrapper ${className}`} ref={wrapperRef}>
      <label htmlFor={id}>{label}</label>

      <div
        className={`custom-select-box f-btw ${disabled ? "disabled" : ""}`}
        ref={selectBoxRef} // ✅ ref 적용
        onClick={() => !disabled && setOpen(!open)}
      >
        <span>{selectedLabel}</span>
        <RVI16 
          iconDef={open ? rvi16ChevronUp : rvi16ChevronDown} 
        />
      </div>

      {open && !loading && (
        <div className="custom-options">
          {options.length === 0 ? (
            <div className="custom-option disabled">항목 없음</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.id}
                className={`custom-option ${opt.id === value ? "selected" : ""}`}
                onClick={() => handleOptionClick(opt.id)}
              >
                {opt.name}: {opt.id} {etcLabel}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LabelSelectOptionsID;

import { useState, useRef, useCallback } from "react";
import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
import useClickOutside from "../../hooks/useClickOutside"; // ✅ import 추가
import Logger from "../../utils/Logger";
import "./LabelInput.css";
import Loading from "../common/Loading";

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

const LabelSelectOptionId = ({
  opt, 
  value,
  etcLabel,
  handleOptionClick,
}) => (
  <div
    key={opt.id}
    className={`custom-option ${opt.id === value ? "selected" : ""}`}
    onClick={() => handleOptionClick(opt.id)}
  >
    {opt.name}: {opt.id} {etcLabel}
  </div>
);

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

  // const handleOptionClick = useCallback((optionValue) => {
  //   Logger.debug(`LabelSelectOptionsID > handleOptionClick ... optionValue: ${optionValue}`)
  //   if (disabled) return;
  //   onChange({ target: { value: optionValue } });
  //   setOpen(false);
  // }, [onChange, disabled]);

  const handleOptionClick = useCallback((optionValue) => {
    Logger.debug(`LabelSelectOptionsID > handleOptionClick ... optionValue:`, optionValue);
    if (disabled) return;
  
    const selectedOption = options.find(opt => opt.id === optionValue);
    if (selectedOption) {
      onChange(selectedOption); // ✅ 객체 자체를 넘김
    }
  
    setOpen(false);
  }, [disabled, options, onChange]);
  
  useClickOutside(wrapperRef, (e) => setOpen(false));

  const boxStyle = !label ? { width: "100%" } : undefined;

  const getSelectedLabel = () => {
    if (loading) return <Loading/>;
    if (options.length === 0) return "항목 없음";
    const selected = options.find((opt) => opt.id === value);
    return selected
      ? `${selected.name}: ${selected.id} ${etcLabel}`
      : "선택하세요";
  };

  return (
    <div className={`input-select custom-select-wrapper ${className}`} ref={wrapperRef}>
      {label && <label htmlFor={id}>{label}</label>}
        <div
          className={`custom-select-box f-btw ${disabled ? "disabled" : ""}`}
          style={boxStyle}
          onClick={() => !disabled && setOpen(!open)}
        >
          <span>{getSelectedLabel()}</span>
          <RVI16 iconDef={open ? rvi16ChevronUp : rvi16ChevronDown} />
        </div>

        {open && !loading && (
          <div className="custom-options"  style={boxStyle} >
            {options.length === 0 ? (
              <div className="custom-option disabled">항목 없음</div>
            ) : (
              options.map((opt) => (
                <LabelSelectOptionId
                  opt={opt}
                  value={value}
                  etcLabel={etcLabel}
                  handleOptionClick={handleOptionClick}
                />
              ))
            )}
          </div>
        // */
        /*
        createPortal(
          <div className="custom-options" style={boxStyle} >
            {options.length === 0 ? (
              <div className="custom-option disabled">항목 없음</div>
            ) : (
              options.map((opt) => (
                <LabelSelectOptionId
                  opt={opt}
                  value={value}
                  etcLabel={etcLabel}
                  handleOptionClick={handleOptionClick}
                />
              ))
            )}
        </div>, document.querySelector('.modal'))
        */
      )}
    </div>
  );
};

export default LabelSelectOptionsID;


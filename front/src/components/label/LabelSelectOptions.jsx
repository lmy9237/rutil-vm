import { useState, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
import useClickOutside from "../../hooks/useClickOutside";
import Logger from "../../utils/Logger";
import "./LabelInput.css";

const LabelSelectOptions = ({
  className = "",
  label,
  id,
  value,
  onChange,
  disabled,
  options = [],
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  const handleOptionClick = useCallback((optionValue) => {
    Logger.debug(`LabelSelectOptions > handleOptionClick ... optionValue: ${optionValue}`)
    if (disabled) return;
    onChange({ target: { value: optionValue } });
    setOpen(false);
  }, [disabled]);

  useClickOutside(selectRef, (e) => setOpen(false))

  const boxStyle = !label ? { width: "100%" } : undefined; // label이 없으면 100% width style 지정 
  const selectedLabel = useMemo(() => (
    options.find(opt => opt.value === value)?.label || "선택하세요"
  ), [options, value]);

  return (
    <div className={`input-select custom-select-wrapper${className}`} ref={selectRef}>
      {label && <div className="select-label">{label}</div>}
      <div
        className={`custom-select-box f-btw ${disabled ? "disabled" : ""}`}
        style={boxStyle} 
        onClick={() => !disabled && setOpen(!open)}
      >
        <span>{selectedLabel}</span>
        <RVI16 iconDef={open ? rvi16ChevronUp : rvi16ChevronDown} />
      </div>
      {open && (
        <div className="custom-options">
          {options.map((opt) => (
            <LabelSelectOption 
              opt={opt}
              value={value}
              handleOptionClick={handleOptionClick}
            />
          ))}
        </div>
        // createPortal((
        //   <div className="custom-options">
        //     {options.map((opt) => (
        //       <LabelSelectOption 
        //         opt={opt}
        //         value={value}
        //         handleOptionClick={handleOptionClick}
        //       />
        //     ))}
        //   </div>
        // ), document.querySelector(".modal"))
      )}
    </div>
  );
};

const LabelSelectOption = ({
  opt, 
  value,
  handleOptionClick,
}) => (
  <div
    key={opt.value}
    className={`custom-option ${opt.value === value ? "selected" : ""}`}
    onClick={() => handleOptionClick(opt.value)}
  >
    {opt.label}
  </div>
)

export default LabelSelectOptions;

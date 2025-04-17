import { useState, useRef, useEffect } from "react";
import "./LabelInput.css";
import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";

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

  const handleOptionClick = (optionValue) => {
    if (disabled) return;
    onChange({ target: { value: optionValue } });
    setOpen(false);
  };

  const handleClickOutside = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || "선택하세요";

  return (
    <div className={`input-select custom-select-wrapper${className}`} ref={selectRef}>
      <label htmlFor={id}>{label}</label>
      <div
        className={`custom-select-box f-btw   ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span>{selectedLabel}</span>
        <RVI16 iconDef={open ? rvi16ChevronUp : rvi16ChevronDown} />
      </div>
      {open && (
        <div className="custom-options">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-option ${opt.value === value ? "selected" : ""}`}
              onClick={() => handleOptionClick(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabelSelectOptions;

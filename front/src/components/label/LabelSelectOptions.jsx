import { forwardRef, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Loading }                from "@/components/common/Loading";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./LabelInput.css";

/**
 * @name LabelSelectOptions (shadcn 기반)
 * @description 셀렉트 컴포넌트 (레이블 포함)
 *
 * @prop {string} className
 * @prop {string} label
 * @prop {string} id
 * @prop {string} value
 * @prop {function} onChange
 * @prop {boolean} disabled
 * @prop {boolean} loading
 * @prop {Array<{ value: string, label: string }>} options
 *
 * @returns {JSX.Element}
 */
const LabelSelectOptions = forwardRef(({
  className = "",
  label,
  id,
  value,
  onChange,
  disabled,
  loading,
  options = [],
  placeholderLabel=Localization.kr.PLACEHOLDER_SELECT,
  placeholderValue="none", // SelectItem에 들어갈 내용이 null이거나 비어있으면 오류가 남
}, ref) => {
  
  const OPTION_EMPTY = { 
    label: placeholderLabel, 
    value: placeholderValue
  }

  const _options = [
    OPTION_EMPTY,
    ...options
  ]

  const selectedLabel = useMemo(() => {
    if (loading) return <Loading />;
    if (options.length === 0) return Localization.kr.NO_ITEM;

    const selected = _options.find((opt) => opt.value === value);
    
    return (selected === undefined || selected?.value === placeholderValue)
      ? placeholderLabel
      : selected.label
  }, [options, loading, value]);

  const handleChange = (valueSelected) => {
    const selectedOption = _options.find((opt) => opt.value === valueSelected);
    if (valueSelected === placeholderValue) {
      onChange?.({ target: { value: placeholderValue } })
    } else if (selectedOption) {
      onChange?.({ target: { value: valueSelected } });
    }
  };

  return (
    <div className={`input-select custom-select-wrapper f-start ${className}`}>
      {label && <label htmlFor={label} className="select-label">{label}</label>}

      {loading ? (
        <div className="h-9 py-2 border rounded-md bg-muted text-muted-foreground">
          <Loading />
        </div>
      ) : (
        <Select 
          value={value} 
          onValueChange={handleChange}
          disabled={disabled} 
          position="popper"
        >
          <SelectTrigger id={id} 
            className="custom-select-box f-start w-full"
          >
            <SelectValue placeholder={placeholderLabel}>{selectedLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {options.length === 0 ? (
              <SelectItem value="__none__" disabled>{Localization.kr.NO_ITEM}</SelectItem>
            ) : (
              <>
                {[..._options].map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
});

export default LabelSelectOptions;

/*
import { useState, useRef, useMemo } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { Loading } from "../common/Loading";
import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
import Logger from "../../utils/Logger";
import "./LabelInput.css";
*/
/**
 * @name LabelSelectOptions
 * @description 레이블 선택란
 *
 * @prop {string} className
 * @prop {string} label
 * @prop {string} id
 * @prop {string} value
 * @prop {function} onChange
 * @prop {boolean} disabled
 * @prop {boolean} loading
 * @prop {Array} options
 *
 * @returns {JSX.Element} LabelSelectOptions
 */
/*
const LabelSelectOptions = ({
  className = "",
  label,
  id,
  value,
  onChange,
  disabled,
  loading,
  options = [],
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  const handleOptionClick = (optionValue) => {
    Logger.debug(`LabelSelectOptions > handleOptionClick ... optionValue: ${optionValue}`)
    if (disabled) return;
    onChange({ target: { value: optionValue } });
    setOpen(false);
  }
  useClickOutside(selectRef, (e) => setOpen(false))

  const boxStyle = !label ? { width: "100%" } : undefined; // label이 없으면 100% width style 지정 

  const selectedLabel = useMemo(() => {
    if (loading) return <Loading/>;
    if (options.length === 0) return Localization.kr.NO_ITEM;
    const selected = options?.find(opt => opt.value === value);
    return selected ? selected.label : Localization.kr.PLACEHOLDER_SELECT;

  }, [options, loading, value]);

  return (
    <div className={`input-select custom-select-wrapper ${className}`} ref={selectRef}>
      {label && <div className="select-label">{label}</div>}
      <div 
        className={`custom-select-box f-start ${disabled ? "disabled" : ""}`}
        style={boxStyle} 
        onClick={() => !disabled && setOpen(!open)}
      >
        <span>{selectedLabel}</span>
        <RVI16 iconDef={open ? rvi16ChevronUp() : rvi16ChevronDown()} />
      </div>
      {open && !loading && (
        <div 
          className="custom-options v-start"
          style={boxStyle}
        >
          {[...options].map((opt) => (
            <LabelSelectOption 
              opt={opt}
              value={value}
              handleOptionClick={handleOptionClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LabelSelectOption = ({
  opt, 
  value,
  handleOptionClick,
}) => (
  <div key={opt.value}
    className={`custom-option f-start w-full ${opt.value === value ? "selected" : ""}`}
    onClick={() => handleOptionClick(opt.value)}
  >
    {opt.label}
  </div>
)
*/

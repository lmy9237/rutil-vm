import { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import Loading from "../common/Loading";
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
const LabelSelectOptions = ({
  className = "",
  label,
  id,
  value,
  onChange,
  disabled,
  loading,
  options = [],
  placeholderLabel="선택하세요",
  placeholderValue="none", // SelectItem에 들어갈 내용이 null이거나 비어있으면 오류가 남
}) => {
  const selectedLabel = useMemo(() => {
    if (loading) return <Loading />;
    if (options.length === 0) return "항목 없음";
    const selected = options.find((opt) => opt.value === value);
    return selected ? selected.label : "선택하세요";
  }, [options, loading, value]);

  const handleChange = (val) => {
    onChange?.({ target: { value: val } });
  };

  const placeholderSelectItem = {
    label: placeholderLabel,
    value: placeholderValue,
  }

  return (
    <div className={`input-select custom-select-wrapper ${className}`}>
      {label && <div className="select-label">{label}</div>}

      {loading ? (
        <div className="h-10 px-3 py-2 border rounded-md bg-muted text-muted-foreground">
          <Loading />
        </div>
      ) : (
        <Select value={value} onValueChange={handleChange} disabled={disabled} position="popper">
          <SelectTrigger id={id} className="custom-select-box f-start">
            <SelectValue placeholder={placeholderLabel}>{selectedLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {options.length === 0 ? (
              <SelectItem value="__none__" disabled>
                항목 없음
              </SelectItem>
            ) : (
              [placeholderSelectItem, ...options].map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default LabelSelectOptions;

// import { useState, useRef, useMemo } from "react";
// import useClickOutside from "../../hooks/useClickOutside";
// import Loading from "../common/Loading";
// import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
// import Logger from "../../utils/Logger";
// import "./LabelInput.css";

// /**
//  * @name LabelSelectOptions
//  * @description 레이블 선택란
//  *
//  * @prop {string} className
//  * @prop {string} label
//  * @prop {string} id
//  * @prop {string} value
//  * @prop {function} onChange
//  * @prop {boolean} disabled
//  * @prop {boolean} loading
//  * @prop {Array} options
//  *
//  * @returns {JSX.Element} LabelSelectOptions
//  */
// const LabelSelectOptions = ({
//   className = "",
//   label,
//   id,
//   value,
//   onChange,
//   disabled,
//   loading,
//   options = [],
// }) => {
//   const [open, setOpen] = useState(false);
//   const selectRef = useRef(null);

//   const handleOptionClick = (optionValue) => {
//     Logger.debug(`LabelSelectOptions > handleOptionClick ... optionValue: ${optionValue}`)
//     if (disabled) return;
//     onChange({ target: { value: optionValue } });
//     setOpen(false);
//   }/* useCallback 불가능 - 매번 랜더링 필요 */
//   useClickOutside(selectRef, (e) => setOpen(false))

//   const boxStyle = !label ? { width: "100%" } : undefined; // label이 없으면 100% width style 지정 

//   const selectedLabel = useMemo(() => {
//     if (loading) return <Loading/>;
//     if (options.length === 0) return "항목 없음";
//     const selected = options?.find(opt => opt.value === value);
//     // return selected ? label : "선택하세요";
//     return selected ? selected.label : "선택하세요";

//   }, [options, loading, value]);

//   return (
//     <div className={`input-select custom-select-wrapper ${className}`} ref={selectRef}>
//       {label && <div className="select-label">{label}</div>}
//       {/* <div className={`custom-select-box v-start w-full ${disabled ? "disabled" : ""}`} */}
//       <div 
//         className={`custom-select-box f-start ${disabled ? "disabled" : ""}`}
//         style={boxStyle} 
//         onClick={() => !disabled && setOpen(!open)}
//       >
//         <span>{selectedLabel}</span>
//         <RVI16 iconDef={open ? rvi16ChevronUp() : rvi16ChevronDown()} />
//       </div>
//       {open && !loading && (
//         <div 
//           className="custom-options v-start"
//           style={boxStyle}
//         >
//           {[...options].map((opt) => (
//             <LabelSelectOption 
//               opt={opt}
//               value={value}
//               handleOptionClick={handleOptionClick}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const LabelSelectOption = ({
//   opt, 
//   value,
//   handleOptionClick,
// }) => (
//   <div key={opt.value}
//     className={`custom-option f-start w-full ${opt.value === value ? "selected" : ""}`}
//     onClick={() => handleOptionClick(opt.value)}
//   >
//     {opt.label}
//   </div>
// )

// export default LabelSelectOptions;

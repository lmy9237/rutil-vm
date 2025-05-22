import { useMemo } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Loading from "../common/Loading";
import "./LabelInput.css";

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
  placeholderLabel="선택하세요",
  placeholderValue="none", // SelectItem에 들어갈 내용이 null이거나 비어있으면 오류가 남
}) => {
  const selectedLabel = useMemo(() => {
    if (loading) return <Loading />;
    if (options.length === 0) return "항목 없음";

    const selected = options.find((opt) => opt.id === value);
    return selected ? `${selected.name}: ${selected.id} ${etcLabel}` : placeholderLabel;
  }, [loading, options, value, etcLabel]);

  const handleValueChange = (selectedId) => {
    const selectedOption = options.find((opt) => opt.id === selectedId);
    if (selectedOption) {
      onChange?.(selectedOption);
    }
  };

  const placeholderSelectItem = {
    label: placeholderLabel,
    value: placeholderValue,
  }

  return (
    <div className={`input-select custom-select-wrapper ${className}`}>
      {label && <label htmlFor={id} className="select-label">{label}</label>}

      {loading ? (
        <div className="h-10 py-2 border rounded-md bg-muted text-muted-foreground">
          <Loading />
        </div>
      ) : (
        <Select value={value} onValueChange={handleValueChange} disabled={disabled} position="popper">
          <SelectTrigger
            id={id}
            className="w-full h-10 px-0.5 py-2 border rounded-md text-left flex items-center justify-between"
          >
            <SelectValue placeholder={placeholderLabel}>{selectedLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {options.length === 0 ? (
              <SelectItem value="__none__" disabled>항목 없음</SelectItem>
            ) : (
              [placeholderSelectItem, ...options].map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}: {opt.id} {etcLabel}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default LabelSelectOptionsID;


// import { useState, useRef, useCallback, useMemo } from "react";
// import useClickOutside from "../../hooks/useClickOutside"; // ✅ import 추가
// import Loading from "../common/Loading";
// import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
// import Logger from "../../utils/Logger";
// import "./LabelInput.css";

// /**
//  * @name LabelSelectOptionsID
//  * @description 레이블 선택란 (ID)
//  *
//  * @prop {string} className
//  * @prop {string} label
//  * @prop {string} id
//  * @prop {string} value
//  * @prop {function} onChange
//  * @prop {boolean} disabled
//  * @prop {boolean} loading
//  * @prop {Array} options
//  * @prop {string} etcLabel
//  *
//  * @returns {JSX.Element} LabelSelectOptionsID
//  */

// const LabelSelectOptionsID = ({
//   className = "",
//   label,
//   id,
//   value,
//   onChange,
//   disabled,
//   loading,
//   options = [],
//   etcLabel = "",
// }) => {
//   const [open, setOpen] = useState(false);
//   const wrapperRef = useRef(null);        // ✅ 전체 감지
//   /*
//   const handleOptionClick = useCallback((optionValue) => {
//     Logger.debug(`LabelSelectOptionsID > handleOptionClick ... optionValue: ${optionValue}`)
//     if (disabled) return;
//     onChange({ target: { value: optionValue } });
//     setOpen(false);
//   }, [onChange, disabled]);
//   */

//   const handleOptionClick = useCallback((optionValue) => {
//     Logger.debug(`LabelSelectOptionsID > handleOptionClick ... optionValue:`, optionValue);
//     if (disabled) return;
  
//     const selectedOption = options.find(opt => opt.id === optionValue);
//     if (selectedOption) {
//       onChange(selectedOption); // ✅ 객체 자체를 넘김
//     }
  
//     setOpen(false);
//   }, [disabled, options, onChange]);
//   useClickOutside(wrapperRef, (e) => setOpen(false));

//   const boxStyle = !label ? { width: "100%" } : undefined;

//   const selectedLabel = useMemo(() => {
//     if (loading) return <Loading/>;
//     if (options.length === 0) return "항목 없음";
//     const selected = options.find((opt) => opt.id === value);
//     return selected
//       ? `${selected.name}: ${selected.id} ${etcLabel}`
//       : "선택하세요";
//   }, [options, loading, value]);

//   return (
//     <div
//       className={`input-select custom-select-wrapper ${className}`} 
//       ref={wrapperRef}
//     >
//       {label && <label htmlFor={id}>{label}</label>}
//         <div
//           className={`custom-select-box f-start ${disabled ? "disabled" : ""}`}
//           style={boxStyle}
//           onClick={() => !disabled && setOpen(!open)}
//         >
//           <span>{selectedLabel}</span>
//           <RVI16 iconDef={open ? rvi16ChevronUp() : rvi16ChevronDown()} />
//         </div>

//         {open && !loading && (
//           <div 
//             className="custom-options v-start" 
//             style={boxStyle}
//           >
//             {[...options].map((opt) => (
//               <LabelSelectOptionId
//                 opt={opt}
//                 value={value}
//                 etcLabel={etcLabel}
//                 handleOptionClick={handleOptionClick}
//               />
//             ))}
//           </div>
//         // */
//         /*
//         createPortal(
//           <div className="custom-options" style={boxStyle} >
//             {options.length === 0 ? (
//               <div className="custom-option f-center disabled">항목 없음</div>
//             ) : (
//               options.map((opt) => (
//                 <LabelSelectOptionId
//                   opt={opt}
//                   value={value}
//                   etcLabel={etcLabel}
//                   handleOptionClick={handleOptionClick}
//                 />
//               ))
//             )}
//         </div>, document.querySelector('.modal'))
//         */
//       )}
//     </div>
//   );
// };

// const LabelSelectOptionId = ({
//   opt, 
//   value,
//   etcLabel,
//   handleOptionClick,
// }) => (
//   <div key={opt.id}
//     className={`custom-option f-start w-full ${opt.id === value ? "selected" : ""}`}
//     onClick={() => handleOptionClick(opt.id)}
//   >
//     {opt.name}: {opt.id} {etcLabel}
//   </div>
// );

// export default LabelSelectOptionsID;


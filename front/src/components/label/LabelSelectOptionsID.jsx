import { forwardRef, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loading } from "@/components/common/Loading";
import Localization from "@/utils/Localization";
import "./LabelInput.css";

const LabelSelectOptionsID = forwardRef(({
  className = "",
  label,
  id,
  value,
  onChange,
  disabled,
  loading,
  options = [],
  etcLabel = "",
  placeholderLabel = Localization.kr.PLACEHOLDER_SELECT,
  placeholderValue = "none",
  required = true, // 추가 
}, ref) => {
  const OPTION_EMPTY = { id: placeholderValue, name: placeholderLabel };

  // required 조건에 따라 '선택하세요' 제거
  const _options = useMemo(() => {
    const sorted = [...options].sort((a, b) => a.name.localeCompare(b.name));
    return required ? sorted : [OPTION_EMPTY, ...sorted];
  }, [options, required]);

  // 선택된 label 렌더링
  const selectedLabel = useMemo(() => {
    if (loading) return <Loading />;
    // if (_options.length === 0) return Localization.kr.NO_ITEM;
    if (_options.length === 0 || options.length === 0) return "선택 가능한 항목이 없습니다.";

    const selected = _options.find((opt) => opt.id === value);
    if (!selected || selected.id === placeholderValue) return placeholderLabel;

    return import.meta.env.DEV
      ? `${selected.name}: ${selected.id} ${etcLabel}`
      : `${selected.name} ${etcLabel}`;
  }, [loading, _options, value, etcLabel, placeholderLabel, placeholderValue]);

  // 선택 변경 핸들러
  const handleValueChange = (selectedId) => {
    const selectedOption = _options.find((opt) => opt.id === selectedId);
    if (selectedId === placeholderValue) {
      onChange?.(OPTION_EMPTY); // 선택 안 함 처리
    } else if (selectedOption) {
      onChange?.(selectedOption);
    }
  };

  return (
    <div className={`input-select custom-select-wrapper f-start ${className}`}>
      {label && <label htmlFor={id} className="select-label">{label}</label>}

      {loading ? (
        <div className="h-10 py-2 border rounded-md bg-muted text-muted-foreground">
          <Loading />
        </div>
      ) : (
        <Select
          value={value}
          onValueChange={handleValueChange}
          //disabled={disabled || _options.length === 0} // 옵션 없을 때 아예 비활성화되는 조건
          disabled={disabled}
          position="popper"
        >
          <SelectTrigger
            id={id}
            className="custom-select-box f-start w-full text-left"
          >
            <SelectValue placeholder={placeholderLabel}>{selectedLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {_options.length === 0 ? (
              <SelectItem value="__none__" disabled>
                {Localization.kr.NO_ITEM}
              </SelectItem>
            ) : (
              _options.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}{import.meta.env.DEV &&`: ${opt.id}`} {etcLabel}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
});

export default LabelSelectOptionsID;

// import { forwardRef, useMemo, useState } from "react";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem
// } from "@/components/ui/select";
// import { Loading }                from "@/components/common/Loading";
// import Localization           from "@/utils/Localization";
// import Logger                 from "@/utils/Logger";
// import "./LabelInput.css";

// const LabelSelectOptionsID = forwardRef(({
//   className = "",
//   label,
//   id,
//   value,
//   onChange,
//   disabled,
//   loading,
//   options = [],
//   etcLabel = "",
//   placeholderLabel=Localization.kr.PLACEHOLDER_SELECT,
//   placeholderValue="none", // SelectItem에 들어갈 내용이 null이거나 비어있으면 오류가 남
// }, ref) => {

//   const OPTION_EMPTY = { id: placeholderValue, name: placeholderLabel }
  
//   // abc순
//   const _options = useMemo(() => {
//     const sorted = [...options].sort((a, b) => a.name.localeCompare(b.name));
//     return [OPTION_EMPTY, ...sorted];
//   }, [options]);

//   const selectedLabel = useMemo(() => {
//     if (loading) return <Loading />;
//     if (options.length === 0) return Localization.kr.NO_ITEM;

//     const selected = _options.find((opt) => opt.id === value);
//     return (selected === undefined || selected?.id === placeholderValue)
//       ? placeholderLabel
//       : import.meta.env.DEV
//         ? `${selected?.name}: ${selected?.id} ${etcLabel}`
//         : `${selected?.name}  ${etcLabel}` || ""
//   }, [loading, options, value, etcLabel]);

//   const handleValueChange = (selectedId) => {
//     const selectedOption = _options.find((opt) => opt.id === selectedId);
//     if (selectedId === placeholderValue) {
//       onChange?.(OPTION_EMPTY)
//     } else if (selectedOption) {
//       onChange?.(selectedOption);
//     }
//   };

//   return (
//     <div className={`input-select custom-select-wrapper f-start ${className}`}>
//       {label && <label htmlFor={id} className="select-label">{label}</label>}

//       {loading ? (
//         <div className="h-10 py-2 border rounded-md bg-muted text-muted-foreground">
//           <Loading />
//         </div>
//       ) : (
//         <Select
//           value={value} 
//           onValueChange={handleValueChange} 
//           disabled={disabled}
//           position="popper"
//         >
//           <SelectTrigger id={id}
//             className="custom-select-box f-start w-full text-left"
//           >
//             <SelectValue placeholder={placeholderLabel}>{selectedLabel}</SelectValue>
//           </SelectTrigger>
//           <SelectContent className="z-[9999]">
//             {options.length === 0 ? (
//               <SelectItem value="__none__" disabled>{Localization.kr.NO_ITEM}</SelectItem>
//             ) : (
//               <>
//                 {[..._options].map((opt) => (
//                   <SelectItem key={opt.id} value={opt.id}>
//                     {opt.name}: {opt.id} {etcLabel}
//                   </SelectItem>
//                 ))}
//               </>
//             )}
//           </SelectContent>
//         </Select>
//       )}
//     </div>
//   );
// });

// export default LabelSelectOptionsID;

// import React, { useState } from "react";
// import DynamicButton       from "@/components/label/DynamicButton";
// import LabelSelectOptions  from "@/components/label/LabelSelectOptions";  // ✅ 추가
// import "./DynamicInputList.css";

// /**
//  * @name DynamicInputList
//  * @description 반복 가능한 NIC select 리스트 컴포넌트
//  */
// const DynamicInputList = ({
//   values = [],
//   onChange = () => {},
//   onAdd = () => {},
//   onRemove = () => {},
//   options = [],
//   showLabel = true,
//   inputType = "select",
// }) => {
//   return (
//     <div className="dynamic-input-outer py-2">
//       {values.map((item, index) => (
//         <div key={index} className="dynamic-input f-start w-full">
//           {/* NIC 라벨 */}
//           {showLabel && (
//             <div className="nic-label">{`${item.name || ""}`}</div>
//           )}

//           <div className="dynamic-select-outer f-end w-full">
//             {/* 선택 입력 부분 */}
//             {inputType === "select" ? (
//               <LabelSelectOptions id={`dynamic-select-${index}`}
//                 value={item.vnicProfileVo?.id || ""}
//                 onChange={(e) => onChange(index, e.target.value)}
//                 options={options.map(opt => ({
//                   value: opt.id,
//                   label: `${opt.name} [네트워크: ${opt.networkVo?.name || ""}]`
//                 }))}
//               />
//             ) : (
//             <input type="text"
//               className="dynamic-text-input"
//               value={item.value || ""}
//               onChange={(e) => onChange(index, e.target.value)}
//             />
//             )}
//             <div className="dynamic-btns f-end">
//               {index === values.length - 1 && (
//                 <DynamicButton type="add" onClick={onAdd} />
//               )}
//               {values.length > 1 && (
//                 <DynamicButton type="remove" onClick={() => onRemove(index)} />
//               )}
//             </div>
//           </div>
//           {/* 추가/삭제 버튼 */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DynamicInputList;
import React from "react";
import DynamicButton from "@/components/label/DynamicButton";
import LabelSelectOptions from "@/components/label/LabelSelectOptions";
import "./DynamicInputList.css";

/**
 * @name DynamicInputList
 * @description 반복 가능한 NIC select 리스트 컴포넌트
 */
const DynamicInputList = ({
  values = [],
  onChange = () => {},
  onAdd = () => {},
  onRemove = () => {},
  options = [],
  showLabel = true,
  inputType = "select",
}) => {
  return (
    <div className="dynamic-input-outer py-2">
      {values.map((item, index) => {
        const isLastItem = index === values.length - 1;
        const isProfileSelected = !!item.vnicProfileVo?.id;

        return (
          <div key={index} className="dynamic-input f-start w-full">
            {showLabel && (
              <div className="nic-label">{`${item.name || ""}`}</div>
            )}

            <div className="dynamic-select-outer f-end w-full">
              {inputType === "select" ? (
                <LabelSelectOptions
                  id={`dynamic-select-${index}`}
                  value={item.vnicProfileVo?.id || ""}
                  onChange={(e) => onChange(index, e.target.value)}
                  options={options.map(opt => ({
                    value: opt.id,
                    label: `${opt.name} [네트워크: ${opt.networkVo?.name || ""}]`
                  }))}
                />
              ) : (
                <input
                  type="text"
                  className="dynamic-text-input"
                  value={item.value || ""}
                  onChange={(e) => onChange(index, e.target.value)}
                />
              )}

              <div className="dynamic-btns f-end">
                {isLastItem && (
                  <DynamicButton
                    type="add"
                    onClick={onAdd}
                    disabled={inputType === "select" && !isProfileSelected}
                  />
                )}
                {values.length > 1 && (
                  <DynamicButton
                    type="remove"
                    onClick={() => onRemove(index)}
                    disabled={inputType === "select" && !isProfileSelected}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicInputList;

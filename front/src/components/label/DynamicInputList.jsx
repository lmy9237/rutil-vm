import React, { useState } from "react";
import "./DynamicInputList.css";
import { RVI36, rvi36Add, rvi36AddHover, rvi36Remove, rvi36Trash } from "../icons/RutilVmIcons";

const DynamicInputList = ({
  maxCount = 3,
  placeholder = "",
  inputType = "text",
  options = [],
  disabled = false, // 🔥 DNS 설정이 비활성화되면 모든 기능을 막기 위한 속성 추가
  getLabel = null, //추가: 각 항목 라벨 커스터마이징용
}) => {
  const [inputs, setInputs] = useState([""]);

  const handleAdd = () => {
    if (!disabled && inputs.length < maxCount) {
      setInputs([...inputs, ""]);
    }
  };

  const handleRemove = (index) => {
    if (!disabled) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, value) => {
    if (!disabled) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);
    }
  };

  return (
    <div className="dynamic-input-outer py-2">
      {inputs.map((input, index) => (
        <div key={index} className="dynamic-input f-btw mb-1.5">

          {getLabel && <div className="nic-label mr-2">{getLabel(index)}</div>} {/*nic만 붙음*/}

          {inputType === "select" ? (
            <select
              value={input}
              onChange={(e) => handleChange(index, e.target.value)}
              disabled={disabled} // DNS 설정이 비활성화되면 선택 불가능
            >
              <option value="">항목을 선택하세요...</option>
              {options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={inputType}
              value={input}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder}
              disabled={disabled} // DNS 설정이 비활성화되면 입력 불가능
            />
          )}

          {/* 버튼 렌더링 */}
          <div className="dynamic-btns f-end">
            {index === inputs.length - 1 && inputs.length < maxCount && (
              <RVI36 iconDef={rvi36Add(false)} 
                className="btn-icon"
                currentColor="transparent" 
                onClick={handleAdd}
                disabled={disabled}
              />
            )}
            {inputs.length > 1 && (
              <RVI36 iconDef={rvi36Remove}
                className="btn-icon"
                currentColor="transparent"
                onClick={() => handleRemove(index)}
                disabled={disabled} 
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicInputList;

/* +, - 버튼 누르면 밑으로 요소가 하나 더생기는것 */
import React, { useState } from "react";

const DynamicInputList = ({
  maxCount = 3,
  placeholder = "",
  inputType = "text",
  options = [],
  disabled = false, // 🔥 DNS 설정이 비활성화되면 모든 기능을 막기 위한 속성 추가
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
    <div className="dynamic-Input-outer p-2 ">
      {inputs.map((input, index) => ( 
        <div key={index} className="dynamic-Input f-btw mb-1.5">
          {inputType === "select" ? (
            <select
              value={input}
              onChange={(e) => handleChange(index, e.target.value)}
              disabled={disabled} // 🔥 DNS 설정이 비활성화되면 선택 불가능
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
              disabled={disabled} // 🔥 DNS 설정이 비활성화되면 입력 불가능
            
            />
          )}
          {index === inputs.length - 1 ? (
            <div className="dynamic-btns flex">
              {inputs.length < maxCount && (
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={disabled} // 🔥 DNS 설정이 비활성화되면 버튼도 비활성화
         
                >
                  +
                </button>
              )}
              {inputs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled} // 🔥 DNS 설정이 비활성화되면 버튼도 비활성화
          
                >
                  -
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled} // 🔥 DNS 설정이 비활성화되면 버튼도 비활성화
     
            >
              -
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicInputList;


// ✅ 수정된 DynamicInputList
import React from "react";
import "./DynamicInputList.css";
import { RVI36, rvi36Add, rvi36Remove } from "../icons/RutilVmIcons";

const DynamicInputList = ({
  values = [],
  maxCount = 3,
  placeholder = "",
  inputType = "text",
  options = [],
  disabled = false,
  getLabel = null,
  onChange = () => {},
  onAdd = () => {},
  onRemove = () => {},
}) => {
  return (
    <div className="dynamic-input-outer py-2">
      {values.map((input, index) => (
        <div key={index} className="dynamic-input f-btw mb-1.5">
          {getLabel && <div className="nic-label mr-2">{getLabel(index)}</div>}

          {inputType === "select" ? (
            <select
              value={input}
              onChange={(e) => onChange(index, e.target.value)}
              disabled={disabled}
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
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
            />
          )}

          <div className="dynamic-btns f-end">
            {index === values.length - 1 && values.length < maxCount && (
              <RVI36
                iconDef={rvi36Add(false)}
                className="btn-icon"
                currentColor="transparent"
                onClick={onAdd}
                disabled={disabled}
              />
            )}
            {values.length > 1 && (
              <RVI36
                iconDef={rvi36Remove()}
                className="btn-icon"
                currentColor="transparent"
                onClick={() => onRemove(index)}
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

import React from "react";
import DynamicButton from "../label/DynamicButton";

/**
 * @name DynamicInputList
 * @description 반복 가능한 NIC select 리스트 컴포넌트
 *
 * @prop {Array} values - 항목 배열
 * @prop {Function} onChange - 항목 변경 시 호출되는 콜백
 * @prop {Function} onAdd - 항목 추가 시 호출되는 콜백
 * @prop {Function} onRemove - 항목 제거 시 호출되는 콜백
 * @prop {Array} options - select 박스에 표시될 옵션 리스트
 * @prop {boolean} showLabel - NIC 이름 라벨 표시 여부
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
      {values.map((item, index) => (
        <div key={index} className="dynamic-input f-btw mb-1.5">
          {showLabel && (
            <div className="nic-label mr-2">{`${item.name}`}</div>
          )}
          {inputType === "select" ? (
            <select
              value={item.vnicProfileVo?.id || ""}
              onChange={(e) => onChange(index, e.target.value)}
            >
              <option value="">항목을 선택하세요...</option>
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name} [네트워크: {opt.networkVo?.name || ""}]
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={item.value || ""}
              onChange={(e) => onChange(index, e.target.value)}
            />
          )}


          <div className="dynamic-btns f-end">
            {index === values.length - 1 && (
              <DynamicButton type="add" onClick={onAdd} />
            )}
            {values.length > 1 && (
              <DynamicButton type="remove" onClick={() => onRemove(index)} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicInputList;

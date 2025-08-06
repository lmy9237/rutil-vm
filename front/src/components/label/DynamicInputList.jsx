import React from "react";
import DynamicButton                    from "@/components/label/DynamicButton";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import Localization                     from "@/utils/Localization";
import "./DynamicInputList.css";
import { nicLinked2Icon, nicPlugged2Icon } from "../icons/RutilVmIcons";

/**
 * @name DynamicInputList
 * @description 반복 가능한 NIC select 리스트 컴포넌트
 */
const DynamicInputList = ({
  type="nic",
  values=[],
  onChange=()=>{}, onAdd=()=>{}, onRemove=()=>{},
  options = [],
  showLabel = true,
  inputType = "select",
}) => {
  return (
    <div className="dynamic-input-outer py-2">
      {values.map((item, index) => {
        const isLastItem = index === values.length - 1;
        const isProfileSelected = !!item.vnicProfileVo?.id;
        const showNicIcon = type === "nic" && !!item?.id
        const nicIcon = showNicIcon ? (<>
          {nicLinked2Icon(item?.linked)}
          {nicPlugged2Icon(item?.plugged)}
        </>) : null;
        
        return (
          <div key={index} className="dynamic-input f-start w-full">            
            {showLabel && (
              // <div className="nic-label">{`${item.name || ""}`}</div>
              <div className="nic-label f-start gap-2">
                {nicIcon}
                {item?.name || `nic${index+1}`}
              </div>
            )}

            <div className="dynamic-select-outer f-end w-full">
              {inputType === "select" ? (
                <LabelSelectOptions id={`dynamic-select-${index}`}
                  value={item.vnicProfileVo?.id || ""}
                  onChange={(e) => onChange(index, e.target.value)}
                  disabled={showNicIcon}
                  options={options.map(opt => ({
                    value: opt.id,
                    label: `${opt.name} [${Localization.kr.NETWORK}: ${opt.networkVo?.name || ""}]`
                  }))}
                />
              ) : (
                <input type="text"
                  className="dynamic-text-input"
                  value={item.value || ""}
                  onChange={(e) => onChange(index, e.target.value)}
                />
              )}

              <div className="dynamic-btns f-end">
                {isLastItem && !showNicIcon && (
                  <DynamicButton type="add"
                    onClick={onAdd}
                    disabled={inputType === "select" && !isProfileSelected}
                  />
                )}
                {values.length > 1 && !showNicIcon && (
                  <DynamicButton type="remove"
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

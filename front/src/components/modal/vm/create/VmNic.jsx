import React from "react";
import Localization from "../../../../utils/Localization";
import { RVI36, rvi36Add, rvi36Remove } from "../../../icons/RutilVmIcons";
import Logger from "../../../../utils/Logger";

const VmNic = ({
  nics,
  nicsState,
  setNicsState,
}) => {
  const nicValues = nicsState.map((nic) => ({
    id: nic?.id,
    name: nic?.name,
    vnicProfileVo: { id: nic?.vnicProfileVo?.id, name: nic?.vnicProfileVo?.name }
  }));

  Logger.debug(`VmNic.nicsState: ${JSON.stringify(nicsState, null, 2)}`);

  const handleChange = (index, value) => {
    const updated = [...nicsState];
    updated[index].vnicProfileVo.id = value;
    setNicsState(updated);
  };

  const handleAdd = () => {
    const newNic = {
      id: "",
      name: `nic${nicsState.length + 1}`,
      vnicProfileVo: { id: "", },
    };
    setNicsState([...nicsState, newNic]);
  };

  const handleRemove = (index) => {
    const updated = [...nicsState];
    updated.splice(index, 1);
    setNicsState(updated);
  };

  return (
    <div className="host-second-content py-2">
      <p className="mb-0.5">{Localization.kr.VNIC_PROFILE} 을 선택하여 {Localization.kr.VM} {Localization.kr.NICS}를 설정하세요.</p>
      <div className="dynamic-input-outer py-2">
       
        {nicsState.length === 0 ?
          (nicsState.map((nic, index) => (
          <div key={index} className="dynamic-input f-btw mb-1.5">
            <div className="nic-label mr-2">{nic.name || `nic${index + 1}`}</div>

            <select
              value={nic.vnicProfileVo.id || ""}
              onChange={(e) => handleChange(index, e.target.value)}
            >
              <option value="">항목을 선택하세요...</option>
              {nics.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} [네트워크: {option.networkVo?.name || ""}]
                </option>
              ))}
            </select>
            

            <div className="dynamic-btns f-end">
              {index === nicValues.length - 1  && (
                <RVI36
                  iconDef={rvi36Add(false)}
                  className="btn-icon"
                  currentColor="transparent"
                  onClick={handleAdd}
                  // disabled={disabled}
                />
              )}
              {nicValues.length > 1 && (
                <RVI36
                  iconDef={rvi36Remove()}
                  className="btn-icon"
                  currentColor="transparent"
                  onClick={() => handleRemove(index)}
                  // disabled={disabled}
                />
              )}
            </div>
          </div>
        ))): (
          (nicsState.map((nic, index) => (
            <div key={index} className="dynamic-input f-btw mb-1.5">
              <div className="nic-label mr-2">{nic.name}</div>
  
              <select
                value={nic.vnicProfileVo.id || ""}
                onChange={(e) => handleChange(index, e.target.value)}
              >
                <option value="">항목을 선택하세요...</option>
                {nics.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} [네트워크: {option.networkVo?.name || ""}]
                  </option>
                ))}
              </select>
              
  
              <div className="dynamic-btns f-end">
                {index === nicValues.length - 1  && (
                  <RVI36
                    iconDef={rvi36Add(false)}
                    className="btn-icon"
                    currentColor="transparent"
                    onClick={handleAdd}
                    // disabled={disabled}
                  />
                )}
                {nicValues.length > 1 && (
                  <RVI36
                    iconDef={rvi36Remove()}
                    className="btn-icon"
                    currentColor="transparent"
                    onClick={() => handleRemove(index)}
                    // disabled={disabled}
                  />
                )}
              </div>
            </div>
          ))))}
        
        
      </div>
      {/* <DynamicInputList
        values={nicsState}
        maxCount={10}
        inputType="select"
        options={nics.map((opt) => opt.name)}
        getLabel={(index) => `nic${index + 1}`}
        onChange={handleChange}
        onAdd={handleAdd}
        onRemove={handleRemove}
      /> */}
    </div>
  );
};

export default VmNic;
import React from "react";
import DynamicInputList from "../../../label/DynamicInputList";
import Localization from "../../../../utils/Localization";

const VmNic = ({
  nicsState,
  setNicsState,
  nics
}) => {
  // vnicProfileVo.id 배열 만들기
  const nicValues = nicsState.map(nic => nic.vnicProfileVo?.id || "");

  const handleChange = (index, value) => {
    const updated = [...nicsState];
    updated[index].vnicProfileVo.id = value;
    setNicsState(updated);
  };

  const handleAdd = () => {
    const newNic = {
      id: "",
      name: `nic${nicsState.length + 1}`,
      vnicProfileVo: { id: "" },
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
      <p className="mb-0.5">
        {Localization.kr.VNIC_PROFILE} 을 선택하여 {Localization.kr.VM} {Localization.kr.NICS}를 설정하세요.
      </p>

      <DynamicInputList
        values={nicValues}
        maxCount={10}
        inputType="select"
        options={nics.map((opt) => opt.name)}
        getLabel={(index) => `nic${index + 1}`}
        onChange={handleChange}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default VmNic;

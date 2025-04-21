import React, { useEffect } from "react";
import Localization from "../../../../utils/Localization";
import Logger from "../../../../utils/Logger";
import "../../../label/DynamicInputList.jsx";
import DynamicInputList from "../../../label/DynamicInputList.jsx";

const VmNic = ({
  nics,
  nicsState,
  setNicsState,
}) => {
  const nicValues = nicsState.map((nic) => ({
    ...nic,
    vnicProfileVo: { id: nic?.vnicProfileVo?.id, name: nic?.vnicProfileVo?.name }
  }));

  Logger.debug(`VmNic.nicsState: `, nicsState);

  const handleChange = (index, value) => {
    const updated = nicsState.map((nic, i) =>
      i === index
        ? {
            ...nic,
            vnicProfileVo: {
              ...nic.vnicProfileVo,
              id: value,
            },
          }
        : nic
    );
    setNicsState(updated);
  };

  const handleAdd = () => {
    const newNic = {
      id: "",
      name: `NIC${nicsState.length + 1}`,
      vnicProfileVo: { id: "", },
    };
    setNicsState([...nicsState, newNic]);
  };

  const handleRemove = (indexToRemove) => {
    const newValues = nicsState.filter((_, idx) => idx !== indexToRemove);
  
    // NIC 이름 다시 재정렬
    const updatedValues = newValues.map((item, idx) => ({
      ...item,
      name: `NIC${idx + 1}`, // 소문자 nic+숫자
    }));
  
    setNicsState(updatedValues);
  };
  

  useEffect(() => {
    if (nicsState.length === 0) {
      setNicsState([{
        id: "",
        name: "NIC1",
        vnicProfileVo: { id: "" }
      }]);
    }
  }, [nicsState, setNicsState]);

  return (
    <div className="host-second-content py-2">
      <p className="mb-0.5">
        {Localization.kr.VNIC_PROFILE} 을 선택하여 {Localization.kr.VM} {Localization.kr.NICS}를 설정하세요.
      </p>
  
      <DynamicInputList
        values={nicsState}
        onChange={handleChange}
        onAdd={handleAdd}
        onRemove={handleRemove}
        options={nics}
        showLabel={true}
      />

    </div>
  );
  
};

export default VmNic;
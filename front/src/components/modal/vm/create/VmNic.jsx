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

  useEffect(() => {
    if (nicsState.length === 0) {
      setNicsState([{
        id: "",
        name: "nic1",
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
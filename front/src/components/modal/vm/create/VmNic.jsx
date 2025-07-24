import React, { useEffect } from "react";
import Localization from "../../../../utils/Localization";
import Logger from "../../../../utils/Logger";
import "../../../label/DynamicInputList.jsx";
import DynamicInputList from "../../../label/DynamicInputList.jsx";
import { emptyIdNameVo } from "@/util";
import { useValidationToast } from "@/hooks/useSimpleToast";

const VmNic = ({
  nics,
  nicsState,
  setNicsState,
}) => {
  const { validationToast } = useValidationToast()
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
    import.meta.env.DEV && validationToast.debug(`field: nicsState, value: ${JSON.stringify(nicsState, 2, 0)}`, )
    setNicsState(updated);
  };

  const handleAdd = () => {
    const lastIndex = Math.max(
      0,
      ...nicsState
        .map(nic => parseInt(nic.name?.replace("nic", ""), 10))
        .filter(n => !isNaN(n))
    );
    const nextName = `nic${lastIndex + 1}`;

    const newNic = {
      id: "",
      name: nextName,
      vnicProfileVo: emptyIdNameVo(),
    };
    setNicsState([...nicsState, newNic]);
  };

  const handleRemove = (indexToRemove) => {
    const newValues = nicsState.filter((_, idx) => idx !== indexToRemove);
  
    // NIC 이름 다시 재정렬
    const updatedValues = newValues.map((item) => ({
      ...item,
    }));
  
    setNicsState(updatedValues);
  };
  

  useEffect(() => {
    if (nicsState.length === 0) {
      setNicsState([{
        id: "",
        name: "nic1",
        vnicProfileVo: emptyIdNameVo()
      }]);
    }
  }, [nicsState, setNicsState]);

  return (
    <>
    <hr/>
    <div className="host-second-content py-3">
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
    </>
  );
  
};

export default VmNic;
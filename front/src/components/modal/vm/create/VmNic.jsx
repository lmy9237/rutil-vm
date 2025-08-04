import React, { useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import DynamicInputList                 from "../../../label/DynamicInputList.jsx";
import { emptyIdNameVo }                from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const VmNic = ({
  editMode,
  nics,
  nicsState,
  setNicsState,
}) => {
  const { validationToast } = useValidationToast()
  const { vmsSelected } = useGlobal();

  const nicValues = nicsState.map((nic) => ({
    ...nic,
    vnicProfileVo: { id: nic?.vnicProfileVo?.id, name: nic?.vnicProfileVo?.name }
  }));

  Logger.debug(`VmNic.nicsState: `, nicsState);
  const handleChange = (index, value) => {
    Logger.debug(`VmNic > handleChange ... index: ${index}, value: ${value}`);
    const updated = nicsState.map((nic, i) =>
      i === index
        ? {
          ...nic,
          vnicProfileVo: {
            ...nic.vnicProfileVo,
            id: value,
          },
        } : nic
    );
    import.meta.env.DEV && validationToast.debug(`field: nicsState, value: ${JSON.stringify(nicsState, 2, 0)}`, )
    setNicsState(updated);
  };

  const handleAdd = () => {
    Logger.debug(`VmNic > handleAdd ... `);
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
    Logger.debug(`VmNic > handleRemove ... indexToRemove: ${indexToRemove}`);
    const newValues = nicsState.filter((_, idx) => idx !== indexToRemove);
    // NIC 이름 다시 재정렬
    const updatedValues = newValues.map((item) => ({
      ...item,
    }));
  
    setNicsState(updatedValues);
  };
  
  useEffect(() => {
    Logger.debug(`VmNic > useEffect ... `);
    if (nicsState.length === 0) {
      setNicsState([{
        id: "",
        name: "nic1",
        vnicProfileVo: emptyIdNameVo()
      }]);
    }

    if (editMode) {
      Logger.debug(`VmNic > useEffect ... 2 `);

    }
  }, [editMode, nicsState, setNicsState]);

  const isVmUp = useMemo(() => (
    [...vmsSelected].length > 0 && vmsSelected[0]?.status?.toLowerCase() == "up"
  ), [editMode, vmsSelected])

  return (
    <>
    <hr/>
    <div className="host-second-content py-3">
      <p className="mb-0.5">
        {Localization.kr.VNIC_PROFILE} 을 선택하여 {Localization.kr.VM} {Localization.kr.NICS}를 설정하세요.
        {editMode && isVmUp && <><br/><br/><b>주의:</b> 가상머신이 실행 중인 경우, {Localization.kr.NICS}를 편집/제거 할 수 없습니다. <br/>종료 후 작업하시기 바랍니다.</>} 
      </p>
      <DynamicInputList values={nicsState}
        onChange={handleChange} onAdd={handleAdd} onRemove={handleRemove}
        options={nics}
        showLabel={true}
      />
    </div>
    </>
  );
  
};

export default VmNic;
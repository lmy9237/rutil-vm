import React, { useEffect, useMemo } from "react";
import { AlertTriangle } from "lucide-react"
import CONSTANT                         from "@/Constants";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Separator }                    from "@/components/ui/separator"
import DynamicInputList                 from "@/components/label/DynamicInputList";
import { emptyIdNameVo }                from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const VmNic = ({
  editMode,
  nics,
  nicsState, setNicsState,
}) => {
  const { validationToast } = useValidationToast()
  const { vmsSelected } = useGlobal();
  const nicValues = nicsState.map((nic) => ({
    ...nic,
    vnicProfileVo: { 
      id: nic?.vnicProfileVo?.id || "", 
      name: nic?.vnicProfileVo?.name || "",
    }
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
    validationToast.debug(`field: nicsState, value: \n${JSON.stringify(nicsState, 2, 0)}`)
    setNicsState(updated);
  };

  const handleAdd = () => {
    Logger.debug(`VmNic > handleAdd ... `);
    const lastIndex = Math.max(
      0,
      ...nicsState.map((nic) => 
        parseInt(nic.name?.replace("nic", ""), 10)
      ).filter((n) => 
        !isNaN(n)
      )
    );
    const nextName = `nic${lastIndex+1}`;
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
    [...vmsSelected].length > 0 && vmsSelected[0]?.status?.toLowerCase() == "up".toLowerCase()
  ), [editMode, vmsSelected]);

  const isVmDown = useMemo(() => (
    [...vmsSelected].length > 0 && vmsSelected[0]?.status?.toLowerCase() == "down".toLowerCase()
  ), [editMode, vmsSelected])

  const isVmImageLocked = useMemo(() => (
    [...vmsSelected].length > 0 && vmsSelected[0]?.status?.toLowerCase() == "image_locked".toLowerCase()
  ), [editMode, vmsSelected])

  return (
    <>
    <Separator />
    <div className="host-second-content py-3">
      <p className="mb-0.5">
        {Localization.kr.VNIC_PROFILE} 을 선택하여 {Localization.kr.VM} {Localization.kr.NICS}를 설정하세요.
        <VmNicWarning active={editMode && !(isVmDown || isVmImageLocked)}/> 
      </p>
      <DynamicInputList type="nic"
        values={nicsState}
        onChange={handleChange} onAdd={handleAdd} onRemove={handleRemove}
        options={nics}
        showLabel={true}
      />
    </div>
    </>
  );
};

const VmNicWarning = ({
  active,
}) => (
  active && <><br/><br/>
    <div className="f-start">
   
    <Alert variant="warning" className="items-start gap-4 flex">
      <div className="mr-3 "><AlertTriangle color={CONSTANT.color.warn}/>
      <AlertTitle><b className="f-center mt-1">주의</b></AlertTitle> 
      </div>
      <AlertDescription>
        {Localization.kr.VM}이 {Localization.kr.RUNNING} ({Localization.kr.PAUSE} 포함)인 경우, 연결 된 {Localization.kr.NICS}를 편집/제거 할 수 없습니다.
        {/* 
        2025-08-06: 문구가 너무 길어져 VmModal에 스크롤 바가 생겨 생략
        <br/>이 화면에서는 각 {Localization.kr.NICS}의 연결 상태를 확인 할 수 없습니다. 
        <br/>안전하게 처리하기 위해서 {Localization.kr.VM}을 종료 후 작업하시기 바랍니다.
        */}
      </AlertDescription>
    </Alert>
    </div>
    {/* 
    <p className="f-start">
      <AlertTriangle color={CONSTANT.color.orange}/><b>주의</b>
    </p>
    <p>
      {Localization.kr.VM}이 {Localization.kr.RUNNING}인 경우, 연결 된 {Localization.kr.NICS}를 편집/제거 할 수 없습니다. 
      <br/>이 화면에서는 각 {Localization.kr.NICS}의 연결 상태를 확인 할 수 없습니다. 
      <br/>안전하게 처리하기 위해서 {Localization.kr.VM}을 종료 후 작업하시기 바랍니다.
    </p>
    */}
  </>
)

export default VmNic;
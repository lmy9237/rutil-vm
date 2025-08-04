import React, { useEffect, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelInput                       from "@/components/label/LabelInput";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import { handleInputChange }            from "@/components/label/HandleInput";
import { checkName }                    from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const HostBondingModal = ({ 
  editMode = false, 
  isOpen, onClose,
  bondModalState, setBondModalState,
  onBondingCreated,
  existingBondNames = []
}) => {
  const { validationToast } = useValidationToast();
  const bLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const origBondingVo = bondModalState.editTarget?.bondingVo;

  const [modeOrigin, setModeOrigin] = useState(null);

  // 본딩 이름 중복 체크 함수
  const isBondNameDuplicated = (name) => {
    if (editMode && bondModalState.editTarget?.name === name) return false;
    return existingBondNames.includes(name);
  };

  // option list 텍스트로 출력
  const defineUserMode = (origBondingVo?.optionVos || [])
    .map(opt => `${opt.name}=${opt.value}`)
    .join(" ");

  // 본딩모드 선택옵션을 지정하기 위해 필요한 값
  const getModeValueFromOptions = (options = []) => {
    return options.find(opt => opt.name === "mode")?.value?.toString() || "";
  };

  // option 객체화을 위한 코드
  const parseUserMode = (str = "") => {
    return str
      .split(" ")
      .map(s => s.trim())
      .filter(s => s.includes("="))
      .map(s => {
        const [name, value] = s.split("=");
        return { name, value };
      });
  };

  const filteredOptionList = editMode
    ? optionList.filter(opt => ["1", "2", "3", "4"].includes(opt.value))
    : optionList;

  useEffect(() => {
    if (isOpen && editMode) {
      const currentUserMode = (bondModalState.editTarget?.bondingVo?.optionVos || [])
        .map(opt => `${opt.name}=${opt.value}`)
        .join(" ");

      setModeOrigin(getModeValueFromOptions(bondModalState.optionVos));
      setBondModalState(prev => ({
        ...prev,
        userMode: currentUserMode,
        id: prev.id ?? bondModalState.editTarget?.id, // 누락 방지
      }));
    }
  }, [isOpen, editMode]);


  const validateForm = () => {
    const nameError = checkName(bondModalState.name);
    if (nameError) return nameError;
    if (!editMode && isBondNameDuplicated(bondModalState.name)) return "이미 존재하는 본딩 이름입니다.";

    return null;
  };

  const handleOkClick = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    const currentMode = getModeValueFromOptions(bondModalState.optionVos);

    if (editMode) {
      const updatedBond = {
        ...bondModalState.editTarget,
        bondingVo: {
          ...bondModalState.editTarget.bondingVo,
          optionVos:
            currentMode === modeOrigin
              ? parseUserMode(bondModalState.userMode)
              : [{ name: "mode", value: currentMode }],
        }
      };

      onBondingCreated(updatedBond, [bondModalState.editTarget]);
    }
    else {
      const nicArr = Array.isArray(bondModalState.editTarget) ? bondModalState.editTarget : [];
      Logger.debug(`HostBondingModal > handleOkClick ... nicArr: `, nicArr)

      const newBond = {
        name: bondModalState.name,
        bondingVo: {
          optionVos: [{ name: "mode", value: currentMode }],
          slaveVos: nicArr.map(nic => ({ name: nic.name })),
        }
      };

      onBondingCreated(newBond, nicArr);
    }
    Logger.debug("HostBondingModal > nic ", bondModalState.id)
    Logger.debug("HostBondingModal > slaveVos ", bondModalState.editTarget)
    onClose();
  };


  return (
    <BaseModal targetName={`본딩 ${editMode ? bondModalState?.name : ""} ${bLabel}`} submitTitle={""}
      isOpen={isOpen} onClose={onClose}
      isReady={
        bondModalState &&
        typeof bondModalState.name === "string"
      }
      onSubmit={handleOkClick}
      contentStyle={{ width: "500px" }}
    >
      <LabelInput id="bonding_name" label={Localization.kr.NAME}        
        value={bondModalState.name}
        onChange={handleInputChange(setBondModalState, "name", validationToast)}
        disabled={editMode}
      />
      {import.meta.env.DEV && 
        <>
        <pre>id: {bondModalState.id}</pre>
        <pre>getModeValueFromOptions(bondModalState.optionVos) {getModeValueFromOptions(bondModalState.optionVos)}</pre>
        <pre>modeOrigin: {modeOrigin}</pre>
        <pre>defineUserMode: {defineUserMode}</pre>
        <pre>userMode: {bondModalState.userMode}</pre>
        <pre>iued: {bondModalState.editTarget?.id}</pre>
        </>
      } 
      <LabelSelectOptions id="bonding_mode" label="본딩모드"
        value={getModeValueFromOptions(bondModalState.optionVos)}
        options={filteredOptionList}
        onChange={(e) => {
          const val = e.target.value;
          const updatedOptionVos = [{ name: "mode", value: val }];
          setBondModalState(prev => ({
            ...prev,
            optionVos: updatedOptionVos,
          }));
        }}
      />
      <LabelInput id="user_mode" label="사용자 정의 모드"
        value={bondModalState.userMode}
        disabled={!editMode || (getModeValueFromOptions(bondModalState.optionVos) !== modeOrigin)}
        onChange={handleInputChange(setBondModalState, "userMode", validationToast)}
      />
      <br/>
    </BaseModal>
  );
};

export default HostBondingModal;

const optionList = [
  { value: "0", label: "(Mode 0) Round-robin" },
  { value: "1", label: "(Mode 1) Active-Backup" },
  { value: "2", label: "(Mode 2) Load balance (balance-xor)" },
  { value: "3", label: "(Mode 3) Broadcast" },
  { value: "4", label: "(Mode 4) Dynamic link aggregation (802.3ad)" },
  { value: "5", label: "(Mode 5) Adaptive transmit load balancing (balance-tlb)" },
  { value: "6", label: "(Mode 6) Adaptive load balancing (balance-alb)" },
];
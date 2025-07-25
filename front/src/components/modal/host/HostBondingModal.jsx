import React from "react";
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
  const bLabel = editMode 
    ? Localization.kr.UPDATE
    : Localization.kr.CREATE;
  
  // 본딩 이름 중복 체크 함수
  const isBondNameDuplicated = (name) => {
    // 수정모드일 경우 본인 이름은 허용해야 함
    if (editMode && bondModalState.editTarget?.name === name) return false;
    // 중복이면 true 반환
    return existingBondNames.includes(name);
  };

  const originalMode = bondModalState.editTarget?.bondingVo?.optionVos?.find(opt => opt.name === "mode")?.value;

  // 사용자 정의 조건: mode 외에 miimon을 제외한 항목이 존재해야 함
  const hasCustomOptions = (bondModalState.editTarget?.bondingVo?.optionVos?.some(opt =>
    opt.name !== "mode" && opt.name !== "miimon"
  )) || false;

  const isUserModeDisabled =
    !editMode ||
    (bondModalState.optionMode !== "7" && (
      bondModalState.optionMode !== originalMode || !hasCustomOptions
    ));



  const validateForm = () => {
    Logger.debug(`HostBondingModal > validateForm ... `)
    const nameError = checkName(bondModalState.name);
    if (nameError) return nameError;

    // 본딩 이름 중복 검사 추가!
    if (!editMode && isBondNameDuplicated(bondModalState.name)) {
      return "이미 존재하는 본딩 이름입니다.";
    }

    return null;
  };

  const handleOkClick = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
  
    Logger.debug(`HostBondingModal > handleOkClick ... editMode: ${editMode}`)
    if (editMode) {
      // 수정 모드: 기존 bond + 옵션만 바꿔서 전달
      const updatedBond = {
        ...bondModalState.editTarget,
        bondingVo: {
          ...bondModalState.editTarget.bondingVo,
          optionVos: [{ name: "mode", value: bondModalState.optionMode }],
        }
      };
      onBondingCreated(updatedBond, [bondModalState.editTarget]); // nicData는 기존 bond 하나
    } else {  
      // 생성 모드: 이름, option, slave NICs 전달
      const nicArr = Array.isArray(bondModalState.editTarget) ? bondModalState.editTarget : [];
      Logger.debug(`HostBondingModal > handleOkClick ... nicArr: `, nicArr)

      const newBond = {
        name: bondModalState.name,
        bondingVo: {
          optionVos: [{ name: "mode", value: bondModalState.optionMode }],
          slaveVos: nicArr.map(nic => ({ name: nic.name })),
        }
      };
      onBondingCreated(newBond, nicArr);
    }
    onClose();
  };


  return (
    <BaseModal targetName={`본딩 ${editMode ? bondModalState?.name : ""} ${bLabel}`} submitTitle={""}
      isOpen={isOpen} onClose={onClose}
      isReady={
        bondModalState &&
        typeof bondModalState.name === "string" &&
        typeof bondModalState.optionMode === "string"
      }
      onSubmit={handleOkClick}
      contentStyle={{ width: "500px" }}
    >
      <LabelInput id="bonding_name" label={Localization.kr.NAME}        
        value={bondModalState.name}
        onChange={handleInputChange(setBondModalState, "name", validationToast)}
        disabled={editMode}
      />
      <LabelSelectOptions id="bonding_mode" label="본딩모드"
        value={bondModalState.optionMode}
        options={
          editMode
            ? optionList.filter(opt => ["1", "2", "3", "4", "7"].includes(opt.value))
            : optionList
        }
        onChange={handleInputChange(setBondModalState, "optionMode", validationToast)}
        
      />
      <span>{bondModalState.optionMode}</span><br/>
      <span>{bondModalState.userMode}</span>
      <LabelInput id="user_mode" label="사용자 정의 모드"        
        value={bondModalState.userMode}
        onChange={handleInputChange(setBondModalState, "userMode", validationToast)}
        disabled={isUserModeDisabled}
      />
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
  { value: "7", label: "사용자 정의" },
];

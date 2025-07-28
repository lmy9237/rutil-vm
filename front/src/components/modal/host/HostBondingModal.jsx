import React, { useEffect, useRef } from "react";
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
  
  // 본딩 이름 중복 체크 함수
  const isBondNameDuplicated = (name) => {
    if (editMode && bondModalState.editTarget?.name === name) return false;
    return existingBondNames.includes(name);
  };

  const origBondingVo = bondModalState.editTarget?.bondingVo

  const getModeValueFromOptions = (options = []) => {
    return options.find(opt => opt.name === "mode")?.value?.toString() || "";
  };

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

  const origModeRef = useRef(null);
  const userModeBackupRef = useRef(""); // 사용자 정의 모드 백업용
  useEffect(() => {
    if (origModeRef.current === null) {
      origModeRef.current = getModeValueFromOptions(bondModalState.optionVos);
    }
  }, []);

  const stringifyOptionVos = (optionVos = []) => {
    return optionVos.map(o => `${o.name}=${o.value}`).join(" ");
  };

  const validateForm = () => {
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
      const updatedBond = {
        ...bondModalState.editTarget,
        bondingVo: {
          ...bondModalState.editTarget.bondingVo,
          optionVos: parseUserMode(bondModalState.userMode),
        }
      };
      onBondingCreated(updatedBond, [bondModalState.editTarget]);
    } else {
      const nicArr = Array.isArray(bondModalState.editTarget) ? bondModalState.editTarget : [];
      Logger.debug(`HostBondingModal > handleOkClick ... nicArr: `, nicArr)

      const newBond = {
        name: bondModalState.name,
        bondingVo: {
          optionVos: parseUserMode(bondModalState.userMode),
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
      // isReady={
      //   bondModalState &&
      //   typeof bondModalState.name === "string" &&
      //   typeof bondModalState.optionMode === "string"
      // }
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
        <span>getModeValueFromOptions(bondModalState.optionVos) {getModeValueFromOptions(bondModalState.optionVos)}</span><br/>
        <span>origMode: {origModeRef.current}</span><br/>
        <span>userMode: {bondModalState.userMode}</span>
        </>
      } 
      <LabelSelectOptions id="bonding_mode" label="본딩모드"
        value={getModeValueFromOptions(bondModalState.optionVos)}
        options={optionList}
        onChange={(e) => {
          const val = e.target.value;

          // 현재 userMode 값 백업 (바뀌기 전에)
          const currentMode = getModeValueFromOptions(bondModalState.optionVos);
          if (
            editMode &&
            userModeBackupRef.current === "" &&
            val !== currentMode &&
            currentMode === origModeRef.current
          ) {
            userModeBackupRef.current = bondModalState.userMode;
          }

          const updatedOptionVos = [{ name: "mode", value: val }];
          setBondModalState(prev => ({
            ...prev,
            optionVos: updatedOptionVos,
            userMode:
              val === origModeRef.current
                ? userModeBackupRef.current || stringifyOptionVos(updatedOptionVos)
                : stringifyOptionVos(updatedOptionVos)
          }));
        }}
      />

      <LabelInput id="user_mode" label="사용자 정의 모드"
        value={bondModalState.userMode}
        disabled={getModeValueFromOptions(bondModalState.optionVos) !== origModeRef.current}
        onChange={handleInputChange(setBondModalState, "userMode", validationToast)}
      />

      {origBondingVo?.optionVos?.length > 0 && (
        origBondingVo.optionVos.map((opt, index) => (
          <div key={index}>
            <span>{opt.name}: {opt.value}</span>
          </div>
        ))
      )}
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

import React from "react";
import { useToast }            from "@/hooks/use-toast";
import BaseModal               from "@/components/modal/BaseModal";
import LabelInput              from "@/components/label/LabelInput";
import LabelSelectOptions      from "@/components/label/LabelSelectOptions";
import { checkName }           from "@/util";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

const HostBondingModal = ({ 
  editMode = false, 
  isOpen, onClose,
  bondModalState, setBondModalState,
  onBondingCreated
}) => {
  const { toast } = useToast();
  const bLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const handleChangeName = (e) => setBondModalState(prev => ({ ...prev, name: e.target.value }));
  const handleChangeMode = (e) => setBondModalState(prev => ({ ...prev, optionMode: e.target.value }));

  console.log("% bondModalState", bondModalState)

  const validateForm = () => {
    if(!editMode){
      const nameError = checkName(bondModalState.name);
      if (nameError) return nameError;
    }

    return null;
  };

  const handleOkClick = () => {
  const error = validateForm();
  if (error) {
    toast({
      variant: "destructive",
      title: "문제가 발생하였습니다.",
      description: error,
    });
    return;
  }

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
    const newBond = {
      name: bondModalState.name,
      bondingVo: {
        optionVos: [{ name: "mode", value: bondModalState.optionMode }],
        slaveVos: nicArr.map(nic => ({ id: nic.id, name: nic.name })),
      }
    };
    onBondingCreated(newBond, nicArr); // nicArr: NIC 2개
  }

  onClose();
};


  return (
    <BaseModal targetName={`본딩 ${editMode ? bondModalState?.name : ""} ${bLabel}`} submitTitle={""}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleOkClick}
      contentStyle={{ width: "500px" }}
    >
      <span>
        nicdata{" "}
        {editMode
          ? bondModalState?.name
          : Array.isArray(bondModalState?.editTarget)
            ? bondModalState.editTarget.map((e) => `${e.name} /`).join("")
            : (bondModalState?.editTarget?.name || "")}
      </span>
      <span>name: {bondModalState?.name}</span><br/>
      <span>optionMode: {bondModalState.optionMode}</span><br/>
      <LabelInput id="bonding_name" label={Localization.kr.NAME}        
        value={bondModalState.name}
        onChange={handleChangeName}
        disabled={editMode}
      />
      <LabelSelectOptions id="bonding_mode" label="본딩모드"
        value={bondModalState.optionMode}
        options={optionList}
        onChange={handleChangeMode}
      />
      <LabelInput id="user_mode" label="사용자 정의 모드"        
        value={bondModalState.userMode}
        disabled={true}
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
];

import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import Localization from "../../../utils/Localization";
import { useAddBonding, useNetworkInterfaceFromHost } from "../../../api/RQHook";
import toast from "react-hot-toast";

const optionList = [
  { value: "1", label: "(Mode 1) Active-Backup" },
  { value: "2", label: "(Mode 2) Load balance (balance-xor)" },
  { value: "3", label: "(Mode 3) Broadcast" },
  { value: "4", label: "(Mode 4) Dynamic link aggregation (802.3ad)" }
];

const HostNetworkBondingModal = ({ 
  isOpen, 
  editmode = false,
  hostId,
  nicId,
  onClose, 
}) => {
  const bLabel = editmode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const { data: hostNic = [] } = useNetworkInterfaceFromHost(hostId, nicId);
  
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.HOST} 본딩 ${bLabel} 완료`);
  };
  const { mutate: addBonding } = useAddBonding(onSuccess, () => onClose());

  const [name, setName] = useState("");
  const [options, setOptions] = useState([]);
  const [mode, setMode] = useState("");

  const initializeOptions = (bonding) => {
    if (!bonding || !bonding.bondingVo) return;
    const bondingOptions = bonding.bondingVo.optionVos || [];
    setOptions(
      bondingOptions.map(option => ({
        name: option.name,
        value: option.value,
        type: option.type
      }))
    );
  };
  
  useEffect(() => {
    if (editmode && hostNic?.name) {
      setName(hostNic.name);
      initializeOptions(hostNic);
    }
  }, [editmode, hostNic]);

  return (
    <BaseModal
      targetName={!editmode ? `새 본딩 ${Localization.kr.CREATE}` : `본딩 ${name} ${Localization.kr.UPDATE}`}
      submitTitle={""}
      isOpen={isOpen} onClose={onClose}
      onSubmit={() => {}}
      contentStyle={{ width: "500px" }}
    >
      <LabelInput id="bonding_name" label="본딩이름"        
        value={name}
        disabled={editmode}
        onChange={(e) => setName(e.target.value)}
      />
      <LabelSelectOptions id="bonding_mode" label="본딩모드"        
        value={options.find(opt => opt.name === "mode")?.value || ""}
        options={optionList}
        onChange={(e) => {
          setOptions(prev =>
            prev.map(opt =>
              opt.name === "mode" ? { ...opt, value: e.target.value } : opt
            )
          );
        }}
      />
      <LabelInput id="user_mode" label="사용자 정의 모드"        
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      />
    </BaseModal>
  );
};

export default HostNetworkBondingModal;

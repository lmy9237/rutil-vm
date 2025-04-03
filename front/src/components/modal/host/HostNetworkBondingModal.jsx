import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";

  const optionList = [
    { value: "#", label: "(Mode 1) Active-Backup" }
  ];
const HostNetworkBondingModal = ({ 
  isOpen, 
  editmode = false,
  bonding,
  onClose, 
}) => {
  const [name, setName] = useState("");
  
  useEffect(() => {
    if (editmode && bonding?.name) {
      setName(bonding.name);
    }
  }, [bonding, editmode]);

  return (
    <BaseModal targetName={!editmode ? `새 본딩 생성` : `본딩 ${name} 편집`}
      isOpen={isOpen} onClose={onClose}      
      submitTitle={""}
      onSubmit={() => {}}
      contentStyle={{ width: "480px"}} 
    >
      <LabelInput label="본딩이름" id="bonding_name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <LabelSelectOptions label="본딩모드" id="bonding_mode"
        options={optionList}
        disabled={true}
      />

    </BaseModal>
  );
};

export default HostNetworkBondingModal;

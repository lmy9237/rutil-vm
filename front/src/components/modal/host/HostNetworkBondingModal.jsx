import React from "react";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";

const HostNetworkBondingModal = ({ 
  isOpen, 
  editmode = false,
  bonding,
  onClose, 
}) => {
  return (
    <BaseModal 
      isOpen={isOpen} onClose={onClose}
      targetName={editmode === "false" ? "새 본딩 생성" : "본딩 편집"}
      submitTitle={""}
      onSubmit={() => {}}
      contentStyle={{ width: "480px", height: "270px" }} 
    >
      <div className="popup-content-outer">
        <LabelInput label="본딩이름" id="bonding_name" />
        <LabelSelectOptions
          label="본딩모드" id="bonding_mode"
          options={[{ label: "(Mode 1) Active-Backup", value: "#" }]}
        />
      </div>
    </BaseModal>
  );
};

export default HostNetworkBondingModal;

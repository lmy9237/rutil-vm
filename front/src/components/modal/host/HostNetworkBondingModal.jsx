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

  // const handleInputChange = (field) => (e) => {
  //   setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  // };

  return (
    <BaseModal 
      isOpen={isOpen} onClose={onClose}
      targetName={!editmode ? "새 본딩 생성" : "본딩 편집"}
      submitTitle={""}
      onSubmit={() => {}}
      contentStyle={{ width: "480px", height: "270px" }} 
    >
      <div className="popup-content-outer">
        <LabelInput label="본딩이름" id="bonding_name" />
        {/* <LabelInput id="description" label="설명"
          value={formState.description}
          onChange={handleInputChange("description")}
        /> */}
        <LabelSelectOptions
          label="본딩모드" id="bonding_mode"
          options={[{ label: "(Mode 1) Active-Backup", value: "#" }]}
          disabled={true}
        />
      </div>
    </BaseModal>
  );
};

export default HostNetworkBondingModal;

import React from "react";
import BaseModal from "../BaseModal";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelInput from "../../label/LabelInput";

const NewBondingModal = ({ isOpen, onClose, mode = "edit" }) => {
  // 제목을 모드에 따라 설정
  const modalTitle = mode === "create" ? "새 본딩 제작" : "본딩 편집";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={modalTitle}
      submitTitle={"추가"}
      onSubmit={() => {}}
      contentStyle={{ width: "480px", height: "270px" }} 
    >
      <div className="popup-content-outer">
        <LabelInput
          label="본딩이름"
          id="bonding_name"
        />
        <LabelSelectOptionsID
          label="본딩모드"
          id="bonding_mode"
          disabled
          options={[{ id: "#", name: "#" }]}
        />
        <LabelInput
          label="사용자 정의 모드"
          id="custom_mode"
        />
      </div>
    </BaseModal>
  );
};

export default NewBondingModal;

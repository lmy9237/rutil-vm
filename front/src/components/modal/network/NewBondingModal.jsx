import React from "react";
import BaseModal from "../BaseModal";

const NewBondingModal = ({ isOpen, onClose, mode = "edit" }) => {
  // 제목을 모드에 따라 설정
  const modalTitle = mode === "create" ? "새 본딩 제작" : "본딩 편집";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={modalTitle}
      submitTitle={"추가"}
      onSubmit={() => {}}
    >
      {/* <div className="network-bonding-modal modal"> */}
      <div className="bonding-content modal-content">
        <div className="select-box">
          <label htmlFor="ip_address">본딩이름</label>
          <input type="text" />
        </div>
        <div className="select-box">
          <label htmlFor="ip_address">본딩모드</label>
          <select id="ip_address" disabled>
            <option value="#">#</option>
          </select>
        </div>
        <div className="select-box">
          <label htmlFor="ip_address">사용자 정의 모드</label>
          <input type="text" />
        </div>
      </div>
    </BaseModal>
  );
};

export default NewBondingModal;

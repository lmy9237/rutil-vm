import React from "react";
import Modal from "react-modal";
import "./BaseModal.css";
import { RVI24, rvi24Close, rvi24ErrorRed } from "../icons/RutilVmIcons";
/**
 * @name BaseModal
 * @description 기본 모달 테두리
 *
 * @returns
 */
const BaseModal = ({
  isOpen,
  onClose,
  targetName,
  submitTitle,
  promptText = "",
  shouldWarn = false,
  onSubmit,
  contentStyle = {},
  ...props
}) => {
  return (
    <Modal className="Modal" overlayClassName="Overlay"
      // overlayClassName="Overlay newRolePopupOverlay" <-- DiskActionModal, DomainGetDiskModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={targetName}
      shouldCloseOnOverlayClick={false}
    >
      <div className="modal" style={contentStyle}>
        <div className="popup-header f-btw">
          <h1>
            {`${targetName} ${submitTitle}`}
          </h1>
          <button onClick={onClose}>
            <RVI24 iconDef={rvi24Close} />
          </button>
        </div>
        
        <div className="popup-contents">
          <div className="popup-contents-prompt">
            {shouldWarn && <RVI24 iconDef={rvi24ErrorRed}
              className="error-icon"
            />}
            {promptText}
          </div>
          {props.children}
        </div>

        {/* 하단 버튼 */}
        <div className="edit-footer">
          <button className="action" onClick={onSubmit}>{submitTitle}</button>
          <button className="cancel" onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default BaseModal;

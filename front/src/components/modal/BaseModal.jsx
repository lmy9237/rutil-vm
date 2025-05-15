import React, { useEffect } from "react";
import Modal from "react-modal";
import useUIState from "../../hooks/useUIState";
import useContextMenu from "../../hooks/useContextMenu";
import { RVI24, rvi24Close, rvi24ErrorRed } from "../icons/RutilVmIcons";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";
import "./BaseModal.css";

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
  extraFooter = null, 
  ...props
}) => {
  // const { closeModal } = useUIState()
  // NOTE: 두개 이상 있을 때 하나만 닫기가 불가능 (기상머신 생성/편집 > 가상 디스크)
  const { clearAllContextMenu } = useContextMenu()

  useEffect(() => {
    Logger.debug(`BaseModal > useEffect ...`)
    clearAllContextMenu(null)
  }, [])

  return (
    <Modal className="Modal" overlayClassName="Overlay f-center"
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={targetName}
      shouldCloseOnOverlayClick={false}
    >
      <div className="modal" style={contentStyle}>
        <div className="popup-header f-btw">
          <h1 className="f-center fs-22 fw-500">
            {`${targetName} ${submitTitle}`}
          </h1>
          <RVI24 className="btn" iconDef={rvi24Close} onClick={onClose}/>
        </div>
        <hr/>
        <div className="popup-contents">
          {(shouldWarn || promptText) && (
            <div className="popup-contents-prompt f-start fs-16">
              {shouldWarn && (<RVI24 iconDef={rvi24ErrorRed()} className="error-icon mr-2" />)}
              {promptText}
            </div>
          )}
          {props.children}
        </div>

        {/* 하단 버튼 */}
        <hr/>
        <div className="edit-footer f-end fs-14">
          {extraFooter ? (
            <>
              {extraFooter}
              <button className="cancel" onClick={onClose}>{Localization.kr.CANCEL}</button>
            </>
          ) : (
            <>
              <button className="action" onClick={onSubmit}>{Localization.kr.OK}</button>
              <button className="cancel" onClick={onClose}>{Localization.kr.CANCEL}</button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BaseModal;

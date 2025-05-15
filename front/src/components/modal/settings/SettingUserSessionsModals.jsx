import React from "react";
import useUIState from "../../../hooks/useUIState";
import SettingUserSessionsModal from "./SettingUserSessionsModal"
import Logger from "../../../utils/Logger";

/**
 * @name SettingUserSessionsModals
 * @description 관리 > 활성 사용자 세션 모달 모음
 * 
 * @returns 
 */
const SettingUserSessionsModals = ({
}) => {
  const { activeModal, closeModal } = useUIState()
  const modals = {
    end:  (
      <SettingUserSessionsModal key={"usersession:end"} isOpen={activeModal().includes("usersession:end")} 
        onClose={() => closeModal("usersession:end")}
      />
    ),
  }

  return (
    <>
      {Object.keys(modals).filter((key) =>
        activeModal().includes(`usersession:${key}`)
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
}

export default SettingUserSessionsModals

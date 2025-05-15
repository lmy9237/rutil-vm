import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import SettingUsersModal from './SettingUsersModal'
import DeleteModal from "../../../utils/DeleteModal"
import { useRemoveUser } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name SettingUsersModals
 * @description 관리 > 사용자 모달
 * 
 * @returns 
 */
const SettingUsersModals = ({
  user,
}) => {
  const { activeModal, closeModal } = useUIState()
  const { usersSelected } = useGlobal()

  const modals = {
    create:  (
      <SettingUsersModal key={"user:create"} isOpen={activeModal().includes("user:create")}
        onClose={() => closeModal("user:create")}
      />
    ), update: (
      <SettingUsersModal key={"user:update"} isOpen={activeModal().includes("user:update")} editMode
        onClose={() => closeModal("user:update")}
        user={usersSelected[0]?.id ?? user?.id}
      />
    ), changePassword: (
      <SettingUsersModal key={"user:changePassword"} isOpen={activeModal().includes("user:changePassword")} 
        onClose={() => closeModal("user:changePassword")}
        changePassword
        user={usersSelected[0]?.id ?? user?.id}
      />
    ), remove: (
      <DeleteModal key={"user:remove"} isOpen={activeModal().includes("user:remove")}
        onClose={() => closeModal("user:remove")}
        label={Localization.kr.USER}
        data={usersSelected}
        api={useRemoveUser()}
      />
    ),
  }
  
  return (
    <>
     {Object.keys(modals).filter((key) => 
        activeModal().includes(`user:${key}`)
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
}

export default React.memo(SettingUsersModals)
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
  const { activeModal, setActiveModal } = useUIState()
  const { usersSelected } = useGlobal()

  const modals = {
    create:  (
      <SettingUsersModal key={activeModal()} isOpen={activeModal() === "user:create"} 
        onClose={() => setActiveModal(null)} 
      />
    ), update: (
      <SettingUsersModal key={activeModal()} isOpen={activeModal() === "user:update"} 
        onClose={() => setActiveModal(null)} 
        user={user?.id ?? usersSelected[0]?.id}
        editMode
      />
    ), changePassword: (
      <SettingUsersModal key={activeModal()} isOpen={activeModal() === "user:changePassword"} 
        onClose={() => setActiveModal(null)} 
        changePassword={true}
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "user:remove"}
        onClose={() => setActiveModal(null)}
        label={Localization.kr.USER}
        data={usersSelected}
        api={useRemoveUser()}
      />
    ),
  }
  
  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
}

export default SettingUsersModals
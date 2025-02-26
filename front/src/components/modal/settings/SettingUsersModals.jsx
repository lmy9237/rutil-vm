import React from "react";
import SettingUsersModal from './SettingUsersModal'
import DeleteModal from "../../../utils/DeleteModal"
import { useRemoveUser } from "../../../api/RQHook";

/**
 * @name SettingUsersModals
 * @description 관리 > 사용자 모달
 * 
 * @returns 
 */
const SettingUsersModals = ({
  modalType, user, onClose 
}) => {
  const allModals = {
    create:  (
      <SettingUsersModal isOpen={modalType==="create"} onClose={onClose} 
        targetName={"사용자"}
      />
    ),
    edit: (
      <SettingUsersModal isOpen={modalType==="edit"} onClose={onClose} 
        targetName={"사용자"}
        user={user[0]}
        editMode
      />
    ),
    changePassword: (
      <SettingUsersModal isOpen={modalType==="changePassword"} onClose={onClose} 
        targetName={"사용자"}
        user={user[0]}
        changePassword
      />
    ),
    remove: (
      <DeleteModal
        isOpen={modalType==="remove"}
        onClose={onClose}
        label={"사용자"}
        data={user[0]}
        api={useRemoveUser()}
      />
    ),
  }
  
  console.log("...")
  return (
    <>
      {Object.keys(allModals).map((key) => (
        <React.Fragment key={key}>{allModals[key]}</React.Fragment>
      ))}
    </>
  );
}

export default SettingUsersModals
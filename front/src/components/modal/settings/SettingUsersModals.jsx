import React from "react";
import SettingUsersModal from './SettingUsersModal'
import "./MSettingsUser.css";

/**
 * @name SettingUsersModals
 * @description 관리 > 사용자 모달
 * 
 * @returns 
 */
const SettingUsersModals = ({
  modalType, user, selectedUsers = [], onClose 
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
        userId={user?.id} editMode
      />
    )
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
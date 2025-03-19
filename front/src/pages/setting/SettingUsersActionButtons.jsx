import React from "react";
import ActionButtonGroup from "../../components/button/ActionButtonGroup";

/**
 * @name SettingUsersActionButtons
 * @description ...
 *
 * @prop {boolean} openModal ...
 * @prop {boolean} isEditDisabled ...
 * @prop {string} status ...
 * @prop {string} type
 * @returns {JSX.Element} SettingUsersActionButtons
 *
 */
const SettingUsersActionButtons = ({
  openModal,
  isEditDisabled,
  status,
  actionType = 'default'
}) => {
  const basicActions = [
    { type: 'add', label: '생성', disabled: false, onBtnClick: () => openModal("add")  },
    { type: 'edit', label: '편집', disabled: isEditDisabled , onBtnClick: () => openModal("edit") },
    { type: 'changePassword', label: '비밀번호변경', disabled: isEditDisabled, onBtnClick: () => openModal("changePassword")  },
    { type: 'remove', label: '삭제', disabled: status === "none", onBtnClick: () => openModal("remove")  },
    
  ];

  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />
  );
};

export default SettingUsersActionButtons;

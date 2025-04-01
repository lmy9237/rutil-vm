import React from "react";
import ActionButtonGroup from "../../components/button/ActionButtonGroup";
import Localization from "../../utils/Localization";

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
    { type: 'add', label: Localization.kr.CREATE, disabled: false, onBtnClick: () => openModal("add")  },
    { type: 'edit', label: Localization.kr.UPDATE, disabled: isEditDisabled , onBtnClick: () => openModal("edit") },
    { type: 'changePassword', label: '비밀번호변경', disabled: isEditDisabled, onBtnClick: () => openModal("changePassword")  },
    { type: 'remove', label: Localization.kr.REMOVE, disabled: status === "none", onBtnClick: () => openModal("remove")  },
    
  ];

  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />
  );
};

export default SettingUsersActionButtons;

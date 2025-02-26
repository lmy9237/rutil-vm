import React from "react";

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
  type = "default",
}) => {
  const basicActions = [
    { type: 'add', label: '생성', disabled: false },
    { type: 'edit', label: '편집', disabled: isEditDisabled },
    { type: 'changePassword', label: '비밀번호변경', disabled: isEditDisabled },
    { type: 'remove', label: '삭제', disabled: status === "none" },
    
  ];
  const wrapperClass =
    type === "context" ? "right-click-menu-box" : "header-right-btns";
  return (
    <div className={wrapperClass}>
      {basicActions.map(({ type, label, disabled }) => (
        <button className="right-click-menu-btn"
          key={type}
          onClick={() => openModal(type)}
          disabled={disabled}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default SettingUsersActionButtons;

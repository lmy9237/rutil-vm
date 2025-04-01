import React from "react";
import Localization from "../../utils/Localization";

const NicActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  type = "default",
}) => {
  const basicActions = [
    { type: "create", label: Localization.kr.CREATE, disabled: false },
    { type: "edit", label: Localization.kr.UPDATE, disabled: isEditDisabled },
    { type: "delete", label: Localization.kr.REMOVE, disabled: isDeleteDisabled },
  ];

  const wrapperClass = type === "context" 
    ? "right-click-menu-box"
    : "header-right-btns";
    
  return (
    <div className={wrapperClass}>
      {basicActions.map(({ type: actionType, label, disabled }) => (
        <button
          key={actionType}
          onClick={() => openModal(actionType)}
          disabled={disabled}
          className="right-click-menu-btn"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default NicActionButtons;
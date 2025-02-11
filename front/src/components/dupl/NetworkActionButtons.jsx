import React from "react";
import { useNavigate } from "react-router-dom";

const NetworkActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  type = "default",
}) => {
  const navigate = useNavigate();
  const basicActions = [
    { type: "create", label: "생성", disabled: false },
    { type: "edit", label: "편집", disabled: isEditDisabled },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled },
    { type: "import", label: "가져오기", disabled: false },
  ];

  const wrapperClass =
    type === "context" ? "right-click-menu-box" : "header-right-btns";
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
      <button
        className="right-click-menu-btn"
        onClick={() => navigate("/vnicProfiles")}
      >
        vNICProfile
      </button>
    </div>
  );
};

export default NetworkActionButtons;

const VnicProfileActionButtons = ({
  openModal,
  isEditDisabled,
  type = "default",
}) => {
  const basicActions = [
    { type: "create", label: "생성", disabled: false },
    { type: "edit", label: "편집", disabled: isEditDisabled },
    { type: "delete", label: "삭제", disabled: false },
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
          className={type === "context" ? "right-click-menu-btn" : ""}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default VnicProfileActionButtons;

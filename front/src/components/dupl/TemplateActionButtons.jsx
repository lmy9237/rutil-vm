
const TemplateActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  type = "default",
}) => {
  const basicActions = [
    // { type: 'create', label: '생성', disabled: false },
    { type: "edit", label: "편집", disabled: isEditDisabled },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled },
  ];

  const wrapperClass =
    type === "context" ? "right-click-menu-box" : "header-right-btns";
  return (
    <div className={wrapperClass}>
      {basicActions.map(({ type, label, disabled }) => (
        <button
          key={type}
          onClick={() => openModal(type)}
          disabled={disabled}
          className="right-click-menu-btn"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TemplateActionButtons;

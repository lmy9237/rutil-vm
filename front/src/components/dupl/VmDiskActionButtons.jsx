const VmDiskActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,
}) => {
  const isOk = status === "OK";
  const isActive = status === "active";

  const basicActions = [
    { type: "create", label: "생성" },
    { type: "connect", label: "연결" },
    { type: "edit", label: "편집", disabled: isEditDisabled },
    { type: "delete", label: "삭제", disabled: isActive },
    { type: "activate", label: "활성", disabled: isDeleteDisabled || isActive },
    { type: "deactivate", label: "비활성", disabled: isDeleteDisabled || !isActive },
    { type: "move", label: "이동", disabled: isDeleteDisabled || isActive },
  ];

  return (
    <div className="header-right-btns">
      {basicActions.map(({ type, label, disabled }) => (
        <button
          key={type}
          className="right-click-menu-btn"
          onClick={() => openModal(type)}
          disabled={disabled}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default VmDiskActionButtons;

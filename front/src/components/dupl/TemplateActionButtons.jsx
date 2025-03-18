import ActionButtonGroup from "../button/ActionButtonGroup";

const TemplateActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  actionType = "default",
}) => {
  const basicActions = [
    { type: "edit", label: "편집", disabled: isEditDisabled, onBtnClick: () => openModal("edit")  },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled, onBtnClick: () => openModal("delete")  },
  ];

  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />
  );
};

export default TemplateActionButtons;

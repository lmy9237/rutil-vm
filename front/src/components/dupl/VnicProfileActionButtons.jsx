import ActionButtonGroup from "../button/ActionButtonGroup";

const VnicProfileActionButtons = ({
  openModal,
  isEditDisabled,
  actionType = 'default'
}) => {
  const basicActions = [
    { type: "create", label: "생성", disabled: false, onBtnClick: () => openModal("create")  },
    { type: "edit", label: "편집", disabled: isEditDisabled, onBtnClick: () => openModal("edit")  },
    { type: "delete", label: "삭제", disabled: false, onBtnClick: () => openModal("delete")  },
  ];

  return (
    <>
      <ActionButtonGroup
        actionType={actionType}
        actions={basicActions}
      />
    </>
  );
};

export default VnicProfileActionButtons;

import ActionButtonGroup from "../button/ActionButtonGroup";

/**
 * @name ClusterActionButtons
 * @description ...
 * 
 * @param {boolean} openModal,
 * @returns
 * 
 */
const ClusterActionButtons = ({
  openModal,
  isEditDisabled,
  status,
  actionType = 'default',
}) => {
  const basicActions = [
    { type: "create", label: "생성", disabled: false, onBtnClick: () => openModal("create") },
    { type: "edit", label: "편집", disabled: isEditDisabled , onBtnClick: () => openModal("edit")},
    { type: "delete", label: "삭제", disabled: status === "none", onBtnClick: () => openModal("delete") },
  ];
  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />
  );
};

export default ClusterActionButtons;

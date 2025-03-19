import ActionButtonGroup from "../button/ActionButtonGroup";

const DataCenterActionButtons = ({ 
  openModal, 
  status,
  actionType = 'default',
}) => {
  const basicActions = [
    { type: 'create', label: '생성', disabled: false, onBtnClick: () => openModal("create") }, 
    { type: 'edit', label: '편집', disabled: status !== 'single', onBtnClick: () => openModal("edit") },
    { type: 'delete', label: '삭제', disabled: status === 'none', onBtnClick: () => openModal("delete") }, 
  ];

  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />
  );
};

export default DataCenterActionButtons;

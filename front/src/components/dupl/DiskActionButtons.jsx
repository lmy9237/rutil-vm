import React from "react";
import ActionButtonGroup from "../button/ActionButtonGroup";

const DiskActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,
  actionType = "default",
}) => {
  const basicActions = [
    { type: "create", label: "생성", disabled: false, onBtnClick: () => openModal("create") },
    { type: "edit", label: "편집", disabled: isEditDisabled, onBtnClick: () => openModal("edit") },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled , onBtnClick: () => openModal("delete")},
    { type: "move", label: "이동", disabled: isEditDisabled , onBtnClick: () => openModal("move")},
    { type: "copy", label: "복사", disabled: isEditDisabled , onBtnClick: () => openModal("copy")},
    { type: "upload", label: "업로드", onBtnClick: () => openModal("upload") },
  ];
  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />
  );
};

export default DiskActionButtons;

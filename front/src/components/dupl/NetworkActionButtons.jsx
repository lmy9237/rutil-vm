import React from "react";
import { useNavigate } from "react-router-dom";
import ActionButtonGroup from "../button/ActionButtonGroup";
import ActionButton from "../button/ActionButton";

const NetworkActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  actionType = "default",
  isContextMenu
}) => {
  const navigate = useNavigate();
  const basicActions = [
    { type: "create", label: "생성", disabled: false, onBtnClick: () => openModal("create") },
    { type: "edit", label: "편집", disabled: isEditDisabled, onBtnClick: () => openModal("edit") },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled, onBtnClick: () => openModal("delete") },
    { type: "import", label: "가져오기", disabled: false, onBtnClick: () => openModal("import") },
  ];

  return (
    <>
      <ActionButtonGroup
        actionType={actionType}
        actions={basicActions}
      >
        {!isContextMenu && (
          <ActionButton label={"VNicProfile"}  onClick={() => navigate("/vnicProfiles")} actionType={actionType}/>
        )}
      </ActionButtonGroup>
    </>
  );
};

export default NetworkActionButtons;

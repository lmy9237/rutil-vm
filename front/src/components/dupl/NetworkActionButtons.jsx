import React from "react";
import { useNavigate } from "react-router-dom";
import ActionButtonGroup from "../button/ActionButtonGroup";
import ActionButton from "../button/ActionButton";
import Localization from "../../utils/Localization";

const NetworkActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  actionType = "default",
  isContextMenu
}) => {
  const navigate = useNavigate();
  const basicActions = [
    { type: "create", label: Localization.kr.CREATE, disabled: false, onBtnClick: () => openModal("create") },
    { type: "edit", label: Localization.kr.UPDATE, disabled: isEditDisabled, onBtnClick: () => openModal("edit") },
    { type: "delete", label: Localization.kr.REMOVE, disabled: isDeleteDisabled, onBtnClick: () => openModal("delete") },
    { type: "import", label: Localization.kr.IMPORT, disabled: false, onBtnClick: () => openModal("import") },
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

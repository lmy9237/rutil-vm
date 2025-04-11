import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButtonGroup from "../button/ActionButtonGroup";
import ActionButton from "../button/ActionButton";
import Localization from "../../utils/Localization";

const NetworkActionButtons = ({
  openModal,
  selectedNetworks = [],
  status,
  actionType = "default",
  isContextMenu = false,
}) => {
  const navigate = useNavigate();

  const basicActions = [
    { type: "create", label: Localization.kr.CREATE, disabled: false, onBtnClick: () => openModal("create") },
    { type: "edit", label: Localization.kr.UPDATE, disabled: selectedNetworks.length !== 1, onBtnClick: () => openModal("edit") },
    { type: "delete", label: Localization.kr.REMOVE, disabled: selectedNetworks.length === 0, onBtnClick: () => openModal("delete") },
    { type: "import", label: Localization.kr.IMPORT, disabled: false, onBtnClick: () => openModal("import") },
  ];

  return (
    <>
      <ActionButtonGroup actionType={actionType} actions={basicActions}>
        {!isContextMenu && (
          <ActionButton label={Localization.kr.VNIC_PROFILE}
            onClick={() => navigate("/vnicProfiles")}
            actionType={actionType}
          />
        )}
      </ActionButtonGroup>
    </>
  );
};

export default NetworkActionButtons;

import React from "react";
import Localization from "../../utils/Localization";
import ActionButtonGroup from "../button/ActionButtonGroup";
import useUIState from "../../hooks/useUIState";
import Logger from "../../utils/Logger";

const NicActionButtons = ({
  isEditDisabled,
  isDeleteDisabled,
  actionType = "default",
}) => {
  const { setActiveModal } = useUIState()

  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("nic:create"), label: Localization.kr.CREATE, disabled: false, },
    { type: "update", onBtnClick: () => setActiveModal("nic:update"), label: Localization.kr.UPDATE, disabled: isEditDisabled, },
    { type: "remove", onBtnClick: () => setActiveModal("nic:remove"), label: Localization.kr.REMOVE, disabled: isDeleteDisabled, },
  ];

  Logger.debug(`NicActionButtons ... `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions}/>
  );
};

export default NicActionButtons;
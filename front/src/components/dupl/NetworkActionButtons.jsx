import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobal from "../../hooks/useGlobal";
import useUIState from "../../hooks/useUIState";
import ActionButtonGroup from "../button/ActionButtonGroup";
import ActionButton from "../button/ActionButton";
import Localization from "../../utils/Localization";

const NetworkActionButtons = ({
  actionType = "default",
}) => {
  const navigate = useNavigate();
  const { setActiveModal } = useUIState()
  const { networksSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("network:create"), label: Localization.kr.CREATE, disabled: isContextMenu && networksSelected.length > 0, },
    { type: "update", onBtnClick: () => setActiveModal("network:update"), label: Localization.kr.UPDATE, disabled: networksSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("network:remove"), label: Localization.kr.REMOVE, disabled: networksSelected.length === 0, },
    { type: "import", onBtnClick: () => setActiveModal("network:import"), label: Localization.kr.IMPORT, disabled: networksSelected.length !== 1, },
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

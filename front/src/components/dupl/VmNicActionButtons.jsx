import React, { useMemo } from "react";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import ActionButtonGroup from "../button/ActionButtonGroup";
import Localization from "../../utils/Localization";

const VmNicActionButtons = ({
  actionType = "default",
}) => {
  const { setActiveModal } = useUIState()
  const { nicsSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const basicActions = useMemo(() => ([
    { type: "create", onBtnClick: () => setActiveModal("nic:create"), label: Localization.kr.CREATE, disabled: isContextMenu && nicsSelected.length > 0, },
    { type: "update", onBtnClick: () => setActiveModal("nic:update"), label: Localization.kr.UPDATE, disabled: nicsSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("nic:remove"), label: Localization.kr.REMOVE, disabled: nicsSelected.length === 0, },
  ]), [actionType, nicsSelected]);

  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions}/>
  );
};

export default VmNicActionButtons;
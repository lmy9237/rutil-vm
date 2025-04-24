import React, { useMemo } from "react";
import useUIState from "../../hooks/useUIState";
import ActionButtonGroup from "../button/ActionButtonGroup";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";
import useGlobal from "../../hooks/useGlobal";

/**
 * @name DataCenterActionButtons
 * @description ...
 * 
 * @returns
 * 
 */
const DataCenterActionButtons = ({ actionType = "default" }) => {
  const { setActiveModal } = useUIState()
  const { datacentersSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const selected1st = [...datacentersSelected][0] ?? null

  const basicActions = useMemo(() => [
    { type: "create", onBtnClick: () => setActiveModal("datacenter:create"), label: Localization.kr.CREATE, disabled: isContextMenu && datacentersSelected.length > 0, },
    { type: "update", onBtnClick: () => setActiveModal("datacenter:update"), label: Localization.kr.UPDATE, disabled: datacentersSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("datacenter:remove"), label: Localization.kr.REMOVE, disabled: datacentersSelected.length === 0, },
  ], [actionType, datacentersSelected]);

  Logger.debug(`DataCenterActionButtons ... datacentersSelected.length: ${datacentersSelected.length}, isContextMenu: ${isContextMenu} `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions}/>
  );
};

export default DataCenterActionButtons;

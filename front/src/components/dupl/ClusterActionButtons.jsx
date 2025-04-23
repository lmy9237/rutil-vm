import React, { useMemo } from "react";
import useGlobal from "../../hooks/useGlobal";
import useUIState from "../../hooks/useUIState";
import ActionButtonGroup from "../button/ActionButtonGroup";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";

/**
 * @name ClusterActionButtons
 * @description ...
 * 
 * @returns
 * 
 */
const ClusterActionButtons = ({ 
  actionType = "default"
}) => {
  const { setActiveModal, } = useUIState()
  const { clustersSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const selected1st = [...clustersSelected][0] ?? null

  const basicActions = useMemo(() => [
    { type: "create", onBtnClick: () => setActiveModal("cluster:create"), label: Localization.kr.CREATE, disabled: isContextMenu && clustersSelected.length > 0 },
    { type: "update", onBtnClick: () => setActiveModal("cluster:update"), label: Localization.kr.UPDATE, disabled: clustersSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("cluster:remove"), label: Localization.kr.REMOVE, disabled: clustersSelected.length === 0, },
  ], [actionType, clustersSelected]);

  Logger.debug(`ClusterActionButtons ... clustersSelected.length: ${clustersSelected.length}, isContextMenu: ${isContextMenu} `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default ClusterActionButtons;

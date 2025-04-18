import useGlobal from "../../hooks/useGlobal";
import useUIState from "../../hooks/useUIState";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";
import ActionButtonGroup from "../button/ActionButtonGroup";

/**
 * @name ClusterActionButtons
 * @description ...
 * 
 * @returns
 * 
 */
const ClusterActionButtons = ({ actionType = "default" }) => {
  const { setActiveModal, } = useUIState()
  const { clustersSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const selected1st = (!Array.isArray(clustersSelected) ? [] : clustersSelected)[0] ?? null

  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("cluster:create"), label: Localization.kr.CREATE, disabled: clustersSelected.length > 0 },
    { type: "update", onBtnClick: () => setActiveModal("cluster:update"), label: Localization.kr.UPDATE, disabled: clustersSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("cluster:remove"), label: Localization.kr.REMOVE, disabled: clustersSelected.length === 0, },
  ];

  Logger.debug(`ClusterActionButtons ... clustersSelected.length: ${clustersSelected.length}, isContextMenu: ${isContextMenu} `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default ClusterActionButtons;

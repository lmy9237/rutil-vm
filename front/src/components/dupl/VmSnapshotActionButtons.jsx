import React from 'react'
import useUIState from '../../hooks/useUIState';
import useGlobal from '../../hooks/useGlobal';
import ActionButtonGroup from '../button/ActionButtonGroup';
import Localization from '../../utils/Localization';
import Logger from '../../utils/Logger';


const VmSnapshotActionButtons = ({
  actionType = "default",
  hasLocked=false,
}) => {
  const { setActiveModal } = useUIState()
  const { snapshotsSelected, vmsSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("vmsnapshot:create"), label: Localization.kr.CREATE, disabled: hasLocked, },
    { type: "update", onBtnClick: () => setActiveModal("vmsnapshot:preview"), label: "미리보기", disabled: vmsSelected.length !== 1 || snapshotsSelected.length === 0, },
    { type: "remove", onBtnClick: () => setActiveModal("vmsnapshot:remove"), label: Localization.kr.REMOVE, disabled: vmsSelected.length === 0 || snapshotsSelected.length === 0, },
    { type: "move", onBtnClick: () => setActiveModal("vmsnapshot:move"), label: Localization.kr.MOVE, disabled: vmsSelected.length === 0 || snapshotsSelected.length === 0, },
  ];

  Logger.debug(`VmSnapshotActionButtons ... datacentersSelected.length: ${vmsSelected.length}, isContextMenu: ${isContextMenu} `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default VmSnapshotActionButtons
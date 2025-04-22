import React, { useMemo } from 'react'
import useUIState from '../../hooks/useUIState';
import useGlobal from '../../hooks/useGlobal';
import ActionButtonGroup from '../button/ActionButtonGroup';
import Localization from '../../utils/Localization';
import Logger from '../../utils/Logger';


/**
 * @name VmSnapshotActionButtons
 * @description 가상머신 스냅샷 관련 액션버튼
 * 
 * @returns {JSX.Element} VmSnapshotActionButtons
 * 
 * @see VmSnapshotModals
 */
const VmSnapshotActionButtons = ({
  actionType = "default",
  hasLocked=false,
}) => {
  const { setActiveModal } = useUIState()
  const { vmsSelected, snapshotsSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const basicActions = useMemo(() => ([
    { type: "create",   onBtnClick: () => setActiveModal("vmsnapshot:create"), label: Localization.kr.CREATE, disabled: hasLocked, },
    { type: "preview",  onBtnClick: () => setActiveModal("vmsnapshot:preview"), label: "미리보기", disabled: vmsSelected.length !== 1 || snapshotsSelected.length === 0, },
    { type: "move",     onBtnClick: () => setActiveModal("vmsnapshot:move"), label: Localization.kr.MOVE, disabled: vmsSelected.length === 0 || snapshotsSelected.length === 0, },
    { type: "remove",   onBtnClick: () => setActiveModal("vmsnapshot:remove"), label: Localization.kr.REMOVE, disabled: vmsSelected.length === 0 || snapshotsSelected.length === 0, },
  ]), [hasLocked, snapshotsSelected, vmsSelected]);

  Logger.debug(`VmSnapshotActionButtons ... datacentersSelected.length: ${vmsSelected.length}, isContextMenu: ${isContextMenu} `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default VmSnapshotActionButtons
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
  actionType="default",
  hasLocked=false,
}) => {
  const { setActiveModal } = useUIState()
  const { vmsSelected, snapshotsSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const vmSelected1st = [...vmsSelected][0] ?? null
  const isVmUp = useMemo(() => vmSelected1st?.status === "UP", [vmsSelected])
  const snapshotSelected1st =  [...snapshotsSelected][0] ?? null
  const isVmLocked = useMemo(() => vmSelected1st?.status === "LOCKED", [vmSelected1st]); // 안됨
  const isSnapshotInPreview = useMemo(() => [...snapshotsSelected]?.every((e) => e?.status === "in_preview"), [snapshotsSelected])

  const basicActions = useMemo(() => ([
    { type: "create",   onBtnClick: () => setActiveModal("vmsnapshot:create"), label: Localization.kr.CREATE, disabled: isContextMenu && snapshotsSelected.length > 0, },
    { type: "preview",  onBtnClick: () => setActiveModal("vmsnapshot:preview"), label: Localization.kr.PREVIEW, disabled: isVmUp || snapshotsSelected.length === 0 || isSnapshotInPreview, },
    { type: "commit",   onBtnClick: () => setActiveModal("vmsnapshot:commit"), label: Localization.kr.COMMIT, disabled: isVmUp || snapshotsSelected.length === 0 || !isSnapshotInPreview, },
    { type: "undo",     onBtnClick: () => setActiveModal("vmsnapshot:undo"), label: Localization.kr.UNDO, disabled: isVmUp || snapshotsSelected.length === 0 || !isSnapshotInPreview, },
    { type: "remove",   onBtnClick: () => setActiveModal("vmsnapshot:remove"), label: Localization.kr.REMOVE, disabled: vmsSelected.length === 0 || snapshotsSelected.length === 0, },
  ]), [snapshotsSelected, vmsSelected]);

  Logger.debug(`VmSnapshotActionButtons ... datacentersSelected.length: ${vmsSelected.length}, isContextMenu: ${isContextMenu} `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default VmSnapshotActionButtons
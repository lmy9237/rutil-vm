import React, { useMemo } from 'react'
import useUIState from '../../hooks/useUIState';
import useGlobal from '../../hooks/useGlobal';
import ActionButtonGroup from '../button/ActionButtonGroup';
import Localization from '../../utils/Localization';
import Logger from '../../utils/Logger';


/**
 * @name DiskSnapshotActionButtons
 * @description 디스크 스냅샷 관련 액션버튼
 * 
 * @returns {JSX.Element} DiskSnapshotActionButtons
 * 
 * @see VmSnapshotModals
 */
const DiskSnapshotActionButtons = ({
  actionType="default",
  hasLocked=false,
  inPreview=false,
}) => {
  const { setActiveModal } = useUIState()
  const { vmsSelected, snapshotsSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const vmSelected1st = [...vmsSelected][0] ?? null
  const isVmUp = useMemo(() => vmSelected1st?.status === "UP", [vmsSelected])
  const isVmPause = useMemo(() => vmSelected1st?.status === "SUSPENDED", [vmsSelected])
  const snapshotSelected1st =  [...snapshotsSelected][0] ?? null

  const basicActions = useMemo(() => ([
    // { type: "remove",   onBtnClick: () => setActiveModal("disksnapshot:remove"),  label: Localization.kr.REMOVE,  disabled: isVmUp || isVmPause || /*hasLocked || inPreview || vmsSelected.length === 0 || */ snapshotsSelected.length === 0, },
    // NOTE: 삭제처리를 직접 하지 않음으로 기능 배제
  ]), [hasLocked, snapshotsSelected, vmsSelected]);

  Logger.debug(`DiskSnapshotActionButtons ... vmsSelected.length: ${vmsSelected.length}, isContextMenu: ${isContextMenu} `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default DiskSnapshotActionButtons
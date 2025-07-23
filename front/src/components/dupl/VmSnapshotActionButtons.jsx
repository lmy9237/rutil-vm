import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";
import Logger from "@/utils/Logger";

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
  inPreview=false,
}) => {
  const { setActiveModal } = useUIState()
  const { vmsSelected, snapshotsSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])
  const selected1st = [...vmsSelected][0] ?? null

  const isVmUp = useMemo(() => selected1st?.status?.toUpperCase() === "UP", [actionType, vmsSelected])
  const isVmPause = useMemo(() => selected1st?.status?.toUpperCase() === "SUSPENDED", [actionType, vmsSelected])
  const isPreviewLockMode = inPreview; 

  const basicActions = useMemo(() => ([
    { type: "create",   onClick: () => setActiveModal("vmsnapshot:create"),  label: Localization.kr.CREATE,  disabled:isPreviewLockMode || hasLocked || ( isContextMenu && snapshotsSelected.length > 0 ), },
    { type: "preview",  onClick: () => setActiveModal("vmsnapshot:preview"), label: Localization.kr.PREVIEW, disabled:isPreviewLockMode  || isVmUp || isVmPause || hasLocked || inPreview || snapshotsSelected.length === 0, },
    { type: "commit",   onClick: () => setActiveModal("vmsnapshot:commit"),  label: Localization.kr.COMMIT,  disabled:!isPreviewLockMode  || isVmUp || isVmPause || hasLocked || snapshotsSelected.length === 0, },
    { type: "undo",     onClick: () => setActiveModal("vmsnapshot:undo"),    label: Localization.kr.UNDO,    disabled:!isPreviewLockMode  || isVmUp || isVmPause || hasLocked || snapshotsSelected.length === 0, },
    { type: "remove",   onClick: () => setActiveModal("vmsnapshot:remove"),  label: Localization.kr.REMOVE,  disabled: isPreviewLockMode  || isVmUp || isVmPause || hasLocked || inPreview || vmsSelected.length === 0 || snapshotsSelected.length === 0, },
  ]), [ isPreviewLockMode,hasLocked,snapshotsSelected,vmsSelected,isVmUp,isVmPause,isContextMenu,]);

  return (
    <ActionButtons actionType={actionType} 
      actions={basicActions}
    />
  );
};

export default React.memo(VmSnapshotActionButtons)
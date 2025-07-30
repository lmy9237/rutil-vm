import React, { useEffect, useMemo, useState } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { 
  ActionButtons,
  ActionButton,
} from "@/components/button/ActionButtons";
import { 
  useStorageDomain,
  useAllVmsFromDisk
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";


/**
 * @name DiskActionButtons
 * @description 디스크 관련 액션버튼
 * 
 * @returns {JSX.Element} DiskActionButtons
 * 
 * @see ActionButtons
 */
const DiskActionButtons = ({
  actionType = "default",
  hasConnectTemplate = false,
}) => {
  const { setActiveModal } = useUIState()
  const { disksSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType]);

  const selected1st = [...disksSelected][0] ?? null

  // 선택한 디스크의 스토리지도메인의 상태가 active가 아니면 이동/복사버튼 비활성화
  const domainId = selected1st?.storageDomainVo?.id;
  const { data: domain } = useStorageDomain(domainId);
  const domainNotActive = domain?.status?.toLowerCase() !== "active";
  
  const hasVmAtttached = disksSelected.every((e) => 
    e?.vmAttached || !!e?.connectVm?.name || false
  )

  const hasTemplateAtttached = disksSelected.every((e) => 
    e?.templateAttached || !!e?.connectTemplate?.name || false
  )
  const isInTransfer = disksSelected.every((e) => (
    !!e?.imageTransferType && (e?.imageTransferType || "").toUpperCase() == "upload".toUpperCase()
  ))
  const isTransferPaused = disksSelected.every((e) => (
    (e?.imageTransferPhase || "").toUpperCase() == "paused_system".toUpperCase()
  ))
  const isTransferInProgress = disksSelected.every((e) => (
    (e?.imageTransferPhase || "").toUpperCase() == "resuming".toUpperCase() || 
    (e?.imageTransferPhase || "").toUpperCase() == "transferring".toUpperCase()
  ))
  const isTransferInFinalizing = disksSelected.every((e) => (
    (e?.imageTransferPhase || "").toUpperCase() == "finalizing_success".toUpperCase() || 
    (e?.imageTransferPhase || "").toUpperCase() == "finalizing_failure".toUpperCase() ||
    (e?.imageTransferPhase || "").toUpperCase() == "finalizing_cleanup".toUpperCase() ||
    (e?.imageTransferPhase || "").toUpperCase() == "finished_success".toUpperCase() || 
    (e?.imageTransferPhase || "").toUpperCase() == "finished_failure".toUpperCase() ||
    (e?.imageTransferPhase || "").toUpperCase() == "finished_cleanup".toUpperCase()
  ))
  const isLocked = disksSelected.every((e) => (
    e?.statusCode.toUpperCase() == "LOCKED".toUpperCase()
  ))

  const basicActions = [
    { type: "create",  onClick: () => setActiveModal("disk:create"),      label: Localization.kr.CREATE, disabled: isContextMenu && disksSelected.length > 0 },
    { type: "upload",  onClick: () => setActiveModal("disk:upload"),      label: Localization.kr.UPLOAD, disabled: isContextMenu && disksSelected.length > 0 },
    { type: "update",  onClick: () => setActiveModal("disk:update"),      label: Localization.kr.UPDATE, disabled: disksSelected.length !== 1 || hasConnectTemplate || hasTemplateAtttached || isInTransfer || isLocked },
    
    { type: "remove",   onClick: () => setActiveModal("disk:remove"),     label: Localization.kr.REMOVE, disabled: disksSelected.length === 0 || domainNotActive || hasConnectTemplate || hasVmAtttached || hasTemplateAtttached || isInTransfer || isLocked },
    { type: "move",     onClick: () => setActiveModal("disk:move"),       label: Localization.kr.MOVE,   
      disabled: disksSelected.length === 0 || selected1st?.sharable || hasConnectTemplate  || domainNotActive },
    { type: "copy",    onClick: () => setActiveModal("disk:copy"),   label: Localization.kr.COPY,   
      disabled: disksSelected.length === 0 || selected1st?.sharable || domainNotActive }, 
  ];

  const uploadActions = [
    { type: "cancelit", onClick: () => setActiveModal("disk:cancelit"),   label: `${Localization.kr.UPLOAD} ${Localization.kr.CANCEL}`,
      disabled: disksSelected.length !== 1 || !isInTransfer || !isTransferPaused },
    { type: "pauseit", onClick: () => setActiveModal("disk:pauseit"),     label: `${Localization.kr.UPLOAD} ${Localization.kr.PAUSE}`,
      disabled: disksSelected.length !== 1 || !isInTransfer || isTransferInProgress || (isTransferPaused || isTransferInFinalizing) },
    { type: "resumeit", onClick: () => setActiveModal("disk:resumeit"),   label: `${Localization.kr.UPLOAD} ${Localization.kr.RESUME}`,
      disabled: disksSelected.length !== 1 || !isInTransfer || isTransferInProgress || !(isTransferPaused || isTransferInFinalizing) },
  ];

  return (
    <ActionButtons actionType={actionType}
      actions={isContextMenu 
          ? [...basicActions, ...uploadActions].slice(2)
          : [...basicActions, ...uploadActions]}
    />
  );
};

export default DiskActionButtons;

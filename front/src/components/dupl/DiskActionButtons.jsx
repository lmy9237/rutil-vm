import React, { useEffect, useMemo, useState } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";
import { useStorageDomain } from "@/api/RQHook";

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
  const domainId = selected1st?.storageDomain?.props?.id;
  const { data: domain } = useStorageDomain(domainId);
  const domainNotActive = domain?.status?.toLowerCase() !== "active";

  const basicActions = [
    { type: "create",  onClick: () => setActiveModal("disk:create"), label: Localization.kr.CREATE, disabled: isContextMenu && disksSelected.length > 0 },
    { type: "upload",  onClick: () => setActiveModal("disk:upload"), label: Localization.kr.UPLOAD, disabled: isContextMenu && disksSelected.length > 0 },
    { type: "update",  onClick: () => setActiveModal("disk:update"), label: Localization.kr.UPDATE, 
      disabled: disksSelected.length !== 1 || hasConnectTemplate },
    { type: "remove",  onClick: () => setActiveModal("disk:remove"), label: Localization.kr.REMOVE, disabled: disksSelected.length === 0 || hasConnectTemplate || domainNotActive},
    { type: "move",    onClick: () => setActiveModal("disk:move"),   label: Localization.kr.MOVE,   
      disabled: disksSelected.length === 0 || selected1st?.sharable || hasConnectTemplate  || domainNotActive},
    { type: "copy",    onClick: () => setActiveModal("disk:copy"),   label: Localization.kr.COPY,   
      disabled: disksSelected.length === 0 || selected1st?.sharable || domainNotActive}, 
  ];

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default DiskActionButtons;

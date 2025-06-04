import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

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
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const selected1st = [...disksSelected][0] ?? null

  // 공유가능일때 이동,복사 버튼 비활성화(sharable)
  const basicActions = [
    { type: "create",  onClick: () => setActiveModal("disk:create"), label: Localization.kr.CREATE, disabled: isContextMenu && disksSelected.length > 0 },
    { type: "upload",  onClick: () => setActiveModal("disk:upload"), label: Localization.kr.UPLOAD, disabled: isContextMenu && disksSelected.length > 0 },
    { type: "update",  onClick: () => setActiveModal("disk:update"), label: Localization.kr.UPDATE, 
      disabled: disksSelected.length !== 1 || hasConnectTemplate },
    { type: "remove",  onClick: () => setActiveModal("disk:remove"), label: Localization.kr.REMOVE, 
      disabled: disksSelected.length === 0 || hasConnectTemplate },
    { type: "move",    onClick: () => setActiveModal("disk:move"),   label: Localization.kr.MOVE,   
      disabled: disksSelected.length === 0 || selected1st?.sharable || hasConnectTemplate },
    { type: "copy",    onClick: () => setActiveModal("disk:copy"),   label: Localization.kr.COPY,   
      disabled: disksSelected.length === 0 || selected1st?.sharable  },
  ];

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default DiskActionButtons;

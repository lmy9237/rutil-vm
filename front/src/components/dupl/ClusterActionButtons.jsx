import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

/**
 * @name ClusterActionButtons
 * @description 클러스터 관련 액션버튼
 * 
 * @returns {JSX.Element} ClusterActionButtons
 * 
 * @see ActionButtons
 */
const ClusterActionButtons = ({ 
  actionType="default"
}) => {
  const { setActiveModal, } = useUIState()
  const { clustersSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const selected1st = [...clustersSelected][0] ?? null

  const basicActions = useMemo(() => [
    { type: "create", onClick: () => setActiveModal("cluster:create"), label: Localization.kr.CREATE, disabled: isContextMenu && clustersSelected.length > 0 },
    { type: "update", onClick: () => setActiveModal("cluster:update"), label: Localization.kr.UPDATE, disabled: clustersSelected.length !== 1, },
    { type: "remove", onClick: () => setActiveModal("cluster:remove"), label: Localization.kr.REMOVE, disabled: clustersSelected.length === 0, },
  ], [actionType, clustersSelected]);

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default ClusterActionButtons;

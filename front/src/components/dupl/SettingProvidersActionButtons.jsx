import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

/**
 * @name SettingProvidersActionButtons
 * @description 공급자 관리 관련 액션버트
 *
 * @prop {string} actionType
 * 
 * @returns {JSX.Element} SettingProvidersActionButtons
 * 
 * @see ActionButtons
 */
const SettingProvidersActionButtons = ({
  actionType="default",
}) => {
  const { setActiveModal } = useUIState()
  const { providersSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const basicActions = useMemo(() => ([
    { type: "create",         onClick: () => setActiveModal("provider:create"), label: Localization.kr.CREATE, disabled: isContextMenu && providersSelected.length > 0, },
    { type: "update",         onClick: () => setActiveModal("provider:update"), label: Localization.kr.UPDATE, disabled: providersSelected.length !== 1, },
    { type: "remove",         onClick: () => setActiveModal("provider:remove"), label: Localization.kr.REMOVE, disabled: providersSelected.length === 0, },
  ]), [actionType, providersSelected]);

  return (
    <ActionButtons actionType={actionType} 
      actions={basicActions}
    />
  );
};

export default React.memo(SettingProvidersActionButtons);

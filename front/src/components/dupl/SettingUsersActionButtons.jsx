import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

/**
 * @name SettingUsersActionButtons
 * @description 사용자 관리 관련 액션버트
 *
 * @prop {string} actionType
 * 
 * @returns {JSX.Element} SettingUsersActionButtons
 * 
 * @see ActionButtons
 */
const SettingUsersActionButtons = ({
  actionType="default",
}) => {
  const { setActiveModal } = useUIState()
  const { usersSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const basicActions = useMemo(() => ([
    { type: "create",         onClick: () => setActiveModal("user:create"), label: Localization.kr.CREATE, disabled: isContextMenu && usersSelected.length > 0, },
    { type: "update",         onClick: () => setActiveModal("user:update"), label: Localization.kr.UPDATE, disabled: usersSelected.length !== 1, },
    { type: "changePassword", onClick: () => setActiveModal("user:changePassword"), label: '비밀번호변경', disabled: usersSelected.length !== 1, },
    { type: "remove",         onClick: () => setActiveModal("user:remove"), label: Localization.kr.REMOVE, disabled: usersSelected.length === 0, },
  ]), [actionType, usersSelected]);

  return (
    <ActionButtons actionType={actionType} 
      actions={basicActions}
    />
  );
};

export default React.memo(SettingUsersActionButtons);

import React, { useMemo } from "react";
import useUIState from "../../hooks/useUIState";
import ActionButtonGroup from "../../components/button/ActionButtonGroup";
import Localization from "../../utils/Localization";
import useGlobal from "../../hooks/useGlobal";

/**
 * @name SettingUsersActionButtons
 * @description ...
 *
 * @prop {boolean} isEditDisabled ...
 * @prop {string} status ...
 * @prop {string} type
 * @returns {JSX.Element} SettingUsersActionButtons
 *
 */
const SettingUsersActionButtons = ({
  actionType = 'default',
}) => {
  const { setActiveModal } = useUIState()
  const { usersSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const basicActions = useMemo(() => ([
    { type: "create", onBtnClick: () => setActiveModal("user:create"), label: Localization.kr.CREATE, disabled: isContextMenu && usersSelected.length > 0, },
    { type: "update", onBtnClick: () => setActiveModal("user:update"), label: Localization.kr.UPDATE, disabled: usersSelected.length !== 1, },
    { type: "changePassword", onBtnClick: () => setActiveModal("user:changePassword"), label: '비밀번호변경', disabled: usersSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("user:remove"), label: Localization.kr.REMOVE, disabled: usersSelected.length === 0, },
  ]), [actionType, usersSelected]);

  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default React.memo(SettingUsersActionButtons);

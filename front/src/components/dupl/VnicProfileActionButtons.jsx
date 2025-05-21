import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

/**
 * @name VnicProfileActionButtons
 * @description vNIC 프로필 관련 액션버튼
 * 
 * @returns {JSX.Element} VnicProfileActionButtons
 * 
 * @see ActionButtons
 */
const VnicProfileActionButtons = ({
  actionType="default"
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { vnicProfilesSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const selected1st = [...vnicProfilesSelected][0] ?? null
  const basicActions = [
    { type: "create", onClick: () => setActiveModal("vnicprofile:create"), label: Localization.kr.CREATE, disabled: vnicProfilesSelected.length > 0, },
    { type: "update", onClick: () => setActiveModal("vnicprofile:update"), label: Localization.kr.UPDATE, disabled: vnicProfilesSelected.length !== 1, },
    { type: "remove", onClick: () => setActiveModal("vnicprofile:remove"), label: Localization.kr.REMOVE, disabled: vnicProfilesSelected.length === 0, },
  ];

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default VnicProfileActionButtons;

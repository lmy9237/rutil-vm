import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons, ActionButton } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

const NetworkActionButtons = ({
  actionType="default",
}) => {
  const navigate = useNavigate();
  const { setActiveModal } = useUIState()
  const { networksSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const selected1st = [...networksSelected][0] ?? null

  const basicActions = [
    { type: "create", onClick: () => setActiveModal("network:create"), label: Localization.kr.CREATE, disabled: isContextMenu && networksSelected.length > 0, },
    { type: "import", onClick: () => setActiveModal("network:import"), label: Localization.kr.IMPORT, disabled: true, },
    { type: "update", onClick: () => setActiveModal("network:update"), label: Localization.kr.UPDATE, disabled: networksSelected.length !== 1, },
    { type: "remove", onClick: () => setActiveModal("network:remove"), label: Localization.kr.REMOVE, disabled: networksSelected.length === 0, },
  ];

  return (
    <>
      <ActionButtons actionType={actionType} 
        actions={isContextMenu ? basicActions.slice(2) : basicActions}
      >
        {!isContextMenu && (
          <ActionButton label={Localization.kr.VNIC_PROFILE}
            onClick={() => navigate("/vnicProfiles")}
            actionType={actionType}
          />
        )}
      </ActionButtons>
    </>
  );
};

export default NetworkActionButtons;

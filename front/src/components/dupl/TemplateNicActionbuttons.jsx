import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

/**
 * @name TemplateNicActionbuttons
 * @description 템플릿 논리 네트워크 관련 액션버튼
 * 
 * @returns {JSX.Element} TemplateNicActionbuttons
 * 
 * @see ActionButtons
 */
const TemplateNicActionbuttons = ({
  actionType="default",
}) => {
  const { setActiveModal } = useUIState()
  const { nicsSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const selected1st = [...nicsSelected][0] ?? null
  const basicActions = useMemo(() => ([
    { type: "create", onClick: () => setActiveModal("templatenic:create"), label: Localization.kr.CREATE, disabled: isContextMenu && nicsSelected.length > 0, },
    { type: "update", onClick: () => setActiveModal("templatenic:update"), label: Localization.kr.UPDATE, disabled: nicsSelected.length !== 1, },
    { type: "remove", onClick: () => setActiveModal("templatenic:remove"), label: Localization.kr.REMOVE, disabled: nicsSelected.length === 0, },
  ]), [actionType, nicsSelected]);

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default React.memo(TemplateNicActionbuttons);
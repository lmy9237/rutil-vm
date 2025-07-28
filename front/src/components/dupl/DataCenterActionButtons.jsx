import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";
import Logger from "@/utils/Logger";

/**
 * @name DataCenterActionButtons
 * @description 데이터센터 관련 액션버튼
 * 
 * @prop {string} actionType
 * 
 * @returns {JSX.Element} DataCenterActionButtons
 * 
 * @see ActionButtons
 */
const DataCenterActionButtons = ({
  actionType="default"
}) => {
  const { setActiveModal } = useUIState()
  const { datacentersSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const selected1st = [...datacentersSelected][0] ?? null

  const isUp = selected1st?.status === "up";

  const basicActions = useMemo(() => [
    { type: "create", onClick: () => setActiveModal("datacenter:create"), label: Localization.kr.CREATE, disabled: isContextMenu && datacentersSelected.length > 0, },
    { type: "update", onClick: () => setActiveModal("datacenter:update"), label: Localization.kr.UPDATE, disabled: datacentersSelected.length !== 1, },
    { type: "remove", onClick: () => setActiveModal("datacenter:remove"), label: Localization.kr.REMOVE, disabled: datacentersSelected.length === 0 || isUp,},
  ], [actionType, datacentersSelected , isUp]);

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
}; 

export default DataCenterActionButtons;

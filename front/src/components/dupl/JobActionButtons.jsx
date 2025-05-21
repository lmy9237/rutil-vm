import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useContextMenu from "@/hooks/useContextMenu";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

/**
 * @name JobActionButtons
 * @description 최근작업 관련 액션버튼
 * 
 * @returns {JSX.Element} JobActionButtons
 * 
 * @see ActionButtons
 */
const JobActionButtons = ({
  actionType="default"
}) => {
  const navigate = useNavigate();
  const { clearAllContextMenu } = useContextMenu()
  const { setActiveModal } = useUIState()
  const { jobsSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])
  
  const selected1st = [...jobsSelected][0] ?? null

  const basicActions = [
    { type: "remove",  onClick: () => setActiveModal("job:remove"), label: Localization.kr.REMOVE, disabled: jobsSelected.length === 0 },
  ];

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default JobActionButtons;

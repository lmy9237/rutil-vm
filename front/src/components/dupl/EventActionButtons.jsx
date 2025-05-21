import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
import { useToast }           from "@/hooks/use-toast";
import useUIState         from "@/hooks/useUIState";
import useContextMenu     from "@/hooks/useContextMenu";
import useGlobal          from "@/hooks/useGlobal";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { ActionButtons }  from "@/components/button/ActionButtons";
import Localization       from "@/utils/Localization";
import Logger             from "@/utils/Logger";

/**
 * @name EventActionButtons
 * @description 이벤트 관련 액션버튼
 * 
 * @returns {JSX.Element} EventActionButtons
 * 
 * @see ActionButtons
 */
const EventActionButtons = ({
  actionType="default"
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearAllContextMenu } = useContextMenu()
  const { setActiveModal } = useUIState()
  const { eventsSelected } = useGlobal()
  const descriptions = useMemo(() => (
    [...eventsSelected]
      .map((e) => e?.description ?? "")
      .join("\n")
    ), [eventsSelected])
  const [copied, copy] = useCopyToClipboard(descriptions)
  const handleMsgCopy = useCallback(() => {
    Logger.debug(`EventActionButtons > handleMsgCopy ... }`)
    clearAllContextMenu()
    copy()
    toast({ 
      title: `작업완료`,
      description:`메시지복사 완료 \n${descriptions}` 
    })
  }, [eventsSelected])
  
  const basicActions = [
    { type: "copyMsg", onClick: () => handleMsgCopy(), label: "메시지복사", disabled: eventsSelected.length === 0 },
    { type: "remove",  onClick: () => setActiveModal("event:remove"), label: Localization.kr.REMOVE, disabled: eventsSelected.length === 0 },
  ];

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default EventActionButtons;

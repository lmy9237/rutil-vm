import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useContextMenu from "../../hooks/useContextMenu";
import useGlobal from "../../hooks/useGlobal";
import useUIState from "../../hooks/useUIState";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import ActionButtonGroup from "../button/ActionButtonGroup";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";


const EventActionButtons = ({
  actionType = "default"
}) => {
  const navigate = useNavigate();
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
    toast.success(`메시지복사 완료 \n${descriptions}`)
  }, [eventsSelected])
  
  const basicActions = [
    { type: "copyMsg", onBtnClick: () => handleMsgCopy(), label: "메시지복사", disabled: eventsSelected.length === 0 },
    { type: "remove",  onBtnClick: () => setActiveModal("event:remove"), label: Localization.kr.REMOVE, disabled: eventsSelected.length === 0 },
  ];

  return (
    <ActionButtonGroup actionType={actionType}
      actions={basicActions}
    />
  );
};

export default EventActionButtons;

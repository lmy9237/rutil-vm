import useGlobal from "../../hooks/useGlobal";
import useUIState from "../../hooks/useUIState";
import Localization from "../../utils/Localization";
import ActionButtonGroup from "../button/ActionButtonGroup";

const VmDiskActionButtons = ({
  actionType = "default",
}) => {
  const { setActiveModal } = useUIState()
  const { vmsSelected, disksSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const selected1st = [...disksSelected][0] ?? null
  
  const isOk = selected1st?.status === "OK";
  const isActive = selected1st?.status === "active";

  const basicActions = [
    { type: "create",      onBtnClick: () => setActiveModal("vmdisk:create"),     label: Localization.kr.CREATE,       disabled: isContextMenu && disksSelected.length > 0 },
    { type: "connect",     onBtnClick: () => setActiveModal("vmdisk:connect"),    label: Localization.kr.CONNECTION,   disabled: isContextMenu && disksSelected.length > 0 },
    { type: "update",      onBtnClick: () => setActiveModal("vmdisk:update"),     label: Localization.kr.UPDATE,       disabled: disksSelected.length !== 1, },
    { type: "remove",      onBtnClick: () => setActiveModal("vmdisk:remove"),     label: Localization.kr.REMOVE,       disabled: disksSelected.length === 0 || isActive, },
    { type: "activate",    onBtnClick: () => setActiveModal("vmdisk:activate"),   label: Localization.kr.ACTIVATE,     disabled: disksSelected.length === 0 || !isActive , },
    { type: "deactivate",  onBtnClick: () => setActiveModal("vmdisk:deactivate"), label: Localization.kr.DEACTIVATE,   disabled: disksSelected.length === 0 || isActive, },
    { type: "move",        onBtnClick: () => setActiveModal("vmdisk:move"),       label: Localization.kr.MOVE,         disabled: disksSelected.length === 0 || isActive, },
  ];

  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default VmDiskActionButtons;

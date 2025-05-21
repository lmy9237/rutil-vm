import useGlobal from "@/hooks/useGlobal";
import useUIState from "@/hooks/useUIState";
import { ActionButtons } from '@/components/button/ActionButtons';
import Localization from "@/utils/Localization";

/**
 * @name VmDiskActionButtons
 * @description 가상머신 디스크 관련 액션버튼
 * 
 * @returns {JSX.Element} VmDiskActionButtons
 * 
 * @see ActionButtons
 */
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
    { type: "create",      onClick: () => setActiveModal("vmdisk:create"),     label: Localization.kr.CREATE,       disabled: isContextMenu && disksSelected.length > 0 },
    { type: "connect",     onClick: () => setActiveModal("vmdisk:connect"),    label: Localization.kr.CONNECTION,   disabled: isContextMenu && disksSelected.length > 0 },
    { type: "update",      onClick: () => setActiveModal("vmdisk:update"),     label: Localization.kr.UPDATE,       disabled: disksSelected.length !== 1, },
    { type: "remove",      onClick: () => setActiveModal("vmdisk:remove"),     label: Localization.kr.REMOVE,       disabled: disksSelected.length === 0 || isActive, },
    { type: "activate",    onClick: () => setActiveModal("vmdisk:activate"),   label: Localization.kr.ACTIVATE,     disabled: disksSelected.length === 0 || !isActive , },
    { type: "deactivate",  onClick: () => setActiveModal("vmdisk:deactivate"), label: Localization.kr.DEACTIVATE,   disabled: disksSelected.length === 0 || isActive, },
    { type: "move",        onClick: () => setActiveModal("vmdisk:move"),       label: Localization.kr.MOVE,         disabled: disksSelected.length === 0 || isActive, },
  ];

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default VmDiskActionButtons;

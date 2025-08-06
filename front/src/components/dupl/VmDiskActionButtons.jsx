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
  const vm = vmsSelected[0] ?? null;
  const noneSelected = disksSelected.length === 0

  const isActive = selected1st?.active === true;
  const isOK = selected1st?.status?.toUpperCase() === "OK" ? "true" : "false";
  const isLocked = selected1st?.diskImageVo?.status?.toUpperCase() === "LOCKED";
  const isPoweringUp = vm?.status?.toUpperCase() === "POWERING_UP";
  const isRunningOrPaused = ["UP", "PAUSED", "SUSPENDED"].includes(vm?.status?.toUpperCase());

  const basicActions = [
    import.meta.env.DEV && { type: "create2",      onClick: () => setActiveModal("vmdisk:create2"),     label: `${Localization.kr.CREATE}2`,     disabled: false },
    import.meta.env.DEV && { type: "update2",      onClick: () => setActiveModal("vmdisk:update2"),     label: `${Localization.kr.UPDATE}2`,      disabled: isLocked || isPoweringUp || disksSelected.length !== 1},
    { type: "create",      onClick: () => setActiveModal("vmdisk:create"),     label: Localization.kr.CREATE,     disabled: false },
    { type: "connect",     onClick: () => setActiveModal("vmdisk:connect"),    label: Localization.kr.CONNECTION, disabled: false },
    { type: "update",      onClick: () => setActiveModal("vmdisk:update"),     label: Localization.kr.UPDATE,      disabled: isLocked || isPoweringUp || disksSelected.length !== 1},
    { type: "remove",      onClick: () => setActiveModal("vmdisk:remove"),     label: Localization.kr.REMOVE,     disabled: isLocked || noneSelected || isRunningOrPaused},
    { type: "activate",    onClick: () => setActiveModal("vmdisk:activate"),   label: Localization.kr.ACTIVATE,   disabled: isLocked || noneSelected || isActive },
    { type: "deactivate",  onClick: () => setActiveModal("vmdisk:deactivate"), label: Localization.kr.DEACTIVATE, disabled: isLocked || noneSelected || !isActive },
    { type: "move",        onClick: () => setActiveModal("vmdisk:move"),       label: Localization.kr.MOVE,       disabled: isLocked || noneSelected },
  ];
  return (
    <ActionButtons actionType={actionType}
      actions={isContextMenu ? basicActions.slice(2) : basicActions}
    />
  );
};

export default VmDiskActionButtons;

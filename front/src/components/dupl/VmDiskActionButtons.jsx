import useUIState from "../../hooks/useUIState";
import Localization from "../../utils/Localization";
import ActionButtonGroup from "../button/ActionButtonGroup";

const VmDiskActionButtons = ({
  isEditDisabled,
  isDeleteDisabled,
  status,  
  type = "default",
  actionType,
}) => {
  const { setActiveModal } = useUIState()
  const isOk = status === "OK";
  const isActive = status === "active";

  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("vmdisk:create"), label: Localization.kr.CREATE, },
    { type: "update", onBtnClick: () => setActiveModal("vmdisk:update"), label: Localization.kr.UPDATE, disabled: isEditDisabled , },
    { type: "remove", onBtnClick: () => setActiveModal("vmdisk:remove"), label: Localization.kr.REMOVE, disabled: isDeleteDisabled || isActive, },
    { type: "connect", onBtnClick: () => setActiveModal("vmdisk:connect"), label: Localization.kr.CONNECTION, },
    { type: "activate", onBtnClick: () => setActiveModal("vmdisk:activate"), label: "활성", disabled: isDeleteDisabled || isActive , },
    { type: "deactivate", onBtnClick: () => setActiveModal("vmdisk:deactivate"), label: "비활성", disabled: isDeleteDisabled || !isActive, },
    { type: "move", onBtnClick: () => setActiveModal("vmdisk:move"), label: Localization.kr.MOVE, disabled: isDeleteDisabled || isActive, },
  ];

  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default VmDiskActionButtons;

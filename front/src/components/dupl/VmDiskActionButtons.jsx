import Localization from "../../utils/Localization";
import ActionButtonGroup from "../button/ActionButtonGroup";

const VmDiskActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,  
  type = "default",
  actionType,
}) => {
  const isOk = status === "OK";
  const isActive = status === "active";

  const basicActions = [
    { type: "create", label: Localization.kr.CREATE, onBtnClick: () => openModal("create")  },
    { type: "connect", label: "연결", onBtnClick: () => openModal("connect")  },
    { type: "edit", label: Localization.kr.UPDATE, disabled: isEditDisabled , onBtnClick: () => openModal("edit") },
    { type: "delete", label: Localization.kr.REMOVE, disabled: isActive, onBtnClick: () => openModal("delete")  },
    { type: "activate", label: "활성", disabled: isDeleteDisabled || isActive , onBtnClick: () => openModal("activate") },
    { type: "deactivate", label: "비활성", disabled: isDeleteDisabled || !isActive, onBtnClick: () => openModal("deactivate") },
    { type: "move", label: "이동", disabled: isDeleteDisabled || isActive, onBtnClick: () => openModal("move")  },
  ];

  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />
  );
};

export default VmDiskActionButtons;

import Localization from "../../utils/Localization";
import ActionButtonGroup from "../button/ActionButtonGroup";

const TemplateActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  actionType = "default",
}) => {

  const basicActions = [
    { type: "edit", label: Localization.kr.UPDATE, disabled: isEditDisabled, onBtnClick: () => openModal("edit")  },
    { type: "delete", label: Localization.kr.REMOVE, disabled: isDeleteDisabled, onBtnClick: () => openModal("delete")  },
  ];

  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />
  );
};

export default TemplateActionButtons;

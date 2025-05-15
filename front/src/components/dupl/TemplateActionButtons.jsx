import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import Localization from "../../utils/Localization";
import ActionButtonGroup from "../button/ActionButtonGroup";
import Logger from "../../utils/Logger";
import CONSTANT from "../../Constants";

const TemplateActionButtons = ({
  actionType = "default",
}) => {
  const { setActiveModal, } = useUIState()
  const { templatesSelected } = useGlobal()

  const hasDefaultTemplate = 
    [...templatesSelected]?.filter((e) => e.id === CONSTANT.templateIdDefault)?.length > 0
  
  const basicActions = [
    { type: "update", onBtnClick: () => setActiveModal("template:update"), label: Localization.kr.UPDATE, disabled: templatesSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("template:remove"), label: Localization.kr.REMOVE, disabled: templatesSelected.length === 0 || hasDefaultTemplate, },
  ];

  Logger.debug(`TemplateActionButtons ... `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default TemplateActionButtons;

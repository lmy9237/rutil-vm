import CONSTANT          from "@/Constants";
import useUIState        from "@/hooks/useUIState";
import useGlobal         from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization      from "@/utils/Localization";
import Logger            from "@/utils/Logger";

/**
 * @name TemplateActionButtons
 * @description 탬플릿 관련 액션버튼
 * 
 * @returns {JSX.Element} TemplateActionButtons
 * 
 * @see ActionButtons
 */
const TemplateActionButtons = ({
  actionType="default",
}) => {
  const { setActiveModal, } = useUIState()
  const { templatesSelected } = useGlobal()

  const hasDefaultTemplate = [...templatesSelected]?.filter((e) => e.id === CONSTANT.templateIdDefault)?.length > 0
  
  const basicActions = [
    { type: "update", onClick: () => setActiveModal("template:update"), label: Localization.kr.UPDATE, disabled: templatesSelected.length !== 1, },
    { type: "remove", onClick: () => setActiveModal("template:remove"), label: Localization.kr.REMOVE, disabled: templatesSelected.length === 0 || hasDefaultTemplate, },
    { type: "addVm",  onClick: () => setActiveModal("vm:create"),       label: `새 ${Localization.kr.VM}`, disabled: true},//disabled: templatesSelected.length  !== 1,
  ];

  return (
    <ActionButtons actionType={actionType} 
      actions={basicActions}
    />
  );
};

export default TemplateActionButtons;

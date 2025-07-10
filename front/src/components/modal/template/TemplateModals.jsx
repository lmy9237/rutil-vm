import React from "react";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import TemplateEditModal                from "./TemplateEditModal";
import VmModal                          from "@/components/modal/vm/VmModal";
import DomainGetVmTemplateModal         from "@/components/modal/domain/DomainImportVmModal";
import DeleteModal                      from "@/utils/DeleteModal";
import {
  useDeleteTemplate 
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const TemplateModals = ({
  template,
}) => {
  const { activeModal, closeModal, } = useUIState()
  const { templatesSelected } = useGlobal()
  const modals = {
    update: (
      <TemplateEditModal isOpen={activeModal().includes("template:update")}
        onClose={() => closeModal("template:update")}
      />
    ), remove: (
      <DeleteModal isOpen={activeModal().includes("template:remove")}
        onClose={() => closeModal("template:remove")}
        label={Localization.kr.TEMPLATE}
        data={templatesSelected}
        api={useDeleteTemplate()}
        // navigation={''}
      />
    ), addVm: (
      <VmModal isOpen={activeModal().includes("vm:create")}
        onClose={() => closeModal("vm:create")}
        templateId={template?.id}
      />
    ), import: ( // 템플릿 가져오기모달 (도메인 상세페이지에 있음)
      <DomainGetVmTemplateModal
        isOpen={activeModal().includes("template:import")}
        onClose={() => closeModal("template:import")}
        type="template"
      />
    ),
  };
  
  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`vm:${key}`) || activeModal().includes(`template:${key}`)
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default TemplateModals;

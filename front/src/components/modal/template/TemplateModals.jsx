import React from "react";
import useUIState from "../../../hooks/useUIState";
import TemplateEditModal from "./TemplateEditModal";
import VmModal from "../../modal/vm/VmModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteTemplate } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import useGlobal from "../../../hooks/useGlobal";

const TemplateModals = ({
  template,
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { templatesSelected } = useGlobal()

  const modals = {
    update: (
      <TemplateEditModal isOpen={activeModal() === "template:update"}
        onClose={() => setActiveModal(null)}  
        editMode
        templateId={template?.id}
      />
    ), remove: (
      <DeleteModal isOpen={activeModal() === "template:remove"}
        onClose={() => setActiveModal(null)}
        label={"템플릿"}
        data={templatesSelected}
        api={useDeleteTemplate()}
        // navigation={''}
      />
    ), addVm: (
      <VmModal isOpen={activeModal() === "vm:create"}
        onClose={() => setActiveModal(null)}
      />
    ),
  };

  Logger.debug(`TemplateModals ... `)
  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default TemplateModals;

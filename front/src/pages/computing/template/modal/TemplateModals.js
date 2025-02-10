import React from "react";
import TemplateEditModal from './TemplateEditModal';
import TemplateDeleteModal from './TemplateDeleteModal';
// import VmModal from "../../vm/modal/VmModal";
import VmNewModal from "../../vm/modal/VmNewModal";
import DeleteModal from "../../../../utils/DeleteModal";
import { useDeleteTemplate } from "../../../../api/RQHook";

const TemplateModals = ({ activeModal, template, selectedTemplates = [], onClose }) => {
  const modals = {
    // create: (
    //   <span>..</span>
    // ),
    edit: (
      <TemplateEditModal
        editMode
        isOpen={activeModal === 'edit'}
        templateId={template?.id}
        onClose={onClose}
      />
    ),
    delete: (
      // <TemplateDeleteModal
      //   isOpen={activeModal === 'delete' }
      //   data={selectedTemplates}
      //   onClose={onClose}
      // />
      <DeleteModal
        isOpen={activeModal === 'delete' }
        onClose={onClose}
        label={'템플릿'}
        data={selectedTemplates}
        api={useDeleteTemplate()}
        // navigation={''}
      />
    ),
    addVm: (
      <VmNewModal
        isOpen={activeModal === 'create'} 
        onClose={onClose} 
      />
      // <VmModal
      //   isOpen={activeModal === 'addVm' }
      //   data={selectedTemplates}
      //   onClose={onClose}
      // />
    )
  };

  return (
    <>
      {Object.keys(modals).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default TemplateModals;

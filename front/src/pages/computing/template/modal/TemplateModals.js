import React from "react";
import TemplateEditModal from './TemplateEditModal';
import TemplateDeleteModal from './TemplateDeleteModal';
// import VmModal from "../../vm/modal/VmModal";
import VmNewModal from "../../vm/modal/VmNewModal";

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
      <TemplateDeleteModal
        isOpen={activeModal === 'delete' }
        data={selectedTemplates}
        onClose={onClose}
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

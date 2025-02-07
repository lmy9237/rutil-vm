import React from "react";
import DiskModal from "./DiskModal";
import DiskDeleteModal from "./DiskDeleteModal";
import DiskUploadModal from "./DiskUploadModal";
import DiskActionModal from "./DiskActionModal";
import '../css/MDisk.css'

const DiskModals = ({ activeModal, disk, selectedDisks = [], onClose }) => {
  const modals = {
    create: 
      <DiskModal
        isOpen={activeModal === 'create'} 
        onClose={onClose} 
      />,
    edit: (
      <DiskModal
        editMode
        isOpen={activeModal === 'edit'}
        diskId={disk?.id}
        onClose={onClose}
    />
    ),    
    delete: (
      <DiskDeleteModal
        isOpen={activeModal === 'delete' }
        data={selectedDisks}
        onClose={onClose}
      />
    ), 
    upload: (
      <DiskUploadModal
        isOpen={activeModal === 'upload'}
        onClose={onClose}
      />
    ), 
    action :(
      <DiskActionModal
        isOpen={['copy', 'move'].includes(activeModal)}
        action={activeModal}
        data={selectedDisks}
        onClose={onClose}
      />
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

export default DiskModals;

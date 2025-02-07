import React from "react";
import VnicProfileModal from "./VnicProfileModal.js";
import VnicProfileDeleteModal from "./VnicProfileDeleteModal.js";

const VnicProfileModals = ({ activeModal, vnicProfile, selectedVnicProfiles = [], networkId, onClose }) => {
  const modals = {
    create: 
      <VnicProfileModal
        isOpen={activeModal === 'create'} 
        networkId={networkId}
        onClose={onClose} 
      />,
    edit: (
      <VnicProfileModal
        editMode
        isOpen={activeModal === 'edit'}
        vnicProfileId={vnicProfile?.id}
        onClose={onClose}
    />
    ),
    delete: (
      <VnicProfileDeleteModal
        isOpen={activeModal === 'delete' }
        data={selectedVnicProfiles}
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

export default VnicProfileModals;

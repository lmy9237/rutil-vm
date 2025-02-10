import React from "react";
import NetworkModal from "./NetworkModal";
import NetworkDeleteModal from "./NetworkDeleteModal";
import NetworkImportModal from "./NetworkImportModal";
import DeleteModal from "../../../../utils/DeleteModal";
import { useDeleteNetwork } from "../../../../api/RQHook";

const NetworkModals = ({ activeModal, network, selectedNetworks = [], dcId, onClose }) => {
  const modals = {
    create: 
      <NetworkModal 
        isOpen={activeModal === 'create'} 
        dcId={dcId}
        onClose={onClose} 
      />,
    edit: (
      <NetworkModal
        editMode
        isOpen={activeModal === 'edit'}
        networkId={network?.id}
        onClose={onClose}
    />
    ),
    delete: (
      // <NetworkDeleteModal
      //   isOpen={activeModal === 'delete' }
      //   data={selectedNetworks}
      //   onClose={onClose}
      // />
      <DeleteModal
        isOpen={activeModal === 'delete' }
        onClose={onClose}
        label={'네트워크'}
        data={selectedNetworks}
        api={useDeleteNetwork()}
        // navigation={''}
      />
    ),
    import: (
      <NetworkImportModal
        isOpen={activeModal === 'import'}
        onClose={onClose}
        data={selectedNetworks}
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

export default NetworkModals;

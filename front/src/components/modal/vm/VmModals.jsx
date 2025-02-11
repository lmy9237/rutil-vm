import React from "react";
import VmDeleteModal from './VmDeleteModal';
import VmActionModal from './VmActionModal';
import VmSnapshotModal from './VmSnapshotModal';
import VmNewModal from './VmNewModal';
import VmAddTemplateModal from './VmAddTemplateModal';
import VmExportOVAModal from './VmExportOVAModal';

const VmModals = ({ activeModal, vm, selectedVms = [], onClose }) => {
  const modals = {
    create: (
      // <VmModal 
      //   isOpen={activeModal === 'create'} 
      //   onClose={onClose} 
      // />
      <VmNewModal
        isOpen={activeModal === 'create'} 
        onClose={onClose} 
      />
    ),
    edit: (
      // <VmModal
      //   editMode
      //   isOpen={activeModal === 'edit'}
      //   vmId={vm?.id}
      //   onClose={onClose}
      // />
      <VmNewModal
        editMode
        isOpen={activeModal === 'edit'} 
        vmId={vm?.id}
        onClose={onClose} 
      />
    ),
    delete: (
      <VmDeleteModal
        isOpen={activeModal === 'delete'}
        onClose={onClose}
        data={selectedVms}
      />
    ),
    templates:(
      <VmAddTemplateModal
        isOpen={activeModal === 'templates'}
        onRequestClose={onClose}
        selectedVm={vm} 
        vmId={vm?.id}
      />
    ),
    snapshot: (
      <VmSnapshotModal
        isOpen={activeModal === 'snapshot'}
        vmId={vm?.id}
        data={selectedVms}
        onClose={onClose}
      />
    ),
    ova:(
      <VmExportOVAModal
        isOpen={activeModal === 'ova'}
        onRequestClose={onClose}
        selectedVm={vm}
        vmId={vm?.id} 
      />
    ),
    action: (
      <VmActionModal
        isOpen={['start', 'pause', 'reboot', 'reset', 'shutdown', 'powerOff'].includes(activeModal)}
        action={activeModal}
        data={selectedVms}
        onClose={onClose}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmModals;

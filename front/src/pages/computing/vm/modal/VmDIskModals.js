import React from "react";
import { useVmById } from "../../../../api/RQHook";
import VmDiskConnectionModal from "./VmDiskConnectionModal";
import VmDiskModal from "./VmDiskModal";
import VmDiskActionModal from "./VmDiskActionModal";
import VmDiskDeleteModal from "./VmDiskDeleteModal";

const VmDiskModals = ({ activeModal, vmId, disk, selectedDisks = [], onClose }) => {
  const { data: vm } = useVmById(vmId);

  const modals = {
    create: 
      <VmDiskModal
        isOpen={activeModal === 'create'} 
        vm={vm}
        dataCenterId={vm?.dataCenterVo?.id}
        
        onClose={onClose} 
      />,
    edit: (
      <VmDiskModal
        editMode
        isOpen={activeModal === 'edit'}
        vm={vm}
        diskAttachment={disk}
        onClose={onClose}
      />
    ),    
    delete: (
      <VmDiskDeleteModal
        isOpen={activeModal === 'delete' }
        vmId={vmId}
        data={selectedDisks}
        onClose={onClose}
      />
    ), 
    connect: (
      <VmDiskConnectionModal
        isOpen={activeModal === 'connect'}
        vm={vm}
        dataCenterId={vm?.dataCenterVo?.id}
        onClose={onClose}
      />
    ), 
    activate: (
      <VmDiskActionModal
        isOpen={activeModal === 'activate'}
        action={'activate'}
        onClose={onClose}
        vm={vm}
        data={selectedDisks}
      />
    ),
    deactivate: (
      <VmDiskActionModal
        isOpen={activeModal === 'deactivate'}
        action={'deactivate'}
        onClose={onClose}
        vm={vm}
        data={selectedDisks}
      />
    ),
    move: (
      <></>
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

export default VmDiskModals;

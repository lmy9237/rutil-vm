import React from "react";
import VmDeleteModal from "./VmDeleteModal";
import VmActionModal from "./VmActionModal";
import VmSnapshotModal from "./VmSnapshotModal";
import VmModal from "./VmModal";
import VmAddTemplateModal from "./VmAddTemplateModal";
import VmExportOVAModal from "./VmExportOVAModal";
import "./MVm.css";

const VmModals = ({ activeModal, vm, selectedVms = [], onClose }) => {
  const allModals = {
    create:    (<VmModal            isOpen={activeModal === "create"}    onClose={onClose} />),
    edit:      (<VmModal            isOpen={activeModal === "edit"}      onClose={onClose} vmId={vm?.id}  editMode/>),
    delete:    (<VmDeleteModal      isOpen={activeModal === "delete"}    onClose={onClose} data={selectedVms} />),
    templates: (<VmAddTemplateModal isOpen={activeModal === "templates"} onClose={onClose} selectedVm={vm} vmId={vm?.id}/>),
    snapshot:  (<VmSnapshotModal    isOpen={activeModal === "snapshot"}  onClose={onClose} vmId={vm?.id} data={selectedVms}  />),
    import:    (<></>),
    copy:      (<></>),
    migration: (<></>),    
    ova:       (<VmExportOVAModal   isOpen={activeModal === "ova"}       onClose={onClose} selectedVm={vm} vmId={vm?.id} />),
    action: (
      <VmActionModal
        isOpen={[
          "start",
          "pause",
          "reboot",
          "reset",
          "shutdown",
          "powerOff",
        ].includes(activeModal)}
        action={activeModal}
        data={selectedVms}
        onClose={onClose}
      />
    ),
  };

  return (
    <>
      {Object.keys(allModals).map((key) => (
        <React.Fragment key={key}>{allModals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmModals;

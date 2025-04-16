import React from "react";
import VmDeleteModal from "./VmDeleteModal";
import VmActionModal from "./VmActionModal";
import VmSnapshotModal from "./VmSnapshotModal";
import VmModal from "./VmModal";
import TemplateModal from "../template/TemplateModal";
import VmExportOVAModal from "./VmExportOVAModal";
import VmMigrationModal from "./VmMigrationModal";
import VmImportModal from "./VmImportModal";
import "./MVm.css";

const VmModals = ({ activeModal, vm, selectedVms = [], onClose }) => {
  const allModals = {
    create:    (<VmModal            isOpen={activeModal === "create"}    onClose={onClose} />),
    edit:      (<VmModal            isOpen={activeModal === "edit"}      onClose={onClose} vmId={vm?.id}  editMode/>),
    delete:    (<VmDeleteModal      isOpen={activeModal === "delete"}    onClose={onClose} data={selectedVms} />),
    templates: (<TemplateModal      isOpen={activeModal === "templates"} onClose={onClose} selectedVm={vm} />),
    snapshot:  (<VmSnapshotModal    isOpen={activeModal === "snapshot"}  onClose={onClose} selectedVm={vm}  />),
    import:    (<VmImportModal      isOpen={activeModal === "import"}    onClose={onClose}/>),  // 조건건바꿔야함
    // copy:      (<></>),  
    migration: (<VmMigrationModal   isOpen={activeModal === "migration"} onClose={onClose} selectedVms={selectedVms} />),    // 조건바꿔야함
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

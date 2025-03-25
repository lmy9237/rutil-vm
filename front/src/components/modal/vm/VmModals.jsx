import React from "react";
import VmDeleteModal from "./VmDeleteModal";
import VmActionModal from "./VmActionModal";
import VmSnapshotModal from "./VmSnapshotModal";
import VmConsoleModal from "./VmConsoleModal";
import VmModal from "./VmModal";
import TemplateModal from "../template/TemplateModal";
import VmExportOVAModal from "./VmExportOVAModal";
import "./MVm.css";
import VmMigrationModal from "./VmMigrationModal";
import VmImportModal from "./VmImportModal";


const VmModals = ({ activeModal, vm, selectedVms = [], onClose }) => {
  const allModals = {
    create:    (<VmModal            isOpen={activeModal === "create"}    onClose={onClose} />),
    edit:      (<VmModal            isOpen={activeModal === "edit"}      onClose={onClose} vmId={vm?.id}  editMode/>),
    delete:    (<VmDeleteModal      isOpen={activeModal === "delete"}    onClose={onClose} data={selectedVms} />),
    templates: (<TemplateModal      isOpen={activeModal === "templates"} onClose={onClose} selectedVm={vm} />),
    snapshot:  (<VmSnapshotModal    isOpen={activeModal === "snapshot"}  onClose={onClose} vmId={vm?.id} data={selectedVms}  />),
    console:   (<VmConsoleModal     isOpen={activeModal === "console"}   onClose={onClose} />),
    import:    (<VmImportModal      isOpen={activeModal === "import"}   onClose={onClose}/>),  // 설정바꿔야함
    copy:      (<></>),  
    migration: (<VmMigrationModal     isOpen={activeModal === "migration"}   onClose={onClose}/>),    // 설정바꿔야함
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

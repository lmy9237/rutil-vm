import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import VmDeleteModal from "./VmDeleteModal";
import VmActionModal from "./VmActionModal";
import VmSnapshotModal from "./VmSnapshotModal";
import VmModal from "./VmModal";
import TemplateModal from "../template/TemplateModal";
import VmExportOVAModal from "./VmExportOVAModal";
import VmMigrationModal from "./VmMigrationModal";
import VmImportModal from "./VmImportModal";
import Logger from "../../../utils/Logger";
import "./MVm.css";

const VmModals = ({ 
  vm,
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { vmsSelected } = useGlobal()

  const allModals = {
    create: (
      <VmModal key={activeModal()} isOpen={activeModal() === "vm:create"}
        onClose={() => setActiveModal(null)}
      />
    ), update: (
      <VmModal key={activeModal()} isOpen={activeModal() === "vm:update"} 
        editMode
        vmId={vm?.id} 
        onClose={() => setActiveModal(null)}
      />
    ), remove: (
      <VmDeleteModal key={activeModal()} isOpen={activeModal() === "vm:remove"}
        data={vmsSelected} 
        onClose={() => setActiveModal(null)}
      />
    ), templates: (
      <TemplateModal key={activeModal()} isOpen={activeModal() === "vm:templates"}
        selectedVm={vm}
        onClose={() => setActiveModal(null)}
      />
    ), snapshot: (
      <VmSnapshotModal key={activeModal()} isOpen={activeModal() === "vm:snapshot"}
        selectedVm={vm}
        onClose={() => setActiveModal(null)}
      />
    ), import: (
      <VmImportModal key={activeModal()} isOpen={activeModal() === "vm:import"}
        onClose={() => setActiveModal(null)} // TODO: 조건바꿔야함
      />
    ), copy: (
      <>
      </>
    ), migration: (
      <VmMigrationModal key={activeModal()} isOpen={activeModal() === "vm:migration"}
        onClose={() => setActiveModal(null)}
      />
    ), ova: (
      <VmExportOVAModal key={activeModal()} isOpen={activeModal() === "vm:ova"}
        selectedVm={vm}
        vmId={vm?.id}
        onClose={() => setActiveModal(null)}  
      />
    ), action: (
      <VmActionModal key={activeModal()} 
        isOpen={[
          "vm:start",
          "vm:pause",
          "vm:reboot",
          "vm:reset",
          "vm:shutdown",
          "vm:powerOff",
        ].includes(activeModal())}
        action={activeModal()}
        data={vmsSelected}
        onClose={() => setActiveModal(null)}
      />
    ),
  };

  Logger.debug(`VmModals ...`)
  return (
    <>
      {Object.keys(allModals).map((key) => (
        <React.Fragment key={key}>{allModals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmModals;

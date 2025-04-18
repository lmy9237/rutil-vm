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
      <VmModal isOpen={activeModal() === "vm:create"}
        onClose={() => setActiveModal(null)}
      />
    ), update: (
      <VmModal isOpen={activeModal() === "vm:update"} 
        onClose={() => setActiveModal(null)}
        editMode
        vmId={vm?.id} 
      />
    ), remove: (
      <VmDeleteModal isOpen={activeModal() === "vm:remove"}
        onClose={() => setActiveModal(null)}
        data={vmsSelected} 
      />
    ), templates: (
      <TemplateModal isOpen={activeModal() === "vm:templates"}
        onClose={() => setActiveModal(null)}
        selectedVm={vm}
      />
    ), snapshot: (
      <VmSnapshotModal isOpen={activeModal() === "vm:snapshot"}
        onClose={() => setActiveModal(null)}
        selectedVm={vm}
      />
    ), import: (
      <VmImportModal isOpen={activeModal() === "vm:import"}
        onClose={() => setActiveModal(null)} // TODO: 조건건바꿔야함
      />
    ), copy: (
      <></>
    ), migration: (
      <VmMigrationModal isOpen={activeModal() === "vm:migration"}
        onClose={() => setActiveModal(null)}
      />
    ), ova: (
      <VmExportOVAModal isOpen={activeModal() === "vm:ova"}
        onClose={() => setActiveModal(null)}
        selectedVm={vm}
        vmId={vm?.id}
      />
    ), action: (
      <VmActionModal
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

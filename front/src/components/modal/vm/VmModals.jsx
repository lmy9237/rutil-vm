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

const ACTIONS = [
  "vm:start",
  "vm:pause",
  "vm:reboot",
  "vm:reset",
  "vm:shutdown",
  "vm:powerOff",
]
/**
 * @name VmModals
 * @description 가상머신 모달 모음
 * 
 * @returns {JSX.Element} VmModals
 */
const VmModals = ({ 
  vm,
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { vmsSelected } = useGlobal()

  const modals = {
    create: (
      <VmModal key={activeModal()} isOpen={activeModal() === "vm:create"}
        onClose={() => setActiveModal(null)}
      />
    ), update: (
      <VmModal key={activeModal()} isOpen={activeModal() === "vm:update"} 
        onClose={() => setActiveModal(null)}
        editMode
        vmId={vmsSelected[0]?.id ?? vm?.id} 
      />
    ), remove: (
      <VmDeleteModal key={activeModal()} isOpen={activeModal() === "vm:remove"}
        onClose={() => setActiveModal(null)}
        data={vmsSelected} 
      />
    ), templates: (
      <TemplateModal key={activeModal()} isOpen={activeModal() === "vm:templates"}
        onClose={() => setActiveModal(null)}
        selectedVm={vm} // TODO: 조건바꿔야함
      />
    ), snapshot: (
      <VmSnapshotModal key={activeModal()} isOpen={activeModal() === "vm:snapshot"}
        onClose={() => setActiveModal(null)}
        selectedVm={vm} // TODO: 조건바꿔야함
      />
    ), import: (
      <VmImportModal key={activeModal()} isOpen={activeModal() === "vm:import"}
        onClose={() => setActiveModal(null)} 
      />
    ), copy: (
      <></>
    ), migration: (
      <VmMigrationModal key={activeModal()} isOpen={activeModal() === "vm:migration"}
        onClose={() => setActiveModal(null)}
      />
    ), ova: (
      <VmExportOVAModal key={activeModal()} isOpen={activeModal() === "vm:ova"}
        onClose={() => setActiveModal(null)}  
        selectedVm={vm} // TODO: 조건바꿔야함
        vmId={vm?.id}
      />
    ), action: (
      <VmActionModal key={activeModal()} isOpen={ACTIONS.includes(activeModal())}
        onClose={() => setActiveModal(null)}
        action={activeModal()}
        data={vmsSelected}
      />
    ),
  };

  Logger.debug(`VmModals ...`)
  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `vm:${key}` || ACTIONS.includes(activeModal())
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmModals;

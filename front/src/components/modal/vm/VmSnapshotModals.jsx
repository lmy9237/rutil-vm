import React, { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import VmSnapshotModal from "./VmSnapshotModal";
import VmSnapshotActionModal from "./VmSnapshotActionModal";
import VmSnapshotDeleteModal from "./VmSnapshotDeleteModal";
import Logger from "../../../utils/Logger";

/**
 * @name VmSnapshotModals
 * @description 가상머신 스냅샷 관련 모달
 * 
 * @returns {JSX.Element} VmSnapshotModals
 * 
 * @see VmSnapshotActionButtons
 */
const VmSnapshotModals = ({
}) => {
  const ACTIONS = useMemo(() => ([
    "vmsnapshot:preview",
    "vmsnapshot:commit",
    "vmsnapshot:undo",
  ]), [])
  const { activeModal, closeModal } = useUIState()
  const { vmsSelected, snapshotsSelected, setSnapshotsSelected } = useGlobal()
  const modals = {
    create: (
      <VmSnapshotModal key={"vmsnapshot:create"} isOpen={activeModal().includes("vmsnapshot:create")}
        onClose={() => closeModal("vmsnapshot:create")} 
      />
    ), action: (
      <VmSnapshotActionModal key={activeModal()[0]} isOpen={ACTIONS.includes(activeModal()[0])} 
        onClose={() => closeModal(activeModal()[0])} 
      />
    ), remove: (
      <VmSnapshotDeleteModal key={"vmsnapshot:remove"} isOpen={activeModal().includes("vmsnapshot:remove")}
        onClose={() => closeModal("vmsnapshot:remove")} 
        vmId={vmsSelected[0]?.id}
        data={snapshotsSelected}
      />
    )
  }

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`vmsnapshot:${key}`) || 
        ACTIONS.includes(activeModal()[0])
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmSnapshotModals;

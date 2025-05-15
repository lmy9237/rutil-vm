import React, { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DiskSnapshotDeleteModal from "./DiskSnapshotDeleteModal";

/**
 * @name DiskSnapshotModals
 * @description 가상머신 스냅샷 관련 모달
 * 
 * @returns {JSX.Element} DiskSnapshotModals
 * 
 * @see VmSnapshotActionButtons
 */
const DiskSnapshotModals = ({
}) => {
  const ACTIONS = useMemo(() => ([
    "vmsnapshot:preview",
    "vmsnapshot:commit",
    "vmsnapshot:undo",
  ]), [])
  const { activeModal, closeModal } = useUIState()
  const { vmsSelected, snapshotsSelected, setSnapshotsSelected } = useGlobal()
  const modals = {
    remove: (
      <DiskSnapshotDeleteModal key={"disksnapshot:remove"} isOpen={activeModal().includes("disksnapshot:remove")}
        onClose={() => closeModal("disksnapshot:remove")}
        vmId={vmsSelected[0]?.id}
        data={snapshotsSelected}
      />
    )
  }

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`disksnapshot:${key}`) || ACTIONS.includes(activeModal())
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DiskSnapshotModals;

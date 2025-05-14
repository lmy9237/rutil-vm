import React, { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DiskSnapshotDeleteModal from "./DiskSnapshotDeleteModal";
import Logger from "../../../utils/Logger";

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
  const { activeModal, setActiveModal } = useUIState()
  const { vmsSelected, snapshotsSelected, setSnapshotsSelected } = useGlobal()
  const onModalClose = () => {
    setActiveModal(null)
    setSnapshotsSelected([])
  }
  const modals = {
    remove: (
      <DiskSnapshotDeleteModal isOpen={activeModal() === "disksnapshot:remove"}
        vmId={vmsSelected[0]?.id}
        data={snapshotsSelected}
        onClose={onModalClose}
      />
    )
  }

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `disksnapshot:${key}` || ACTIONS.includes(activeModal())
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DiskSnapshotModals;

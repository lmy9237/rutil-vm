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
  const { activeModal, setActiveModal } = useUIState()
  const { vmsSelected, snapshotsSelected, setSnapshotsSelected } = useGlobal()
  const onModalClose = () => {
    setActiveModal(null)
    setSnapshotsSelected([])
  }
  const modals = {
    create: (
      <VmSnapshotModal key={activeModal()} isOpen={activeModal() === "vmsnapshot:create"}
        onClose={onModalClose}
      />
    ), action: (
      <VmSnapshotActionModal key={activeModal()} isOpen={ACTIONS.includes(activeModal())}
        onClose={onModalClose}
      />
    ), remove: (
      <VmSnapshotDeleteModal isOpen={activeModal() === "vmsnapshot:remove"}
        vmId={vmsSelected[0]?.id}
        data={snapshotsSelected}
        onClose={onModalClose}
      />
    )
  }

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `vmsnapshot:${key}` || ACTIONS.includes(activeModal())
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmSnapshotModals;

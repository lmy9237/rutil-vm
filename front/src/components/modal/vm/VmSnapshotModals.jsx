import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import VmSnapshotModal from "./VmSnapshotModal";
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
  const { activeModal, setActiveModal } = useUIState()
  const { vmsSelected, snapshotsSelected } = useGlobal()
  
  const modals = {
    create: (
      <VmSnapshotModal key={activeModal()} isOpen={activeModal() === "vmsnapshot:create"}
        onClose={() => setActiveModal(null)}
      />
    ), preveiw: (
      Logger.warn("'스냅샷 미리보기' 기능 준비중 ...")
    ), move: (
      Logger.warn("'스냅샷 이동' 기능 준비중 ...")
    ), remove: (
      <VmSnapshotDeleteModal isOpen={activeModal() === "vmsnapshot:remove"}
        vmId={vmsSelected[0]?.id}
        data={snapshotsSelected}
        onClose={() => setActiveModal(null)}
      />
    )
  }

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `vmsnapshot:${key}`
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmSnapshotModals;

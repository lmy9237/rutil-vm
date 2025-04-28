import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DiskModal from "./DiskModal";
import DeleteModal from "../../../utils/DeleteModal";
import DiskUploadModal from "./DiskUploadModal";
import DiskActionModal from "./DiskActionModal";
import { useDeleteDisk } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import "./MDisk.css";

const ACTIONS = [
  "disk:copy",
  "disk:move"
]

const DiskModals = ({ 
  disk,
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { disksSelected } = useGlobal()

  const modals = {
    create: (
      <DiskModal isOpen={activeModal() === "disk:create"}
        onClose={() => setActiveModal(null)}
      />
    ), update: (
      <DiskModal key={activeModal()} isOpen={activeModal() === "disk:update"}
        onClose={() => setActiveModal(null)}
        editMode
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "disk:remove"}
        onClose={() => setActiveModal(null)}
        label={Localization.kr.DISK}
        data={disksSelected}
        api={useDeleteDisk(() => setActiveModal(null), () => setActiveModal(null))}
      />
    ), upload: (
      <DiskUploadModal key={activeModal()} isOpen={activeModal() === "disk:upload"} 
        onClose={() => setActiveModal(null)}
      />
    ), action: (
      <DiskActionModal key={activeModal()} isOpen={ACTIONS.includes(activeModal())}
        onClose={() => setActiveModal(null)}
        action={activeModal}
        data={disksSelected}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `disk:${key}` || ACTIONS.includes(activeModal())
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DiskModals;

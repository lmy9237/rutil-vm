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
  const { activeModal, closeModal } = useUIState()
  const { disksSelected } = useGlobal()

  const modals = {
    create: (
      <DiskModal key={"disk:create"} isOpen={activeModal().includes("disk:create")}
        onClose={() => closeModal("disk:create")}
      />
    ), update: (
      <DiskModal key={"disk:update"} isOpen={activeModal().includes("disk:update")} editMode 
        onClose={() => closeModal("disk:update")}
      />
    ), remove: (
      <DeleteModal key={"disk:remove"} isOpen={activeModal().includes("disk:remove")}
        onClose={() => closeModal("disk:remove")}
        label={Localization.kr.DISK}
        data={disksSelected}
        api={useDeleteDisk()}
      />
    ), upload: (
      <DiskUploadModal key={activeModal()} isOpen={activeModal().includes("disk:upload")} 
        onClose={() => closeModal("disk:upload")}
      />
    ), action: (
      <DiskActionModal key={activeModal()[0]} isOpen={ACTIONS.includes(activeModal())}
        onClose={() => closeModal(activeModal()[0])}
        action={activeModal}
        data={disksSelected}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`disk:${key}`) || ACTIONS.includes(activeModal())
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DiskModals;

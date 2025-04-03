import React from "react";
import DiskModal from "./DiskModal";
import DeleteModal from "../../../utils/DeleteModal";
import DiskUploadModal from "./DiskUploadModal";
import DiskActionModal from "./DiskActionModal";
import { useDeleteDisk } from "../../../api/RQHook";
import "./MDisk.css";
import Localization from "../../../utils/Localization";
import toast from "react-hot-toast";

const DiskModals = ({ 
  activeModal, 
  disk,
  selectedDisks = [], 
  onClose
}) => {
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DISK} 삭제 완료`);
  };

  const modals = {
    create: (
      <DiskModal 
        isOpen={activeModal === "create"} 
        onClose={onClose} 
      />
    ),
    edit: (
      <DiskModal 
        isOpen={activeModal === "edit"}
        editMode
        diskId={disk?.id}
        onClose={onClose}
      />
    ),
    delete: (
      <DeleteModal
        isOpen={activeModal === "delete"}
        label={"디스크"}
        data={selectedDisks}
        onClose={onClose}
        api={useDeleteDisk(onSuccess, () => onClose())}
      />
    ),
    upload: (
      <DiskUploadModal 
        isOpen={activeModal === "upload"} 
        onClose={onClose} 
      />
    ),
    action: (
      <DiskActionModal
        isOpen={["copy", "move"].includes(activeModal)}
        action={activeModal}
        data={selectedDisks}
        onClose={onClose}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DiskModals;

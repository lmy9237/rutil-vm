import React from "react";
import VmDiskConnectionModal from "./VmDiskConnectionModal";
import VmDiskModal from "./VmDiskModal";
import VmDiskActionModal from "./VmDiskActionModal";
import VmDiskDeleteModal from "./VmDiskDeleteModal";
import { useVmById } from "../../../api/RQHook";

/**
 * @name VmDiskModals
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const VmDiskModals = ({
  activeModal,
  disk,
  selectedDisks = [],
  vmId,
  onClose,
}) => {
  const { data: vm }  = useVmById(vmId);

  const modals = {
    create: (
      <VmDiskModal
        isOpen={activeModal === "create"}
        vmId={vmId || ""}
        dataCenterId={vm?.dataCenterVo?.id || ""}
        onClose={onClose}
      />
    ),
    edit: (
      <VmDiskModal
        editMode
        isOpen={activeModal === "edit"}
        vmId={vmId}
        diskAttachmentId={disk?.id}
        onClose={onClose}
      />
    ),
    delete: (
      <VmDiskDeleteModal
        isOpen={activeModal === "delete"}
        vmId={vmId || ""}
        data={selectedDisks}
        onClose={onClose}
      />
    ),
    connect: (
      <VmDiskConnectionModal
        isOpen={activeModal === "connect"}
        vmId={vmId}
        dataCenterId={vm?.dataCenterVo?.id || ""}
        onClose={onClose}
      />
    ),
    activate: (
      <VmDiskActionModal
        isOpen={activeModal === "activate"}
        action={"activate"}
        onClose={onClose}
        vmId={vmId}
        data={selectedDisks}
      />
    ),
    deactivate: (
      <VmDiskActionModal
        isOpen={activeModal === "deactivate"}
        action={"deactivate"}
        onClose={onClose}
        vmId={vmId}
        data={selectedDisks}
      />
    ),
    move: 
      <></>,
  };

  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
      {/* <span>dc: {vm?.dataCenterVo?.id} vm:{vmId}</span> */}
    </>
  );
};

export default VmDiskModals;

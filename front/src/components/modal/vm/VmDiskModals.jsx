import React from "react";
import VmDiskConnectionModal from "./VmDiskConnectionModal";
import VmDiskModal from "./VmDiskModal";
import VmDiskActionModal from "./VmDiskActionModal";
import { useDisksFromVM, useVmById } from "../../../api/RQHook";
import DeleteModal from "../../../utils/DeleteModal";

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
  const { data: diskAttachments = [] } = useDisksFromVM(vmId);

  // 부팅가능한 디스크 있는지 검색
  const hasBootableDisk = diskAttachments?.some((diskAttachment) => diskAttachment?.bootable === true);
  
  // 디스크 이름 뒤에 숫자 붙이기
  const diskCount = diskAttachments.filter((da) => {
    return da && da?.diskImageVo?.alias?.includes(`${vm?.name}_D`)
  })?.length+1 || 1;

  const modals = {
    create: (
      <VmDiskModal
        isOpen={activeModal === "create"}
        diskType={true}
        vmId={vmId || ""}
        vmName={`${vm?.name}_Disk${diskCount}`}
        dataCenterId={vm?.dataCenterVo?.id || ""}
        hasBootableDisk={hasBootableDisk}
        onClose={onClose}
      />
    ),
    edit: (
      <VmDiskModal
        isOpen={activeModal === "edit"}
        diskType={true}
        editMode
        vmId={vmId || ""}
        diskAttachmentId={disk?.id || ""}
        hasBootableDisk={hasBootableDisk}
        onClose={onClose}
      />
    ),
    delete: (
      <DeleteModal
        isOpen={activeModal === "delete"}
        label={"가상머신 디스크"}
        vmId={vmId || ""}
        data={selectedDisks}
        onClose={onClose}
      />
    ),
    connect: (
      <VmDiskConnectionModal
        isOpen={activeModal === "connect"}
        diskType={true}
        vmId={vmId}
        dataCenterId={vm?.dataCenterVo?.id || ""}
        hasBootableDisk={hasBootableDisk}
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
    </>
  );
};

export default VmDiskModals;

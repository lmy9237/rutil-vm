import React from "react";
import VmDiskConnectionModal from "./VmDiskConnectionModal";
import VmDiskModal from "./VmDiskModal";
import VmDiskActionModal from "./VmDiskActionModal";
import VmDiskDeleteModal from "./VmDiskDeleteModal";
import { useDisksFromVM, useVmById } from "../../../api/RQHook";

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
        vmId={vmId || ""}
        vmName={`${vm?.name}_Disk${diskCount}`}
        dataCenterId={vm?.dataCenterVo?.id || ""}
        onClose={onClose}
        hasBootableDisk={hasBootableDisk}
      />
    ),
    edit: (
      <VmDiskModal
        editMode
        isOpen={activeModal === "edit"}
        vmId={vmId || ""}
        diskAttachmentId={disk?.id || ""}
        onClose={onClose}
        hasBootableDisk={hasBootableDisk}
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
        hasBootableDisk={hasBootableDisk}
        diskType={true}
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

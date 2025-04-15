import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import VmDiskConnectionModal from "./VmDiskConnectionModal";
import VmDiskModal from "./VmDiskModal";
import VmDiskActionModal from "./VmDiskActionModal";
import VmDiskDeleteModal from "./VmDiskDeleteModal";
import { useDisksFromVM, useVm } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";


/**
 * @name VmDiskModals
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const VmDiskModals = ({
  disk,
  vmId,
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { disksSelected, setDisksSelected } = useGlobal()

  const { data: vm }  = useVm(vmId);
  const { data: diskAttachments = [] } = useDisksFromVM(vmId);

  // 부팅가능한 디스크 있는지 검색
  const hasBootableDisk = diskAttachments?.some((diskAttachment) => diskAttachment?.bootable === true);
  
  // 디스크 이름 뒤에 숫자 붙이기
  const diskCount = diskAttachments.filter((da) => {
    return da && da?.diskImageVo?.alias?.includes(`${vm?.name}_D`)
  })?.length+1 || 1;

  const modals = {
    create: (
      <VmDiskModal isOpen={activeModal() === "vmdisk:create"}
        onClose={() => setActiveModal(null)}
        diskType={true}
        vmId={vmId || ""}
        vmName={`${vm?.name}_Disk${diskCount}`}
        dataCenterId={vm?.dataCenterVo?.id || ""}
        hasBootableDisk={hasBootableDisk}
        
      />
    ), update: (
      <VmDiskModal isOpen={activeModal() === "vmdisk:update"}
        onClose={() => setActiveModal(null)}  
        editMode
        diskType={true}
        vmId={vmId || ""}
        diskAttachmentId={disk?.id || ""}
        hasBootableDisk={hasBootableDisk}
        
      />
    ), remove: (
      <VmDiskDeleteModal isOpen={activeModal() === "vmdisk:remove"}
        onClose={() => setActiveModal(null)}  
        vmId={vmId || ""}
        data={disksSelected}
      />
    ), connect: (
      <VmDiskConnectionModal isOpen={activeModal() === "vmdisk:connect"}
        onClose={() => setActiveModal(null)}  
        diskType={true}
        vmId={vmId}
        dataCenterId={vm?.dataCenterVo?.id || ""}
        hasBootableDisk={hasBootableDisk}
      />
    ), activate: (
      <VmDiskActionModal isOpen={activeModal() === "vmdisk:activate"}
        onClose={() => setActiveModal(null)}  
        action={"activate"}
        vmId={vmId}
        data={disksSelected}
      />
    ), deactivate: (
      <VmDiskActionModal isOpen={activeModal() === "vmdisk:deactivate"}
        onClose={() => setActiveModal(null)}  
        action={"deactivate"}
        vmId={vmId}
        data={disksSelected}
      />
    ), move: (
      <></>
    ),
  };

  Logger.debug(`VmDiskModals ... `)
  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmDiskModals;

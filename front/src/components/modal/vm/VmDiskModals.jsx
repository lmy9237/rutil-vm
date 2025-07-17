import React, { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import VmDiskConnectionModal from "./VmDiskConnectionModal";
import VmDiskModal from "./VmDiskModal";
import VmDiskActionModal from "./VmDiskActionModal";
import VmDiskDeleteModal from "./VmDiskDeleteModal";
import { useDisksFromVM, useVm } from "../../../api/RQHook";
import VmDiskMoveModal from "./VmDiskMoveModal";


/**
 * @name VmDiskModals
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const VmDiskModals = ({
  disk,
}) => {
  const { activeModal, closeModal } = useUIState()
  const {
    vmsSelected, disksSelected
  } = useGlobal()
  const vmId = useMemo(() => 
    vmsSelected[0]?.id ?? ""
  , [vmsSelected])
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
      <VmDiskModal isOpen={activeModal().includes("vmdisk:create")}
        onClose={() => closeModal("vmdisk:create")}
        vmName={`${vm?.name}_Disk${diskCount}`}
        hasBootableDisk={hasBootableDisk}
      />
    ), update: (
      <VmDiskModal isOpen={activeModal().includes("vmdisk:update")} 
        onClose={() => closeModal("vmdisk:update")}
        editMode
        hasBootableDisk={hasBootableDisk}
      />
    ), remove: (
      <VmDiskDeleteModal isOpen={activeModal().includes("vmdisk:remove")}
        onClose={() => closeModal("vmdisk:remove")}
      />
    ), connect: (
      <VmDiskConnectionModal isOpen={activeModal().includes("vmdisk:connect")}
        onClose={() => closeModal("vmdisk:connect")}
        hasBootableDisk={hasBootableDisk}
      />
    ), activate: (
      <VmDiskActionModal isOpen={activeModal().includes("vmdisk:activate")}
        onClose={() => closeModal("vmdisk:activate")}
        action={"vmdisk:activate"}
        vmId={vmId}
        data={disksSelected}
      />
    ), deactivate: (
      <VmDiskActionModal isOpen={activeModal().includes("vmdisk:deactivate")}
        onClose={() => closeModal("vmdisk:deactivate")}
        action={"vmdisk:deactivate"}
        vmId={vmId}
        data={disksSelected}
      />
    ), move: (
      <VmDiskMoveModal isOpen={activeModal().includes("vmdisk:move")}
        onClose={() => closeModal("vmdisk:move")}
        action={"vmdisk:move"}
        data={disksSelected}
      />
    )
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`vmdisk:${key}`)
      ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VmDiskModals;

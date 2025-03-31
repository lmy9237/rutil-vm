import React, { useState } from "react";
import VmDiskDupl from "../../../components/dupl/VmDiskDupl";
import { useDisksFromVM } from "../../../api/RQHook";

/**
 * @name VmDisks
 * @description 가상머신에 종속 된 디스크 목록
 *
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmDisks
 */



const VmDisks = ({ vmId }) => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useDisksFromVM(vmId, (e) => ({ ...e }));

  // const [activeDiskType, setActiveDiskType] = useState("all"); // 필터링된 디스크 유형
  // const vmDisks = activeDiskType === "all" 
  //   ? disks 
  //   : disks.filter((disk) => disk.diskImageVo?.storageType?.toLowerCase() === activeDiskType)

  return (
    <>
   
      <VmDiskDupl
        isLoading={isDisksLoading}
        isError={isDisksError}
        isSuccess={isDisksSuccess}
        vmDisks={disks}
        // columns={
        //   activeDiskType === "all" 
        //     ? TableColumnsInfo.DISKS_FROM_VM 
        //     : activeDiskType === "image" 
        //       ? TableColumnsInfo.DISK_IMAGES_FROM_VM 
        //       : TableColumnsInfo.DISK_LUN_FROM_VM
        // }
        vmId={vmId}
      />
    </>
  );
};

export default VmDisks;

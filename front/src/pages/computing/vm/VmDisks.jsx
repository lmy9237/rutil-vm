import React, { useState } from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmDiskDupl from "../../../components/dupl/VmDiskDupl";
import { useDisksFromVM } from "../../../api/RQHook";
import FilterButton from "../../../components/button/FilterButton";

/**
 * @name VmDisks
 * @description 가상머신에 종속 된 디스크 목록
 *
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmDisks
 */

const diskFilters = [
  { key: "all", label: "모두" },
  { key: "image", label: "이미지" },
  { key: "lun", label: "직접 LUN" },
];

const VmDisks = ({ vmId }) => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useDisksFromVM(vmId, (e) => ({ ...e }));

  const [activeDiskType, setActiveDiskType] = useState("all"); // 필터링된 디스크 유형
  const vmDisks = activeDiskType === "all" 
    ? disks 
    : disks.filter((disk) => disk.diskImageVo?.storageType?.toLowerCase() === activeDiskType)

  return (
    <>
     <FilterButton
        options={diskFilters}
        activeOption={activeDiskType}
        onClick={setActiveDiskType}
      />
      <VmDiskDupl
        isLoading={isDisksLoading}
        isError={isDisksError}
        isSuccess={isDisksSuccess}
        vmDisks={ vmDisks }
        columns={
          activeDiskType === "all" 
            ? TableColumnsInfo.DISKS_FROM_VM 
            : activeDiskType === "image" 
              ? TableColumnsInfo.DISK_IMAGES_FROM_VM 
              : TableColumnsInfo.DISK_LUN_FROM_VM
        }
        vmId={vmId}
      />
    </>
  );
};

export default VmDisks;

import React, { useState } from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmDiskDupl from "../../../components/dupl/VmDiskDupl";
import { useDisksFromVM } from "../../../api/RQHook";

/**
 * @name VmDisks
 * @description 가상머신에 종속 된 디스크 목록
 *
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmDisks
 */

const diskTypes = [
  { type: "all", label: "모두" },
  { type: "image", label: "이미지" },
  { type: "lun", label: "직접 LUN" },
];

const VmDisks = ({ vmId }) => {
  const [activeDiskType, setActiveDiskType] = useState("all"); // 필터링된 디스크 유형
  
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useDisksFromVM(vmId, (e) => ({ ...e }));

  return (
    <>
      <div className="host-filter-btns" style={{ marginBottom: 0 }}>
        <span>디스크 유형: </span>
        {diskTypes.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setActiveDiskType(type)}
            className={activeDiskType === type ? "active" : ""}
          >
            {label}
          </button>
        ))}
      </div>

      <VmDiskDupl
        isLoading={isDisksLoading}
        isError={isDisksError}
        isSuccess={isDisksSuccess}
        vmDisks={
          activeDiskType === "all" ? disks 
          : disks.filter((disk) => disk.diskImageVo?.storageType?.toLowerCase() === activeDiskType)
        }
        columns={
          activeDiskType === "all" ? TableColumnsInfo.DISKS_FROM_VM 
          : activeDiskType === "image" ? TableColumnsInfo.DISK_IMAGES_FROM_VM 
          : TableColumnsInfo.DISK_LUN_FROM_VM
        }
        vmId={vmId}
      />
    </>
  );
};

export default VmDisks;

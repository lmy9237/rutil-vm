import React, { useState } from "react";
import { useAllVmsFromDisk } from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmTable from "../../computing/vm/VmTable";

/**
 * @name DiskVms
 * @description 디스크에 종속 된 가상머신 목록
 * (/storages/disks/<diskId>/vms)
 *
 * @param {string} diskId 디스크ID
 * @returns
 */
const DiskVms = ({ diskId }) => {
  const { 
    data: vms,
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useAllVmsFromDisk(diskId, (e) => ({
    ...e,
    status: e.status === "DOWN" ? "내려감" : e.status === "UP" ? "실행중" : e.status,
  }));

  const [selectedVms, setSelectedVms] = useState([]); // 선택된 VM

  console.log("...")
  return (
    <VmTable
      isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      columns={TableColumnsInfo.VMS_FROM_DISK}
      vms={vms || []}
      setSelectedVms={(selected) => {
        if (Array.isArray(selected)) setSelectedVms(selected); // 유효한 선택만 반영
      }}
    />
  );
};

export default DiskVms;

import React from "react";
import VmDiskDupl from "../../../components/dupl/VmDiskDupl";
import { useDisksFromVM } from "../../../api/RQHook";

/**
 * @name VmDisks
 * @description 가상머신에 종속 된 디스크 목록
 *
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmDisks
 */
const VmDisks = ({
  vmId
}) => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
  } = useDisksFromVM(vmId, (e) => ({ ...e }));
  
  return (
    <VmDiskDupl 
      vmDisks={disks} 
      refetch={refetchDisks}
      isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
    />
  );
};

export default VmDisks;

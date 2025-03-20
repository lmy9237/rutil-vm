import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useVmFromHost } from "../../../api/RQHook";
import VmDupl from "../../../components/dupl/VmDupl";

/**
 * @name HostVms
 * @description 호스트에 종속 된 가상머신 목록
 * (/computing/hosts/<hostId>/vms)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const HostVms = ({ hostId }) => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useVmFromHost(hostId, (e) => ({ ...e }));

  return (
    <>
      <VmDupl
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.VMS_FROM_HOST}
        vms={vms}
      />
    </>
  );
};

export default HostVms;

import React from "react";
import VmDupl from "../../../components/dupl/VmDupl";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useVMsFromDataCenter } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name DataCenterVms
 * @description 데이터센터에 종속 된 가상머신 목록
 * (/computing/datacenters/<datacenterId>/vms)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterVms = ({ datacenterId }) => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
    isRefetching: isVmsRefetching,
  } = useVMsFromDataCenter(datacenterId, (e) => ({ ...e }));

  return (
    <VmDupl columns={TableColumnsInfo.VMS}
      vms={vms}
      refetch={refetchVms} isRefetching={isVmsRefetching}
      isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
    />
  );
};

export default DataCenterVms;

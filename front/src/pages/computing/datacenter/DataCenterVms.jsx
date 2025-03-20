import React from "react";
import VmDupl from "../../../components/dupl/VmDupl";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useVMsFromDataCenter } from "../../../api/RQHook";

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
  } = useVMsFromDataCenter(datacenterId, (e) => ({ ...e }));

  console.log("...");
  return (
    <>
      <VmDupl
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.VMS}
        vms={vms}
      />
    </>
  );
};

export default DataCenterVms;

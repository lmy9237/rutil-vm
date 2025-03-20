import React from "react";
import VmDupl from "../../components/dupl/VmDupl";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import { useAllVMs } from "../../api/RQHook";

/**
 * @name Vms
 * @description 가상머신 전체
 *
 * @returns {JSX.Element} Vms
 */
const Vms = () => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useAllVMs((e) => ({ ...e }));

  return (
    <>
      <VmDupl
        isLoading={isVmsLoading}isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.VMS}
        vms={vms}
      />
    </>
  );
};

export default Vms;

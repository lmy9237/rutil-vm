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
    refetch: refetchVms,
  } = useAllVMs((e) => ({ ...e }));

  return (
    <VmDupl columns={TableColumnsInfo.VMS}
      vms={vms}
      refetch={refetchVms}
      isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
    />
  );
};

export default Vms;

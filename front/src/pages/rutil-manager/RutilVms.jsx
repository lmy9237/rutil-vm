import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import VmDupl from "../../components/dupl/VmDupl";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import { useAllVMs } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name RutilVms
 * @description 가상머신 전체
 * 경로: <메뉴>/rutil-manager/vms
 *
 * @returns {JSX.Element} RutilVms
 */
const RutilVms = () => {
  const { setVmsSelected } = useGlobal()
  
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
  } = useAllVMs((e) => ({ ...e }));
  
  useEffect(() => {
    return () => {
      Logger.debug("RutilVms > useEffect ... CLEANING UP");
      setVmsSelected([])
    }
  }, []);

  return (
    <VmDupl columns={TableColumnsInfo.VMS}
      vms={vms}
      refetch={refetchVms}
      isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
    />
  );
};

export default RutilVms;

import useGlobal              from "@/hooks/useGlobal";
import {
  useDashboardVm
} from "@/api/RQHook";
import HostGeneralChart from "../host/HostGeneralChart";
import { useEffect } from "react";

/**
 * @name VmApplications
 * @description 가상머신에 종속 된 애플리케이션 정보
 *
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmApplications
 */
const VmMonitor = ({
  vmId
}) => {
  const { vmsSelected, setVmsSelected } = useGlobal()
  
  const {
    data: vmPer,
    status: vmPerStatus,
    isRefetching: isVmPerRefetching,
    refetch: vmPerRefetch,
    isError: isVmPerError,
    error: vmPerError,
    isLoading: isVmPerLoading,
  } = useDashboardVm(vmId);

  useEffect(() => {
    if (vmId) {
      vmPerRefetch();
    }
  }, [vmId]);


  return (
    <>
      <div className="dupl-header-group f-start align-start gap-2 w-full">
        <HostGeneralChart per={vmPer}/>
      </div>
    </>
  );
};

export default VmMonitor;

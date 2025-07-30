import useGlobal              from "@/hooks/useGlobal";
import {
  useDashboardVm
} from "@/api/RQHook";
import HostGeneralChart from "../host/HostGeneralChart";
import { useEffect } from "react";
import VmMonitorChart from "./VmMonitorChart";

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

  const usageDto = vmsSelected?.[0]?.usageDto ?? {};

  useEffect(() => {
    if (vmId) {
      vmPerRefetch();
    }
  }, [vmId]);


  return (
    <>
    {/*TODO 디자인 검토 필요 */}
      <div className="dupl-header-group align-start gap-2 w-full ">
        <div className="f-start vm-monitor-outer">
          <div className="f-center">cpu사용률</div>
          <div className="w-full"><VmMonitorChart per={vmPer} usageValue={usageDto?.cpuPercent} metricKey="cpuPercent" metricName="CPU" color="#F0643B" /></div>
        </div>
        <VmMonitorChart per={vmPer} usageValue={usageDto?.memoryPercent} metricKey="memoryPercent" metricName="메모리" color="#30A9DE" />
        <VmMonitorChart per={vmPer} usageValue={usageDto?.networkPercent} metricKey="networkPercent" metricName="네트워크" color="#9BC53D" />
      </div>
    </>
  );
};

export default VmMonitor;

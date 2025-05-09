import { useEffect, useMemo } from "react";
import useGlobal from "../../../hooks/useGlobal";
import InfoTable from "../../../components/table/InfoTable";
import SemiCircleChart from "../../../components/Chart/SemiCircleChart";
import TableRowClick from "../../../components/table/TableRowClick";
import { useVm } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import CONSTANT from "../../../Constants";
import { convertBytesToMB } from "../../../util";
import { RVI16, rvi16Cluster, rvi16Host } from "../../../components/icons/RutilVmIcons";
import "./Vm.css"

/**
 * @name VmGeneral
 * @description 가상머신 일반정보
 * (/computing/vms/<vmId>)
 *
 * @param {string} vmId 가상머신 ID
 * @returns
 */
const VmGeneral = ({ 
  vmId
}) => {
  const { setVmsSelected, setClustersSelected, setHostsSelected } = useGlobal()
  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
  } = useVm(vmId);

  useEffect(() => {
    if (vm?.hostVo)
      setHostsSelected(vm?.hostVo)
    if (vm?.clusterVo)
      setClustersSelected(vm?.clusterVo)
    setVmsSelected(vm)
  }, [vm])

  const osLabel = useMemo(() => (
    CONSTANT.osOptions.find((e) => e.value === vm?.osType)?.label || vm?.osSystem
  ), [vm])
    
  const chipsetLabel = useMemo(() => (
    CONSTANT.chipsetOptions.find((option) => option.value === vm?.biosType)?.label || vm?.chipsetFirmwareType
  ), [vm])

  const generalTableRows = [
    { label: "전원상태", value: vm?.status },
    { label: Localization.kr.DESCRIPTION, value: vm?.description },
    { label: Localization.kr.UP_TIME, value: vm?.upTime },
    { label: "IP 주소", value: vm?.ipv4 },
    { label: "FQDN", value: vm?.fqdn },
    { label: "최적화 옵션", value: vm?.type },
    { label: Localization.kr.TIMEZONE, value: vm?.timeZone },
    {
      label: Localization.kr.CLUSTER,
      value: (
        <div className="related-object f-start">
          <RVI16 iconDef={rvi16Cluster("currentColor")} className="mr-1"/>
          <TableRowClick type="cluster" id={vm?.clusterVo?.id}>
            {vm?.clusterVo?.name}
          </TableRowClick>
        </div>
      ),
    }, {
      label: Localization.kr.HOST,
      value: (
        <div className="related-object f-start">
          {vm?.hostVo?.id ? (
            <>
              <RVI16 iconDef={rvi16Host("currentColor")} className="mr-1"/>
              <TableRowClick type="host" id={vm?.hostVo?.id}>
                {vm?.hostVo?.name}
              </TableRowClick>
            </>
          ) : ("N/A")}
        </div>
      ),
    }
  ];

  const hardwareTableRows = [
    { label: "운영 체제", value: osLabel },
    { label: "아키텍처", value: vm?.cpuArc },
    { label: "칩셋/펌웨어 유형", value: chipsetLabel },
    { label: "CPU", value: `${vm?.cpuTopologyCnt} (${vm?.cpuTopologySocket}:${vm?.cpuTopologyCore}:${vm?.cpuTopologyThread})` },
    { label: Localization.kr.MEMORY, value: `${convertBytesToMB(vm?.memorySize ?? 0)} MB` },
    { label: " 할당할 실제 메모리", value: `${convertBytesToMB(vm?.memoryGuaranteed ?? 0)}  MB` },
    { label: "", value: "" },
    { label: "게스트", value: "" },
    // { label: "- 에이전트", value: "" },
    { label: "- 아키텍처", value: vm?.guestArc },
    { label: "- 운영 시스템", value: vm?.guestOsType },
    { label: "- 커널 버전", value: vm?.guestKernelVer },
    { label: `- ${Localization.kr.TIMEZONE}`, value: vm?.guestTimeZone },
  ];

  return (
    <>
      <div className="vm-detail-general-boxs f-start w-full">
        {/* TODO: preview일 때 canvas 만 표출 되는 기능 개발 */}
        <div className="detail-general-box v-start gap-8">
          <h1 className="f-start fs-16 fw-500 w-full">{Localization.kr.GENERAL}</h1>
          <hr className="w-full"/>
          <InfoTable tableRows={generalTableRows} />
        </div>

        <div className="detail-general-box v-start gap-8">
          <h1 className="f-start fs-16 fw-500 w-full">{Localization.kr.VM} {Localization.kr.HARDWARE}</h1>
          <hr className="w-full"/>
          <InfoTable tableRows={hardwareTableRows} />
        </div>

        <div className="detail-general-box v-start gap-8">
          <h1 className="f-start fs-16 fw-500 w-full">용량 및 사용량</h1>
          <hr className="w-full"/>
          <div className="capacity-outer">
            <div className="capacity f-center">
              <span className="fs-14">CPU</span>
              <SemiCircleChart percentage={vm?.usageDto?.cpuPercent || 0} />
            </div>
            <div className="capacity f-center">
              <span className="fs-14">{Localization.kr.MEMORY}</span>
              <SemiCircleChart percentage={vm?.usageDto?.memoryPercent || 0} />
            </div>
            <div className="capacity f-center">
              <span className="fs-14">네트워크</span>
              <SemiCircleChart percentage={vm?.usageDto?.networkPercent || 0} />
            </div>
          </div>
        </div>
      </div>      
    </>
  );
};

export default VmGeneral;

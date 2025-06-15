import { useEffect, useMemo } from "react";
import CONSTANT                   from "@/Constants";
import useGlobal                  from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink     from "@/components/common/OVirtWebAdminHyperlink";
import { InfoTable }              from "@/components/table/InfoTable";
import TableRowClick              from "@/components/table/TableRowClick";
import SemiCircleChart            from "@/components/Chart/SemiCircleChart";
import {
  RVI16,
  rvi16Cluster,
  rvi16Host
} from "@/components/icons/RutilVmIcons";
import {
  useVm,
  useOsSystemsFromCluster,
  useAllBiosTypes,
} from "@/api/RQHook";
import { convertBytesToMB }       from "@/util";
import Localization               from "@/utils/Localization";
import "./Vm.css"
import VmOsIcon from "@/components/icons/VmOsIcon";

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
  const {
    vmsSelected, setVmsSelected, 
    clustersSelected, setClustersSelected,
    setHostsSelected
  } = useGlobal()
  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
  } = useVm(vmId);

  const { 
    data: osList = [], 
    isLoading: isOsListLoading,
  } = useOsSystemsFromCluster(clustersSelected[0]?.id, (e) => ({ ...e }));

  const {
    data: biosTypes=[],
    isLoading: isBiosTypesLoading,
  } = useAllBiosTypes((e) => ({ 
    ...e,
    value: e?.id,
    label: e?.kr
  }))
  
  useEffect(() => {
    if (vm?.hostVo)
      setHostsSelected(vm?.hostVo)
    if (vm?.clusterVo)
      setClustersSelected(vm?.clusterVo)
    setVmsSelected(vm)
  }, [vm])

  const osLabel = useMemo(() => (
    [...osList].find((e) => e?.name === vm?.osType)?.description
  ), [vmId, vm])
    
  const chipsetLabel = useMemo(() => (
    [...biosTypes].find((option) => option.value === vm?.biosType)?.label || vm?.biosType
  ), [vm])

  const generalTableRows = [
    { label: "전원상태", value: vm?.status },
    { label: Localization.kr.DESCRIPTION, value: vm?.description },
    { label: Localization.kr.UP_TIME, value: vm?.upTime },
    { label: "IP 주소", value: vm?.ipv4 },
    { label: "FQDN", value: vm?.fqdn },
    { label: Localization.kr.OPTIMIZATION_OPTION, value: vm?.optimizeOption },
    { label: Localization.kr.TIMEZONE, value: vm?.timeOffset },
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
          ) : (Localization.kr.NOT_ASSOCIATED)}
        </div>
      ),
    }
  ];

  const hardwareTableRows = [
    { label: Localization.kr.OPERATING_SYSTEM, value: osLabel },
    { label: Localization.kr.ARCH, value: vm?.cpuArc },
    { label: "칩셋/펌웨어 유형", value: chipsetLabel },
    { label: "CPU", value: `${vm?.cpuTopologyCnt} (${vm?.cpuTopologySocket}:${vm?.cpuTopologyCore}:${vm?.cpuTopologyThread})` },
    { label: Localization.kr.MEMORY, value: `${convertBytesToMB(vm?.memorySize ?? 0)} MB` },
    { label: " 할당할 실제 메모리", value: `${convertBytesToMB(vm?.memoryGuaranteed ?? 0)}  MB` },
    { label: "", value: "" },
    { label: "게스트", value: "" },
    { label: `- ${Localization.kr.ARCH}`, value: vm?.guestArc },
    { label: `- ${Localization.kr.OPERATING_SYSTEM}`, value: vm?.guestOsType },
    { label: "- 커널 버전", value: vm?.guestKernelVer },
    { label: `- ${Localization.kr.TIMEZONE}`, value: vm?.guestTimeZone },
  ];

  return (
    <>
      <VmOsIcon dataUrl={vm?.urlLargeIcon} />
      <div className="vm-detail-general-boxs f-start w-full">
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
        {vm?.runningOrPaused && (
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
        )}
      </div>
      
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-general;name=${vmsSelected[0]?.name}`} 
      />
      {/* <div className="f-btw w-full h-full">
        <div className="vm-general-boxs vm-general-box-first v-btw h-full">

          <div className="vm-general-box operating-system mb-3 h-[378px]">
            <h1 className="f-start fs-14 w-full">{Localization.kr.GENERAL}</h1>
            <hr className="w-full"/>
              <div className="flex">
                <div>이미지</div>
                <InfoTable tableRows={generalTableRows} />
              </div>
          </div>
          <div className="vm-hardware f-btw">
            <div className="vm-general-box w-[49.5%] h-[275px]">
              <h1 className="f-start fs-14 w-full">가상머신 하드웨어</h1>
              <hr className="w-full"/>
            </div>
            <div className="vm-general-box w-[49.5%] h-[275px]">
              <h1 className="f-start fs-14 w-full">관련 개체</h1>
              <hr className="w-full"/>
            </div>
          </div>

        </div>

        <div className="vm-general-boxs vm-general-boxs-second">
          
          <div className="vm-general-box operating-system mb-3">
            <h1 className="f-start fs-16 fw-500 w-full">{Localization.kr.GENERAL}</h1>
            <hr className="w-full"/>
              <div className="flex">
                <div>이미지</div>
                <InfoTable tableRows={generalTableRows} />
              </div>
          </div>
          <div className="vm-general-box h-full">
            <h1 className="f-start fs-16 fw-500 w-full">관련 개체</h1>
            <hr className="w-full"/>
          </div>

        </div>
      </div> */}
    </>
  );
};

export default VmGeneral;

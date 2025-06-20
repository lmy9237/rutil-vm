import { useEffect, useMemo } from "react";
import CONSTANT                   from "@/Constants";
import useGlobal                  from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink     from "@/components/common/OVirtWebAdminHyperlink";
import { InfoTable }              from "@/components/table/InfoTable";
import TableRowClick              from "@/components/table/TableRowClick";
import SemiCircleChart            from "@/components/Chart/SemiCircleChart";
import {
  RVI16,
  rvi16Desktop,
  rvi16DesktopFlag,
  status2Icon
} from "@/components/icons/RutilVmIcons";
import {
  useVm,
  useAllOpearatingSystemsFromCluster,
  useAllBiosTypes,
  useSnapshotsFromVM,
} from "@/api/RQHook";
import { convertBytesToMB }       from "@/util";
import Localization               from "@/utils/Localization";
import "./Vm.css"
import VmOsIcon from "@/components/icons/VmOsIcon";
import VmGeneralBarChart from "./VmGeneralBarChart";
import useUIState from "@/hooks/useUIState";
import GeneralLayout from "@/components/GeneralLayout";
import GeneralBoxProps from "@/components/common/GeneralBoxProps";

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
  } = useAllOpearatingSystemsFromCluster(clustersSelected[0]?.id, (e) => ({ ...e }));

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

  // const generalTableRows = [
  //   { label: "전원상태", value: vm?.status },
  //   { label: Localization.kr.DESCRIPTION, value: vm?.description },
  //   { label: Localization.kr.OPTIMIZATION_OPTION, value: vm?.optimizeOption },
  //   { label: Localization.kr.TIMEZONE, value: vm?.timeOffset },
  //   { label: Localization.kr.TIMEZONE, value: vm?.timeOffset },
  //   {
  //     label: Localization.kr.CLUSTER,
  //     value: (
  //       <div className="related-object f-start">
  //         <RVI16 iconDef={rvi16Cluster("currentColor")} className="mr-1"/>
  //         <TableRowClick type="cluster" id={vm?.clusterVo?.id}>
  //           {vm?.clusterVo?.name}
  //         </TableRowClick>
  //       </div>
  //     ),
  //   }, {
  //     label: Localization.kr.HOST,
  //     value: (
  //       <div className="related-object f-start">
  //         {vm?.hostVo?.id ? (
  //           <>
  //             <RVI16 iconDef={rvi16Host("currentColor")} className="mr-1"/>
  //             <TableRowClick type="host" id={vm?.hostVo?.id}>
  //               {vm?.hostVo?.name}
  //             </TableRowClick>
  //           </>
  //         ) : (Localization.kr.NOT_ASSOCIATED)}
  //       </div>
  //     ),
  //   }
  // ];

  // const hardwareTableRows = [
  //   { label: Localization.kr.OPERATING_SYSTEM, value: osLabel },
  //   { label: Localization.kr.ARCH, value: vm?.cpuArc },
  //   { label: "칩셋/펌웨어 유형", value: chipsetLabel },
  //   { label: "CPU", value: `${vm?.cpuTopologyCnt} (${vm?.cpuTopologySocket}:${vm?.cpuTopologyCore}:${vm?.cpuTopologyThread})` },
  //   { label: Localization.kr.MEMORY, value: `${convertBytesToMB(vm?.memorySize ?? 0)} MB` },
  //   { label: " 할당할 실제 메모리", value: `${convertBytesToMB(vm?.memoryGuaranteed ?? 0)}  MB` },
  //   { label: "", value: "" },
  //   { label: "게스트", value: "" },
  //   { label: `- ${Localization.kr.ARCH}`, value: vm?.guestArc },
  //   { label: `- ${Localization.kr.OPERATING_SYSTEM}`, value: vm?.guestOsType },
  //   { label: "- 커널 버전", value: vm?.guestKernelVer },
  //   { label: `- ${Localization.kr.TIMEZONE}`, value: vm?.guestTimeZone },
  // ];

  // 게스트 운영 체제
  const generalTableRows = [
    { label: Localization.kr.NAME, value: vm?.name },
    { 
      label: Localization.kr.STATUS, 
      value: <div className="f-start">{status2Icon(vm?.status)} {Localization.kr.renderStatus(vm?.status)}</div> 
    },
    { label: Localization.kr.UP_TIME, value: Localization.kr.renderTime(vm?.upTime) },
    { label: Localization.kr.OPERATING_SYSTEM, value: vm?.guestOsType || vm?.osTypeName },
    { label: Localization.kr.HA, value: vm?.ha ? Localization.kr.YES : Localization.kr.NO },
    { label: "게스트 에이전트", value: vm?.guestAgentVersion || "-" }, // Localization에 정의 없으므로 그대로 유지
    { label: Localization.kr.DESCRIPTION, value: vm?.description },
  ];

  //가상머신 하드웨어
  const hardwareTableRows = [
    { 
      label: Localization.kr.CPU, 
      value: `${vm?.cpuTopologyCnt} (${vm?.cpuTopologySocket}:${vm?.cpuTopologyCore}:${vm?.cpuTopologyThread})` 
    },
    { 
      label: Localization.kr.MEMORY, 
      value: `${convertBytesToMB(vm?.memorySize ?? 0)} MB` 
    },
    { 
      label: "할당할 실제 메모리", // Localization.kr에 없음
      value: `${convertBytesToMB(vm?.memoryGuaranteed ?? 0)} MB` 
    },
    {
      label: `${Localization.kr.NETWORK} 어댑터`,
      value: (
        <>
          {vm?.nicVos?.map((nic, idx) => (
            <div key={idx}>
              {nic?.name} ({nic?.network?.name}) | {nic?.macAddress}
            </div>
          ))}
        </>
      )
    },
    {
      label: Localization.kr.DISK,
      value: (
        <>
          {vm?.diskAttachmentVos?.map((disk, idx) => (
            <div key={idx}>
              {convertBytesToMB(disk?.disk?.provisionedSize ?? 0)} MiB | {disk?.disk?.storageDomainName} | 씬 {disk?.bootable ? "| 부팅" : ""}
            </div>
          ))}
        </>
      )
    }
  ];

  //관련 개체
  const relatedTableRows = [
    { label: Localization.kr.DATA_CENTER, value: vm?.dataCenterVo?.name || "Default" },
    { label: Localization.kr.CLUSTER, value: vm?.clusterVo?.name },
    {
      label: Localization.kr.HOST, 
      value: <div>{vm?.hostVo?.name}</div>
    },
    {
      label: Localization.kr.DOMAIN,

      value: [...new Set(vm?.diskAttachmentVos?.map(disk => disk?.disk?.storageDomainName))].join(", ")
    },
    {
      label: Localization.kr.NETWORK,
      value: [...new Set(vm?.nicVos?.map(nic => nic?.network?.name))].join(", ")
    }
  ];

  const { setActiveModal } = useUIState();
  const {
    data: snapshots = [],
    isLoading: isSnapshotsLoading,
  } = useSnapshotsFromVM(vmId, (e) => ({ ...e }));
  const snapshotList = useMemo(() =>
    (snapshots || [])
      .filter(s => !/(Active\sVM|before\sthe\spreview)/gi.test(s.description))
      .map(s => ({
        id: s.id,
        description: s.description,
        date: s.date?.replace("T", " ").slice(0, 16),
        icon: s.persistMemory ? rvi16DesktopFlag(CONSTANT.color.blue1) : rvi16Desktop(),
        statusIcon: status2Icon(s.status),
      }))
  , [snapshots]);
  return (
    
    // <div className="vm-detail-grid">
    //     <div className="vm-section section-top">
    //       <div className="vm-info-box-outer grid-col-span-2 vm-box-default">
    //         <h3 className="box-title">게스트 운영체제</h3>
    //         <hr className="w-full" />
    //         <div className="flex h-full">
    //           <div className="half-box">
    //             <VmOsIcon dataUrl={vm?.urlLargeIcon} />
    //           </div>
    //           <div className="half-box vm-info-content">
    //             <InfoTable tableRows={generalTableRows} />
    //           </div>
    //         </div>
    //       </div>

    //       <GeneralBoxProps title="용량 및 사용량">
    //         <VmGeneralBarChart />
    //       </GeneralBoxProps>
    //     </div>

       
    //     <div className="vm-section section-bottom">
    //       <GeneralBoxProps title="가상머신 하드웨어">
    //         <InfoTable tableRows={hardwareTableRows} />
    //       </GeneralBoxProps>

    //       <GeneralBoxProps title="관련 개체">
    //         <InfoTable tableRows={relatedTableRows} />
    //       </GeneralBoxProps>

    //       <GeneralBoxProps title="스냅샷">
    //         <div className="box-content snapshots">
    //           <div
    //             className="snapshot-add py-3 fs-13"
    //             onClick={() => setActiveModal("vm:snapshot")}
    //           >
    //             + 스냅샷 추가
    //           </div>
    //           {snapshotList.map((snap) => (
    //             <div key={snap.id} className="snapshot-entry f-start">
    //               {snap.statusIcon && <RVI16 iconDef={snap.statusIcon} className="mr-1" />}
    //               <RVI16 iconDef={snap.icon} className="ml-1 mr-1" />
    //               <span>{snap.description}_{snap.date}</span>
    //             </div>
    //           ))}
    //         </div>
    //       </GeneralBoxProps>
    //     </div>
    // </div>

      <>
    <GeneralLayout
      top={
        <>
          <div className="vm-info-box-outer grid-col-span-2 vm-box-default">
            <h3 className="box-title">게스트 운영체제</h3>
            <hr className="w-full" />
            <div className="flex h-full">
              <div className="half-box">
                <VmOsIcon dataUrl={vm?.urlLargeIcon} />
              </div>
              <div className="half-box vm-info-content">
                <InfoTable tableRows={generalTableRows} />
              </div>
            </div>
          </div>

          <GeneralBoxProps title="용량 및 사용량">
            <VmGeneralBarChart type="vm" usageDto={vm?.usageDto} />
          </GeneralBoxProps>
       
        </>
      }
      bottom={
        <>
          <GeneralBoxProps title="가상머신 하드웨어">
            <InfoTable tableRows={hardwareTableRows} />
          </GeneralBoxProps>

          <GeneralBoxProps title="관련 개체">
            <InfoTable tableRows={relatedTableRows} />
          </GeneralBoxProps>

          <GeneralBoxProps title="스냅샷">
            <div className="box-content snapshots">
              <div
                className="snapshot-add py-3 fs-13"
                onClick={() => setActiveModal("vm:snapshot")}
              >
                + 스냅샷 추가
              </div>
              {snapshotList.map((snap) => (
                <div key={snap.id} className="snapshot-entry f-start">
                  {snap.statusIcon && <RVI16 iconDef={snap.statusIcon} className="mr-1" />}
                  <RVI16 iconDef={snap.icon} className="ml-1 mr-1" />
                  <span>{snap.description}_{snap.date}</span>
                </div>
              ))}
            </div>
          </GeneralBoxProps>
       
        </>
      }
    />
    {/* <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-general;name=${vmsSelected[0]?.name}`} 
      /> */}
    </>
  );
};

export default VmGeneral;

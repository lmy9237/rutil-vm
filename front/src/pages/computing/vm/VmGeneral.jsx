import { useCallback, useEffect, useMemo, useRef } from "react";
import CONSTANT                   from "@/Constants";
import { openNewTab }             from "@/navigation";
import { useValidationToast }     from "@/hooks/useSimpleToast";
import useUIState                 from "@/hooks/useUIState";
import useGlobal                  from "@/hooks/useGlobal";
import { InfoTable }              from "@/components/table/InfoTable";
import GeneralLayout              from "@/components/GeneralLayout";
import Vnc                        from "@/components/Vnc"
import GeneralBoxProps            from "@/components/common/GeneralBoxProps";
import TableRowClick              from "@/components/table/TableRowClick";
import SemiCircleChart            from "@/components/Chart/SemiCircleChart";
import VmOsIcon                   from "@/components/icons/VmOsIcon";
import {
  RVI16,
  rvi16Desktop,
  rvi16DesktopFlag,
  status2Icon
} from "@/components/icons/RutilVmIcons";
import VmGeneralBarChart          from "@/pages/computing/vm/VmGeneralBarChart";
import {
  useVm,
  useVmScreenshot,
  useAllOpearatingSystemsFromCluster,
  useAllBiosTypes,
  useSnapshotsFromVM,
  useDisksFromVM,
  useNetworkInterfacesFromVM,
} from "@/api/RQHook";
import { convertBytesToMB }       from "@/util";
import Localization               from "@/utils/Localization";
import Logger                     from "@/utils/Logger";
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
  const {
    vncScreenshotDataUrl, 
    setVncScreenshotDataUrl,
    clearVncScreenshotDataUrl
  } = useUIState();
  const { validationToast } = useValidationToast();

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
    data: vmScreenshot,
  } = useVmScreenshot(vmId);

  const { //디스크목록
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
    isRefetching: isDisksRefetching,
  } = useDisksFromVM(vmId, (e) => ({ ...e }));

  // 네트워크 어뎁터
  const {
    data: nics = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    Success: isNicsSuccess,
  } = useNetworkInterfacesFromVM(vmId, (e) => ({ ...e }));
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
    clearVncScreenshotDataUrl()
  }, [vm])

  // 게스트 운영 체제
  const generalTableRows = [
    { label: "ID", value: vm?.id },
    { label: Localization.kr.NAME, value: vm?.name },
    { 
      label: Localization.kr.STATUS, 
      value: <div className="f-start">{status2Icon(vm?.status)}&nbsp;&nbsp;{Localization.kr.renderStatus(vm?.status)}</div> 
    },
    { label: Localization.kr.UP_TIME, value: vm?.upTime }, // Localization.kr.renderTime(vm?.upTime)
    { label: Localization.kr.OPERATING_SYSTEM, value: vm?.osTypeName },
    { label: "칩셋/펌웨어 유형", value: vm?.biosTypeKr },
    { label: Localization.kr.HA, value: vm?.ha ? Localization.kr.YES : Localization.kr.NO },
    { label: "게스트 에이전트", value: vm?.guestAgentVersion || "-" }, // Localization에 정의 없으므로 그대로 유지
    { label: Localization.kr.DESCRIPTION, value: vm?.description },
  ];

  // 가상머신 하드웨어
  const hardwareTableRows = [
    { 
      label: "최적화 옵션", 
      value: 
        vm?.optimizeOption === "server"
          ? "서버 "
          : vm?.optimizeOption === "high_performance"
            ? "고성능"
            : "데스크톱"
    }, { 
      label: Localization.kr.CPU, 
      value: `${vm?.cpuTopologyCnt} (${vm?.cpuTopologySocket}:${vm?.cpuTopologyCore}:${vm?.cpuTopologyThread})` 
    }, { 
      label: Localization.kr.MEMORY, 
      value: `${convertBytesToMB(vm?.memorySize ?? 0)} MB` 
    }, { 
      label: "할당할 실제 메모리", // Localization.kr에 없음
      value: `${convertBytesToMB(vm?.memoryGuaranteed ?? 0)} MB` 
    }, 
    {
      label: `${Localization.kr.NETWORK} 어댑터`,
      value: (
        <>
          {nics.length > 0 && (
            <div className="mb-1.5">
              {nics.length}
            </div>
          )}
          {nics.map((nic, idx) => {
            const name = nic?.name || "-";
            const network = nic?.networkVo?.name || "-";
            const mac = nic?.macAddress || "-";
            return (
              <div key={nic.id}>
                {`${name} (${network}) | ${mac}`}
              </div>
            );
          })}
        </>
      )
    },
    {
      label: Localization.kr.DISK,
      value: (
        <>
          {disks.length > 0 && (
            <div className="mb-1.5">
              {disks.length}
            </div>
          )}
          {disks.map((disk, idx) => {
            const d = disk.diskImageVo;
            const sizeGiB = convertBytesToMB(d?.virtualSize ?? 0) / 1024;
            const storageName = d?.storageDomainVo?.name ?? "-";
            const thin = d?.sparse ? "씬" : "씬 아님";
            const boot = disk.bootable ? "| 부팅" : "";

            return (
              <div key={disk.id}>
                {`${Math.round(sizeGiB)} GiB | ${storageName} | ${thin} ${boot}`}
              </div>
            );
          })}
        </>
      )
    }
  ];

  //관련 개체
  const relatedTableRows = [
    { 
      label: Localization.kr.DATA_CENTER, 
      value: 
      <TableRowClick type="datacenter" id={vm?.dataCenterVo?.id}>
        {vm?.dataCenterVo?.name || "Default"}
      </TableRowClick>
    }, { 
      label: Localization.kr.CLUSTER, 
      value: 
        <TableRowClick type="cluster" id={vm?.clusterVo?.id}>
          {vm?.clusterVo?.name}
        </TableRowClick>
    }, { 
      label: Localization.kr.HOST, 
      value: 
        <TableRowClick type="host" id={vm?.hostVo?.id}>
          {vm?.hostVo?.name}
        </TableRowClick>
    }, {
      label: Localization.kr.DOMAIN,
      value: [...new Set(vm?.diskAttachmentVos?.map(diskAtt => 
        <TableRowClick type="domain" id={diskAtt?.disk?.storageDomainVo?.id}>
          {diskAtt?.disk?.storageDomainVo?.name}
        </TableRowClick>
        // diskAtt?.disk?.storageDomainName
      ))].join(", ")
    }, {
      label: Localization.kr.NETWORK,
      value: [...new Set(vm?.nicVos?.map(nic => 
        <TableRowClick type="network" id={nic?.networkVo?.id}>
          {nic?.networkVo?.name}
        </TableRowClick>
      ))].join(", ")
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

  //그래프 값
  const usageItems = useMemo(() => {
    const cpu = vm?.usageDto?.cpuPercent ?? 0;
    const memory = vm?.usageDto?.memoryPercent ?? 0;
    const network = vm?.usageDto?.networkPercent ?? 0;

    return [
      {
        label: "CPU", value: cpu, description: `${cpu}% 사용됨 | ${100 - cpu}% 사용 가능`,
      }, {
        label: Localization.kr.MEMORY, value: memory, description: `${memory}% 사용됨 | ${100 - memory}% 사용 가능`,
      }, {
        label: Localization.kr.NETWORK, value: network, description: `${network}% 사용됨 | ${100 - network}% 사용 가능`,
      }
    ];
  }, [vm?.usageDto]);

  const rfbRef = useRef(null);
  const takeScreenshotFromRFB = useCallback((rfb) => {
    Logger.debug(`Vnc > takeScreenshotFromRFB ...`)
    rfbRef.current = rfb
    if (rfb && rfb._display && rfb._display._target) {
      try {
        const canvas = rfb._display._target;
        const dataUrl = canvas.toDataURL('image/png');
        
        setVncScreenshotDataUrl(vmId, dataUrl);
        Logger.debug(`VmVnc > takeScreenshotFromRFB ... dataUrl: ${dataUrl}`);
        // copyToClipboard(dataUrl);
        // rfb.disconnect();
        rfb.blur();
      } catch(error) {
        Logger.error(`VmVnc > takeScreenshotFromRFB ... error: ${error.message}`);
      }
    }
  }, [vmId, rfbRef])

  /* useEffect(() => {
    Logger.debug(`VmGeneral > useEffect ... `)
    if (vncScreenshotDataUrl(vmId) === "") {
      takeScreenshotFromRFB(rfbRef.current)
    }
  }, [vmId, rfbRef]) */

  const handleStartConsole = useCallback(() => {
    Logger.debug(`VmOsIcon > handleStartConsole ... `);
    if (vmId === undefined || vmId === null || vmId === "") {
      validationToast.fail("웹 콘솔을 시작할 수 없습니다. (가상머신 ID 없음)");
      return;
    }
    openNewTab("console", vmId); 
  }, [vmId, rfbRef]);

  /*
  useEffect(() => {
    Logger.debug(`VmGeneral > useEffect ... checking if vm's running`)
    if (!vm?.running) {
      clearVncScreenshotDataUrl(vmId);
    }
  }, [vm, vmId])
  */

  return (
/*    
    <div className="vm-detail-grid">
        <div className="vm-section section-top">
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
            <VmGeneralBarChart />
          </GeneralBoxProps>
        </div>

       
        <div className="vm-section section-bottom">
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
        </div>
    </div>
*/
      <>
      <GeneralLayout
        top={
        <>
          <div className=" grid-col-span-2 vm-box-default">
            <h3 className="box-title">게스트 운영체제</h3>
            <hr className="w-full"/>
            
            <div className="vm-info-vnc-group ">
              <div className="vm-info-vnc v-center gap-8">
                {
                  (vm?.running && !vm?.hostedEngineVm && vmScreenshot)
                    ? <img src={vmScreenshot}
                        alt={`screenshot-${vmId}`} 
                        style={{cursor: 'pointer',width:'210px'}}
                        loading="lazy"
                        onClick={handleStartConsole}
                      /> 
                    : <VmOsIcon dataUrl={vm?.urlLargeIcon}
                      onClick={handleStartConsole}
                    />
                }
                <button 
                  onClick={handleStartConsole}
                  className="btn-vnc w-full fs-14"
                  disabled={!vm?.qualified4ConsoleConnect}
                >
                  웹 콘솔 시작
                </button>
              </div>
              <div className="half-box vm-info-content">
                <InfoTable tableRows={generalTableRows} />
              </div>
            </div>
          </div>

          <GeneralBoxProps title="용량 및 사용량">
            <VmGeneralBarChart items={usageItems} />
          </GeneralBoxProps>
       
        </>
        }
      bottom={
        <>
          <GeneralBoxProps
            title="가상머신 하드웨어"
            moreLink={`/computing/vms/${vmId}/disks`} 
          >
            <InfoTable tableRows={hardwareTableRows} />
          </GeneralBoxProps>

          <GeneralBoxProps title="관련 개체">
            <InfoTable tableRows={relatedTableRows} />
          </GeneralBoxProps>

          <GeneralBoxProps title="스냅샷" count={snapshotList.length}  moreLink={`/computing/vms/${vmId}/snapshots`} >
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

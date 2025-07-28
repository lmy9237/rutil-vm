import React, { useEffect, useMemo, useState } from "react";
import useGlobal                  from "@/hooks/useGlobal";
import { InfoTable }              from "@/components/table/InfoTable";
import GeneralBoxProps            from "@/components/common/GeneralBoxProps";
import GeneralLayout              from "@/components/GeneralLayout";
import VmGeneralBarChart          from "../../../components/Chart/GeneralBarChart";
import HostGeneralChart           from "./HostGeneralChart";
import { 
  useDashboardHost, 
  useHost
} from "@/api/RQHook";
import { convertBytesToMB }       from "@/util";
import Localization from "@/utils/Localization";
import "./Host.css";

/**
 * @name HostGeneral
 * @description 호스트 일반정보
 * (/computing/hosts/<hostId>)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const HostGeneral = ({
  hostId
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const { hostsSelected, setHostsSelected } = useGlobal()

  const { 
    data: host
  } = useHost(hostId);

  const {
    data: hostPer,
    status: hostPerStatus,
    isRefetching: isHostPerRefetching,
    refetch: hostPerRefetch,
    isError: isHostPerError,
    error: hostPerError,
    isLoading: isHostPerLoading,
  } = useDashboardHost(hostId);

  useEffect(() => {
    if (host) setHostsSelected(host)
    hostPerRefetch();
  }, [hostId]); // hostId가 변경될 때마다 실행

  const systemTableRows = [
    { label: "ID", value: host?.id },
    { label: `${Localization.kr.HOST} ${Localization.kr.NAME}/IP`, value: host?.name },
    { label: `부팅${Localization.kr.TIME} (${Localization.kr.UP_TIME})`, value: `${host?.bootingTime === "1970. 01. 01. 09:00:00" ? "해당없음": host?.bootingTime} (${host?.upTime})` },
    { label: `활성 ${Localization.kr.VM}`, value: host?.vmSizeVo?.upCnt },
    { label: "SELinux 모드", value: host?.seLinux },
    { 
      label: `Hosted Engine ${Localization.kr.HA}`, 
      value: host?.hostedActive ? `활성화 (점수: ${host?.hostedScore})` : "비활성화"
    },
    { label: "SPM 우선순위", value: host?.spmPriority ?? "없음" },
    { label: "장치통과", value: host?.devicePassThrough ? "활성화됨" : "비활성화됨" },
    { label: `iSCSI 개시자 ${Localization.kr.NAME}`, value: host?.iscsi },
  ];

  const hardwareTableRows = [
    { label: "모델명", value: host?.hostHwVo?.productName },
    { label: "일련 번호", value: host?.hostHwVo?.serialNum },
    { label: `${Localization.kr.CPU} 모델`, value: host?.hostHwVo?.cpuName },
    { label: `${Localization.kr.CPU} 유형`, value: host?.hostHwVo?.cpuType },
    { label: `${Localization.kr.CPU} 소켓`, value: host?.hostHwVo?.cpuTopologySocket },
    { label: `소켓당 ${Localization.kr.CPU} 코어`, value: host?.hostHwVo?.cpuTopologyCore },
    { label: `코어당 ${Localization.kr.CPU} 스레드`, value: host?.hostHwVo?.cpuTopologyThread },
    { label: `논리 ${Localization.kr.CPU} 코어 수`, value: host?.hostHwVo?.cpuTopologyAll },
    {
      label: Localization.kr.MEMORY,
      value: `${convertBytesToMB(host?.memoryTotal)} MB (${convertBytesToMB(host?.memoryUsed)} MB 사용/${convertBytesToMB(host?.memoryFree)} MB 사용 가능)`
    },
  ];

  const softwareTableRows = [
    { label: `${Localization.kr.OPERATING_SYSTEM} 버전`, value: host?.hostSwVo?.osVersion },
    { label: "커널 버전", value: host?.hostSwVo?.kernalVersion },
    { label: "KVM 버전", value: host?.hostSwVo?.kvmVersion },
    { label: "LIBVIRT 버전", value: host?.hostSwVo?.libvirtVersion },
    { label: "VDSM 버전", value: host?.hostSwVo?.vdsmVersion },
    // { label: "Open vSwitch 버전", value: host?.hostSwVo?.openVswitchVersion || "-" }
  ];

  // 그래프값
  const usageItems = useMemo(() => {
    const cpu = host?.usageDto?.cpuPercent ?? 0;
    const memory = host?.usageDto?.memoryPercent ?? 0;
    const network = host?.usageDto?.networkPercent ?? 0;

    return [
      {
        label: "CPU",
        value: cpu,
        description: `${cpu}% 사용됨 | ${100 - cpu}% 사용 가능`,
      },
      {
        label: "메모리",
        value: memory,
        description: `${memory}% 사용됨 | ${100 - memory}% 사용 가능`,
      },
      {
        label: "네트워크",
        value: network,
        description: `${network}% 사용됨 | ${100 - network}% 사용 가능`,
      }
    ];
  }, [host]);

  return (
    <>
    <GeneralLayout
      top={
        <>
          <GeneralBoxProps title="시스템 정보">
            <InfoTable tableRows={systemTableRows} />
          </GeneralBoxProps>
          <GeneralBoxProps title={Localization.kr.HARDWARE}>
            <InfoTable tableRows={hardwareTableRows} />
          </GeneralBoxProps>
          <GeneralBoxProps title={Localization.kr.USAGE}>
            <VmGeneralBarChart items={usageItems} />
          </GeneralBoxProps>
        </>
      }
      bottom={
        <>
          <div className="grid-col-span-2">
            <HostGeneralChart per={hostPer}/>
          </div>
          <GeneralBoxProps title={Localization.kr.SOFTWARE}>
            <InfoTable tableRows={softwareTableRows} />
          </GeneralBoxProps>
        </>
      }
    />
    </>
  );
};

export default HostGeneral;

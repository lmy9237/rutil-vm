import React, { useEffect, useMemo, useState } from "react";
import useGlobal                  from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink     from "@/components/common/OVirtWebAdminHyperlink";
import { InfoTable }              from "@/components/table/InfoTable";
import SuperAreaChart             from "@/components/Chart/SuperAreaChart";
import { 
  useDashboardHost, 
  useHost
} from "@/api/RQHook";
import { convertBytesToMB }       from "@/util";
import Localization               from "@/utils/Localization";
import Logger                     from "@/utils/Logger";
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

  const renderGeneralTab = useMemo(() => ([
    { label: `${Localization.kr.HOST} 이름/IP`, value: host?.name },
    { label: "SPM 우선순위", value: host?.spmPriority },
    { label: "활성 가상 머신", value: host?.vmSizeVo?.upCnt },
    { label: "논리 CPU 코어 수", value: host?.hostHwVo?.cpuTopologyAll },
    // { label: "온라인 논리 CPU 코어 수", value: host?.hostHwVo?.cpuOnline },
    { label: `부팅 ${Localization.kr.TIME}`, value: host?.bootingTime },
    { label: "Hosted Engine HA", value: `${host?.hostedActive === true ? "활성화": "비활성화"} (점수: ${host?.hostedScore})` },
    { label: "iSCSI 개시자 이름", value: host?.iscsi },
    { label: "Kdump Integration Status", value: host?.kdump === "DISABLED" ? "비활성화됨" : "활성화됨" },
    { label: "물리적 메모리", value: `${convertBytesToMB(host?.memoryTotal)} MB 합계 | ${convertBytesToMB(host?.memoryUsed)} MB 사용됨 | ${convertBytesToMB(host?.memoryFree)} MB ${Localization.kr.AVAILABLE}`, },
    { label: "Swap 크기", value: `${convertBytesToMB(host?.swapTotal)} MB 합계 | ${convertBytesToMB(host?.swapUsed)} MB 사용됨 | ${convertBytesToMB(host?.swapFree)} MB ${Localization.kr.AVAILABLE}`, },
    { label: "장치 통과", value: host?.devicePassThrough ? "활성" : "비활성" },
    { label: "최대 여유 메모리", value: `${convertBytesToMB(host?.memoryMax)} MB`, },/*새로운 가상 머신의 스케줄링을 위한 최대 여유 메모리 */
    { label: "Huge Pages (size: free/total)", value: `2048: ${host?.hugePage2048Free}/${host?.hugePage2048Total}, 1048576: ${host?.hugePage1048576Free}/${host?.hugePage1048576Total}`, },
    { label: "SELinux 모드", value: host?.seLinux },
  ]), [host]);

  const renderHardwareTab = useMemo(() => ([
    { label: "제조사", value: host?.hostHwVo?.manufacturer },
    { label: "버전", value: host?.hostHwVo?.hwVersion },
    { label: "UUID", value: host?.hostHwVo?.uuid },
    { label: "일련 번호", value: host?.hostHwVo?.serialNum },
    { label: "제품군", value: host?.hostHwVo?.family },
    { label: "제품 이름", value: host?.hostHwVo?.productName },
    { label: "CPU 모델", value: host?.hostHwVo?.cpuName },
    { label: "CPU 유형", value: host?.hostHwVo?.cpuType },
    { label: "CPU 소켓", value: host?.hostHwVo?.cpuTopologySocket },
    { label: "소켓당 CPU 코어", value: host?.hostHwVo?.cpuTopologyCore },
    { label: "코어당 CPU의 스레드", value: host?.hostHwVo?.cpuTopologyThread },
  ]), [host]);

  const renderSoftwareTab = useMemo(() => ([
    { label: "OS 버전", value: host?.hostSwVo?.osVersion },
    // { label: "OS 정보", value: host?.hostSwVo?.osInfo },
    { label: "커널 버전", value: host?.hostSwVo?.kernalVersion },
    { label: "KVM 버전", value: host?.hostSwVo?.kvmVersion },
    { label: "LIBVIRT 버전", value: host?.hostSwVo?.libvirtVersion },
    { label: "VDSM 버전", value: host?.hostSwVo?.vdsmVersion },
    { label: "SPICE 버전", value: host?.hostSwVo?.spiceVersion },
    { label: "GlusterFS 버전", value: host?.hostSwVo?.glustersfsVersion },
    { label: "CEPH 버전", value: host?.hostSwVo?.cephVersion },
    { label: "Open vSwitch 버전", value: host?.hostSwVo?.openVswitchVersion },
    { label: "Nmstate 버전", value: host?.hostSwVo?.nmstateVersion },
    { label: "VNC 암호화", value: "비활성화됨" },
    { label: "OVN configured", value: Localization.kr.YES },
  ]), [host]);

  const tabs = useMemo(() => ([
    { tab: "general",  label: Localization.kr.GENERAL,  tableRows: renderGeneralTab },
    { tab: "hardware", label: Localization.kr.HARDWARE, tableRows: renderHardwareTab },
    { tab: "software", label: Localization.kr.SOFTWARE, tableRows: renderSoftwareTab },
  ]), [renderGeneralTab, renderHardwareTab, renderSoftwareTab]);

  // const rows4ActiveTab = useMemo(() => ([
  //   tabs.find(({ tab }) => tab === activeTab)?.tableRows || []
  // ]), [tabs, activeTab])
  
  return (
    <div className="host-info-wrapper v-start align-start w-full gap-4">
      <div className="host-tabs f-start fs-14">
        {[...tabs].map(({ tab, label }, i) => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="host-info-detail f-start align-start gap-16">
        <InfoTable tableRows={
          tabs.find(({ tab }) => 
            tab === activeTab
          )?.tableRows || []
        }/>
        <div className="graph-area v-start gap-20">
          <div className="host-graph">
            호스트 CPU 사용률
            <SuperAreaChart id={`${hostId}-cpu`}
              key={`${hostId}-cpu`} 
              per={hostPer} 
              type="cpu"
            />
          </div>
          <div className="host-graph">
            호스트 메모리 사용률
            <SuperAreaChart id={`${hostId}-memory`} 
              key={`${hostId}-memory`} 
              per={hostPer} 
              type="memory"
            />
          </div>
        </div>
      </div>
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.HOST}>${hostsSelected[0]?.name}`}
        path={`hosts-general;name=${hostsSelected[0]?.name}`} 
      />
    </div>
  );
};

export default HostGeneral;

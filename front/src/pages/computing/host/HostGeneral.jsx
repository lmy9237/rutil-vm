import React, { useEffect, useState } from "react";
import { useDashboardHost, useHost } from "../../../api/RQHook";
import { convertBytesToMB } from "../../../util";
import "./Host.css";
import InfoTable from "../../../components/table/InfoTable";
import SuperAreaChart from "../../../components/Chart/SuperAreaChart";

/**
 * @name HostGeneral
 * @description 호스트 일반정보
 * (/computing/hosts/<hostId>)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const HostGeneral = ({ hostId }) => {
  const {
    data: host,
    isLoading: isHostLoading,
    isError: isHostError,
    isSuccess: isHostSuccess,
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

  const [activeTab, setActiveTab] = useState("general");
  const [chartData, setChartData] = useState(null);
  
  // hostId 변경 시 hostPerRefetch 호출 & 기존 데이터 지우기
  useEffect(() => {
    setChartData(null); // 데이터 초기화
    hostPerRefetch();
  }, [hostId]); // hostId가 변경될 때마다 실행
  
  // 최신 데이터를 반영
  useEffect(() => {
    if (!isHostPerLoading && !isHostPerRefetching && hostPer) {
      setChartData(hostPer); // 데이터 업데이트
    }
  }, [hostPer, isHostPerLoading, isHostPerRefetching]);

  const renderGeneralTab = [
    { label: "호스트이름/IP", value: host?.name },
    { label: "SPM 우선순위", value: host?.spmPriority },
    { label: "활성 가상 머신", value: host?.vmSizeVo?.upCnt },
    { label: "논리 CPU 코어 수", value: host?.hostHwVo?.cpuTopologyAll },
    { label: "온라인 논리 CPU 코어 수", value: host?.hostHwVo?.cpuOnline },
    { label: "부팅 시간", value: host?.bootingTime },
    { label: "Hosted Engine HA", value: `(점수: ${host?.hostedScore})` },
    { label: "iSCSI 개시자 이름", value: host?.iscsi },
    { label: "Kdump Integration Status", value: host?.kdump },
    { label: "물리적 메모리", value: `${convertBytesToMB(host?.memoryTotal)} MB 합계\n${convertBytesToMB(host?.memoryUsed)} MB 사용됨\n${convertBytesToMB(host?.memoryFree)} MB 사용가능`, },
    { label: "Swap 크기", value: `${convertBytesToMB(host?.swapTotal)} MB 합계\n${convertBytesToMB(host?.swapUsed)} MB 사용됨\n${convertBytesToMB(host?.swapFree)} MB 사용가능`, },
    { label: "장치 통과", value: host?.devicePassThrough },
    { label: "새로운 가상 머신의 스케줄링을 위한 최대 여유 메모리", value: `${convertBytesToMB(host?.memoryMax)} MB`, },
    { label: "Huge Pages (size: free/total)", value: `2048: ${host?.hugePage2048Free}/${host?.hugePage2048Total}, 1048576: ${host?.hugePage1048576Free}/${host?.hugePage1048576Total}`, },
    { label: "SELinux 모드", value: host?.seLinux },
  ];

  const renderHardwareTab = [
    { label: "제조사", value: host?.hostHwVo?.manufacturer },
    { label: "버전", value: host?.hostHwVo?.hwVersion },
    { label: "CPU 모델", value: host?.hostHwVo?.cpuName },
    { label: "소켓당 CPU 코어", value: host?.hostHwVo?.cpuTopologyCore },
    { label: "제품군", value: host?.hostHwVo?.family },
    { label: "UUID", value: host?.hostHwVo?.uuid },
    { label: "CPU 유형", value: host?.hostHwVo?.cpuType },
    { label: "코어당 CPU의 스레드", value: host?.hostHwVo?.cpuTopologyThread },
    { label: "제품 이름", value: host?.hostHwVo?.productName },
    { label: "일련 번호", value: host?.hostHwVo?.serialNum },
    { label: "CPU 소켓", value: host?.hostHwVo?.cpuTopologySocket },
    
  ];

  const renderSoftwareTab = [
    { label: "OS 버전", value: host?.hostSwVo?.osVersion },
    { label: "OS 정보", value: host?.hostSwVo?.osInfo },
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
    { label: "OVN configured", value: "예" },
  ];

  const tabs = [
    { tab: "general", label: "일반", tableRows: renderGeneralTab },
    { tab: "hardware", label: "하드웨어", tableRows: renderHardwareTab },
    { tab: "software", label: "소프트웨어", tableRows: renderSoftwareTab },
  ];

  return (
    // <div className="host-content-outer">
    <div>
      <div className="host-tabs">
        {tabs.map(({ tab, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
      <InfoTable tableRows={tabs.find(({ tab }) => tab === activeTab)?.tableRows || []} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        cpu <SuperAreaChart key={`${hostId}-cpu`} per={chartData} type="cpu" />
        memory <SuperAreaChart key={`${hostId}-memory`} per={chartData} type="memory" />
      </div>
    </div>
  );
};

export default HostGeneral;

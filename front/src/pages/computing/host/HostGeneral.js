import React, { useState } from 'react';
import { useHost } from "../../../api/RQHook";
import './css/Host.css';
import { formatBytesToMB } from '../../../utils/format';

const HostGeneral = ({ hostId }) => {
  const { data: host } = useHost(hostId);
  const [activeTab, setActiveTab] = useState("general");

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
    { label: "물리적 메모리", value: `${formatBytesToMB(host?.memoryTotal)} MB 합계\n${formatBytesToMB(host?.memoryUsed)} MB 사용됨\n${formatBytesToMB(host?.memoryFree)} MB 사용가능` },
    { label: "Swap 크기", value: `${formatBytesToMB(host?.swapTotal)} MB 합계\n${formatBytesToMB(host?.swapUsed)} MB 사용됨\n${formatBytesToMB(host?.swapFree)} MB 사용가능` },
    { label: "장치 통과", value: host?.devicePassThrough },
    { label: "새로운 가상 머신의 스케줄링을 위한 최대 여유 메모리", value: `${formatBytesToMB(host?.memoryMax)} MB` },
    { label: "Huge Pages (size: free/total)", value: `2048: ${host?.hugePage2048Free}/${host?.hugePage2048Total}, 1048576: ${host?.hugePage1048576Free}/${host?.hugePage1048576Total}` },
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
    { label: "TSC 주파수", value: host?.hostHwVo?.name },
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
    { tab: 'general', label: '일반', tableRows: renderGeneralTab },
    { tab: 'hardware', label: '하드웨어', tableRows: renderHardwareTab },
    { tab: 'software', label: '소프트웨어', tableRows: renderSoftwareTab },
  ];

  return (
    <div className="host-content-outer">
      <div className="host-tabs">
        {tabs.map(({ tab, label }) => (
          <button
            key={tab} onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
      
      <div className='host-table-outer'>
        <table className="host-table">
          <tbody>
            {tabs.find(({ tab }) => tab === activeTab)?.tableRows.map((row, index) => (
              <tr key={index}>
                <th>{row.label}:</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostGeneral;
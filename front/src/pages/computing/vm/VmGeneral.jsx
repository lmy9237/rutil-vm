import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComputer,
  faEarthAmericas,
  faPlus,
  faServer,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import VmGeneralChart from "./VmGeneralChart";
import { useVmById } from "../../../api/RQHook";
import { convertBytesToMB } from "../../../util";
import InfoTable from "../../../components/table/InfoTable";

// 운영 시스템
const osSystemList = [
  { value: "debian_7", label: "Debian 7+" },
  { value: "debian_9", label: "Debian 9+" },
  { value: "freebsd", label: "FreeBSD 9.2" },
  { value: "freebsdx64", label: "FreeBSD 9.2 x64" },
  { value: "other_linux", label: "Linux" },
  // { value: 'other_linux_s390x', label: 'Linux' },
  // { value: 'other_linux_ppc64', label: 'Linux' },
  { value: "other", label: "Other OS" },
  // { value: 'other_s390x', label: 'Other OS' },
  // { value: 'other_ppc64', label: 'Other OS' },
  { value: "other_linux_kernel_4", label: "Other Linux (kernel 4.x)" },
  { value: "windows_xp", label: "Windows XP" },
  { value: "windows_2003", label: "Windows 2003" },
  { value: "windows_2003x64", label: "Windows 2003 x64" },
  { value: "windows_2008x64", label: "Windows 2008 x64" },
  { value: "windows_2008R2x64", label: "Windows 2008 R2 x64" },
  { value: "windows_2008", label: "Windows 2008" },
  { value: "windows_2012x64", label: "Windows 2012 x64" },
  { value: "windows_2012R2x64", label: "Windows 2012R2 x64" },
  { value: "windows_2016x64", label: "Windows 2016 x64" },
  { value: "windows_2019x64", label: "Windows 2019 x64" },
  { value: "windows_2022", label: "Windows 2022" },
  { value: "windows_7", label: "Windows 7" },
  { value: "windows_7x64", label: "Windows 7 x64" },
  { value: "windows_8", label: "Windows 8" },
  { value: "windows_8x64", label: "Windows 8 x64" },
  { value: "windows_10", label: "Windows 10" },
  { value: "windows_10x64", label: "Windows 10 x64" },
  { value: "windows_11", label: "Windows 11" },
  { value: "rhel_atomic7x64", label: "Red Hat Atomic 7.x x64" },
  { value: "rhel_3", label: "Red Hat Enterprise Linux 3.x" },
  { value: "rhel_3x64", label: "Red Hat Enterprise Linux 3.x x64" },
  { value: "rhel_4", label: "Red Hat Enterprise Linux 4.x" },
  { value: "rhel_4x64", label: "Red Hat Enterprise Linux 4.x x64" },
  { value: "rhel_5", label: "Red Hat Enterprise Linux 5.x" },
  { value: "rhel_5x64", label: "Red Hat Enterprise Linux 5.x x64" },
  { value: "rhel_6", label: "Red Hat Enterprise Linux 6.x" },
  { value: "rhel_6x64", label: "Red Hat Enterprise Linux 6.x x64" },
  { value: "rhel_6_ppc64", label: "Red Hat Enterprise Linux up to 6.8" },
  { value: "rhel_6_9_plus_ppc64", label: "Red Hat Enterprise Linux 6.9+" },
  { value: "rhel_7_s390x", label: "Red Hat Enterprise Linux 7.x" },
  { value: "rhel_7x64", label: "Red Hat Enterprise Linux 7.x x64" },
  { value: "rhel_7_ppc64", label: "Red Hat Enterprise Linux 7.x" },
  { value: "rhel_8x64", label: "Red Hat Enterprise Linux 8.x x64" },
  { value: "rhel_8_ppc64", label: "Red Hat Enterprise Linux 8.x" },
  { value: "rhel_9x64", label: "Red Hat Enterprise Linux 9.x x64" },
  { value: "rhel_9_ppc64", label: "Red Hat Enterprise Linux 9.x" },
  { value: "rhcos_x64", label: "Red Hat Enterprise Linux CoreOS" },
  { value: "sles_11", label: "SUSE Linux Enterprise Server 11+" },
  { value: "sles_11_ppc64", label: "SUSE Linux Enterprise Server 11" },
  { value: "sles_12_s390x", label: "SUSE Linux Enterprise Server 12" },
  { value: "ubuntu_12_04", label: "Ubuntu Precise Pangolin LTS" },
  { value: "ubuntu_12_10", label: "Ubuntu Quantal Quetzal" },
  { value: "ubuntu_13_04", label: "Ubuntu Raring Ringtails" },
  { value: "ubuntu_13_10", label: "Ubuntu Saucy Salamander" },
  { value: "ubuntu_14_04", label: "Ubuntu Trusty Tahr LTS+" },
  { value: "ubuntu_14_04_ppc64", label: "Ubuntu Trusty Tahr LTS+" },
  { value: "ubuntu_16_04_s390x", label: "Ubuntu Xenial Xerus LTS+" },
  { value: "ubuntu_18_04", label: "Ubuntu Bionic Beaver LTS+" },
];

// 칩셋 옵션
const chipsetOptionList = [
  { value: "I440FX_SEA_BIOS", label: "BIOS의 I440FX 칩셋" },
  { value: "Q35_OVMF", label: "UEFI의 Q35 칩셋" },
  { value: "Q35_SEA_BIOS", label: "BIOS의 Q35 칩셋" },
  { value: "Q35_SECURE_BOOT", label: "UEFI SecureBoot의 Q35 칩셋" },
];

/**
 * @name VmGeneral
 * @description 가상머신 일반정보
 * (/computing/vms/<vmId>)
 *
 * @param {string} vmId 가상머신 ID
 * @returns
 */
const VmGeneral = ({ vmId }) => {
  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
  } = useVmById(vmId);

  const osLabel =
    osSystemList.find((option) => option.value === vm?.osSystem)?.label ||
    vm?.osSystem;
  const chipsetLabel =
    chipsetOptionList.find((option) => option.value === vm?.chipsetFirmwareType)
      ?.label || vm?.chipsetFirmwareType;

  const generalTableRows = [
    { label: "전원상태", value: vm?.status },
    { label: "IP 주소", value: vm?.ipv4 },
    { label: "게스트 운영 체제", value: vm?.osSystem },
    { label: "게스트 에이전트", value: vm?.guestInterfaceName },
    { label: "업타임", value: vm?.upTime },
    { label: "FQDN", value: vm?.fqdn },
    // { label: "실행 호스트", value: vm?.hostVo?.name },
    { label: "", value: " " },
    {
      label: "클러스터",
      value: (
        <div className="related-object">
          <FontAwesomeIcon
            icon={faEarthAmericas}
            fixedWidth
            className="mr-0.5"
          />
          <span className="text-blue-500 font-bold">{vm?.clusterVo?.name}</span>
        </div>
      ),
    },
    {
      label: "호스트",
      value: (
        <div className="related-object">
          <FontAwesomeIcon icon={faUser} fixedWidth className="mr-0.5" />
          <span className="text-blue-500 font-bold"> {vm?.hostVo?.name}</span>
        </div>
      ),
    },
    {
      label: "네트워크",
      value: (
        <div className="related-object">
          <FontAwesomeIcon icon={faServer} fixedWidth className="mr-0.5" />
          <span className="text-blue-500 font-bold"> {vm?.hostVo?.name}</span>
        </div>
      ),
    },
    // { label: "스토리지 도메인",
    //   value:
    //     <div className='related-object'>
    //       <FontAwesomeIcon icon={faDatabase} fixedWidth className="mr-0.5"/>
    //       <span>{vm?.storageDomainVo?.name}</span>
    //     </div>
    // }
  ];

  const hardwareTableRows = [
    {
      label: "CPU",
      value: `${vm?.cpuTopologyCnt}(${vm?.cpuTopologySocket}:${vm?.cpuTopologyCore}:${vm?.cpuTopologyThread})`,
    },
    { label: "메모리", value: convertBytesToMB(vm?.memorySize) + " MB" ?? "0" },
    { label: "하드 디스크", value: vm?.storageDomainVo?.name },
    { label: "네트워크 어댑터", value: vm?.nicVos?.[0]?.name },
    { label: "칩셋/펌웨어 유형", value: chipsetLabel },
  ];

  const typeTableRows = [
    { label: "유형", value: osLabel },
    { label: "아키텍처", value: vm?.cpuArc },
    { label: "운영체제", value: vm?.osLabel },
    { label: "커널 버전", value: vm?.kernelVersion },
    { label: "시간대", value: vm?.timeOffset },
    { label: "로그인된 사용자", value: vm?.loggedInUser },
    { label: "콘솔 사용자", value: vm?.consoleUser },
    { label: "콘솔 클라이언트 IP", value: vm?.consoleClientIp },
  ];

  return (
    <>
      <div className="vm-detail-general-boxs">
        <div className="detail-general-box">
          <InfoTable tableRows={generalTableRows} />
        </div>

        <div className="detail-general-box">
          <div>VM 하드웨어</div>
          <InfoTable tableRows={hardwareTableRows} />
        </div>

        <div className="detail-general-mini-box">
          <div>용량 및 사용량</div>
          <div className="capacity-outer">
            <div className="capacity">
              <div>CPU</div>
              <div className="capacity-box">
                <div>{vm?.usageDto?.cpuPercent}% 사용됨</div>
                <div>{vm?.cpuTopologyCnt} CPU 할당됨</div>
              </div>
            </div>
            <div className="capacity">
              <div>메모리</div>
              <div className="capacity-box">
                <div>
                  {vm?.usageDto?.memoryPercent}% 사용됨 (vm down 시 안떠야됨)
                </div>
                <div>
                  {Math.round(vm?.memoryActual / 1024 / 1024) || "0"} MB 할당됨
                </div>
              </div>
            </div>
            <div className="capacity">
              <div>스토리지</div>
              <div className="capacity-box">
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-general-boxs-bottom">
        <div className="vm-general-bottom-box">
          <InfoTable tableRows={typeTableRows} />
        </div>

        <div className="vm-general-bottom-box">
          <div className="vm-general-box">
            <FontAwesomeIcon icon={faComputer} className="mr-0.5" />
            <div className="mr-0.5">스냅샷</div>
            <div>2</div>
          </div>
          <div className="vm-add-snapshot-btn">
            <FontAwesomeIcon icon={faPlus} className="mr-0.5" />
            <div className="mr-0.5">스냅샷 생성</div>
          </div>
        </div>
        <div className="vm-general-bottom-box">
          <div className="vm-general-box">
            <FontAwesomeIcon icon={faComputer} className="mr-0.5" />
            <div>디스크</div>
          </div>
          <div className="disk-bar">
            <VmGeneralChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default VmGeneral;

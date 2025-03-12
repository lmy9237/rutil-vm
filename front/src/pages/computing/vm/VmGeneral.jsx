import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faComputer,
  faEarthAmericas,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useVmById } from "../../../api/RQHook";
import { convertBytesToMB } from "../../../util";
import InfoTable from "../../../components/table/InfoTable";
import SemiCircleChart from "../../../components/Chart/SemiCircleChart";

// 운영 시스템
const osSystemList = [
  { value: "debian_7", label: "Debian 7+" },
  { value: "debian_9", label: "Debian 9+" },
  { value: "freebsd", label: "FreeBSD 9.2" },
  { value: "freebsdx64", label: "FreeBSD 9.2 x64" },
  { value: "other_linux", label: "Linux" },
  { value: 'other_linux_s390x', label: 'Linux' },// x
  { value: 'other_linux_ppc64', label: 'Linux' },// x
  { value: "other", label: "Other OS" },
  { value: 'other_s390x', label: 'Other OS' },// x
  { value: 'other_ppc64', label: 'Other OS' },// x
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
    osSystemList.find((option) => option.value === vm?.osType)?.label ||
    vm?.osSystem;
  const chipsetLabel =
    chipsetOptionList.find((option) => option.value === vm?.biosType)
      ?.label || vm?.chipsetFirmwareType;

  const generalTableRows = [
    { label: "전원상태", value: vm?.status },
    { label: "설명", value: vm?.description },
    { label: "업타임", value: vm?.upTime },
    { label: "IP 주소", value: vm?.ipv4 },
    { label: "FQDN", value: vm?.fqdn },
    { label: "최적화 옵션", value: vm?.type },
    { label: "시간대", value: vm?.timeZone },
    {
      label: "클러스터",
      value: (
        <div className="related-object">
          <FontAwesomeIcon icon={faEarthAmericas} fixedWidth className="mr-0.5" />
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
  ];

  const hardwareTableRows = [
    { label: "운영 체제", value: osLabel },
    { label: "아키텍처", value: vm?.cpuArc },
    { label: "칩셋/펌웨어 유형", value: chipsetLabel },
    { label: "CPU", value: `${vm?.cpuTopologyCnt} (${vm?.cpuTopologySocket}:${vm?.cpuTopologyCore}:${vm?.cpuTopologyThread})` },
    { label: "메모리", value: convertBytesToMB(vm?.memorySize) + " MB" ?? "0" },
    { label: " 할당할 실제 메모리", value: convertBytesToMB(vm?.memoryGuaranteed) + " MB" ?? "0" },
    { label: "", value: "" },
    { label: "게스트", value: "" },
    // { label: "- 에이전트", value: "" },
    { label: "- 아키텍처", value: vm?.guestArc },
    { label: "- 운영 시스템", value: vm?.guestOsType },
    { label: "- 커널 버전", value: vm?.guestKernelVer },
    { label: "- 시간대", value: vm?.guestTimeZone },
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
                <SemiCircleChart percentage={vm?.usageDto?.cpuPercent || 0} />
            </div>
            <div className="capacity">
              <div>메모리</div>
              <SemiCircleChart percentage={vm?.usageDto?.memoryPercent || 0} />
            </div>
            <div className="capacity">
              <div>네트워크</div>
              <SemiCircleChart percentage={vm?.usageDto?.networkPercent || 0} />
            </div>
          </div>
        </div>
      </div>      
    </>
  );
};

export default VmGeneral;

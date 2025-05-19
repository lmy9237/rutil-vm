const baseUrl = () => {
  let _value = 'localhost'; // 기본값
  try {
    _value = import.meta.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS;
    if (import.meta.env.PROD) _value = '__RUTIL_VM_OVIRT_IP_ADDRESS__';
  } catch(e) {
     console.error(`Constants > baseUrl ... ${e.message}`)
  }
  console.log(`Constants > baseUrl ... value: ${_value}`)
  return _value;
}

const itemsPerPage = () => {
  let _value = 10; // 기본값
  try {
    _value = parseInt(import.meta.env.VITE_RUTIL_VM_ITEMS_PER_PAGE);
    if (import.meta.env.PROD) _value = parseInt('__RUTIL_VM_ITEMS_PER_PAGE__');
  } catch(e) {
     console.error(`Constants > itemsPerPage ... ${e.message}`)
  }
  console.log(`Constants > itemsPerPage ... value: ${_value}`)
  return _value;
}

const isLoggingEnabled = () => {
  const _value = import.meta.env.VITE_RUTIL_VM_LOGGING_ENABLED === "true" || 
    '__RUTIL_VM_LOGGING_ENABLED__' === 'true';
  console.debug(`Constants > isLoggingEnabled ... value: ${_value}`)
  return _value
}

const osOptions = () => [/* 운영 시스템 */
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
const chipsetOptions = () => [
  { value: "I440FX_SEA_BIOS", label: "BIOS의 I440FX 칩셋" },
  { value: "Q35_OVMF", label: "UEFI의 Q35 칩셋" },
  { value: "Q35_SEA_BIOS", label: "BIOS의 Q35 칩셋" },
  { value: "Q35_SECURE_BOOT", label: "UEFI SecureBoot의 Q35 칩셋" },
];

// CPU 아키텍쳐
const cpuArcs = () => [
  { value: "UNDEFINED", label: "정의되지 않음" },
  { value: "X86_64", label: "x86_64" },
  { value: "PPC64", label: "ppc64" },
  { value: "S390X", label: "s390x" },
];

// 도메인 유형
const domainTypeOptions = () => [
  { value: "data",   label: "데이터" },
  { value: "iso",    label: "ISO" },
  { value: "export", label: "내보내기" },
]

/**
 * @name CONSTANT
 * 
 * @prop {number} itemsPerPage 페이징테이블에서 목록 1페이지 당 개수
 * @prop {boolean} isLoggingEnabled 로깅 활성화 여부
 */
const CONSTANT = {
  baseUrl: baseUrl(),
  itemsPerPage: itemsPerPage(),
  isLoggingEnabled: isLoggingEnabled(),
  templateIdDefault: "00000000-0000-0000-0000-000000000000",
  osOptions: osOptions(),
  chipsetOptions: chipsetOptions(),
  cpuArcs: cpuArcs(),
  domainTypeOptions: domainTypeOptions(),
  regex: {
    uuid: /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  },
  color: {
    ok: "#E7F2FF",
    ok2: "#8FC855",
    warn: "#F46C53",
    logo: "#8CC453",
    logText: "#4679BC",
    black: "#1D1D1D",
    down: "#999999",
    alert: "#E71825",
    orange: "#FF7925",
    yellow: "#FBA80E",
    blue: "#1D56BC",
    blue1: '#0A7CFF',
    primary: "#020B79",
    byPercentage(percentage) {
      let color = CONSTANT.color.alert;
      if (percentage < 50)      color = CONSTANT.color.ok2;
      else if (percentage < 80) color = CONSTANT.color.warn;
      return color
    }
  }
}

export default CONSTANT;
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

// 칩셋 옵션
const chipsetOptions = () => [
  // { value: "I440FX_SEA_BIOS", label: "BIOS의 I440FX 칩셋" },
  // { value: "Q35_OVMF", label: "UEFI의 Q35 칩셋" },
  // { value: "Q35_SEA_BIOS", label: "BIOS의 Q35 칩셋" },
  // { value: "Q35_SECURE_BOOT", label: "UEFI SecureBoot의 Q35 칩셋" },
  { value: "i440fx_sea_bios", label: "BIOS의 I440FX 칩셋" },
  { value: "q35_ovmf", label: "UEFI의 Q35 칩셋" },
  { value: "q35_sea_bios", label: "BIOS의 Q35 칩셋" },
  { value: "q35_secure_boot", label: "UEFI SecureBoot의 Q35 칩셋" },
];

// 최적화옵션
const optimizeOptionList = () => [
  { value: "server", label: "서버" },
  { value: "high_performance", label: "고성능" },
  { value: "desktop", label: "데스크톱" },
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
    white: "#F8F8F8",
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
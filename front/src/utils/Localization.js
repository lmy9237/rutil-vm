export const Localization = {
  kr: {
    NAME: "이름",
    DESCRIPTION: "설명",
    COMMENT: "코멘트",
    STATUS: "상태",
    DETAILS: "세부 정보",
    ALIAS: "별칭",
    STATELESS: "상태 비저장",
    ROLE: "역할",
    NOT_ASSOCIATED: "해당 없음",
    IMPORT: "가져오기",
    UNATTACHED: "붙어있지 않음",
    UNKNOWN: "알 수 없음",
    AVAILABLE: "사용 가능",
    CPU: "CPU",
    MEMORY: "메모리",
    UP_TIME: "업타임",

    DATA_CENTER: "데이터센터",
    CLUSTER: "클러스터",
    HOST: "호스트",
    VM: "가상머신",
    SNAPSHOT: "스냅샷",
    NETWORK: "네트워크",
    NETWORK_FILTER: `네트워크 필터`,
    NICS: `네트워크 인터페이스`,
    VNIC: "vNic",
    VNIC_PROFILE: "vNic 프로파일",
    EVENT: "이벤트",
    HA: "고가용성",
    SPARSE: "할당 정책",
    SIZE_AVAILABLE: "여유 공간",
    SIZE_USED: "사용된 공간",
    SIZE_TOTAL: "총 공간",
    SIZE_VIRTUAL: "가상 크기",
    SIZE_ACTUAL: "실제 크기",
    IP_ADDRESS: "IP 주소",
    CONNECTION: "연결",
    SPEED: "속도 (Mbps)",
    SPEED_RX: "Rx 속도 (Mbps)",
    SPEED_TX: "Tx 속도 (Mbps)",
    TOTAL_BYTE_RX: "총 Rx (byte)",
    TOTAL_BYTE_TX: "총 Rx (byte)",
    IS_SHARABLE: "공유가능",
    IS_BOOTABLE: "부팅가능",
    IS_READ_ONLY: "읽기전용",
    IS_IN_USE: "형재 사용중",
    WIPE_AFTER_DELETE: "삭제 후 초기화",

    GENERAL: "일반",
    MANAGEMENT: "관리",
    TARGET: "대상",
    USER: "사용자",
    USER_ID: "사용자ID",
    PRINT: "출력",
    TIME: "시간",
    TIMEZONE: "시간대",
    DATE: "날짜",
    DATE_CREATED: "생성일자",
    SEARCH: "검색",

    PLACEHOLDER_SEARCH: "검색어를 입력하세요.",
    PLACEHOLDER_USERNAME: "사용자명을 입력하세요.",
    PLACEHOLDER_PASSWORD: "비밀번호를 입력하세요.",

    renderStatus(status = "") {
      const _status = status?.toUpperCase() ?? "";
      if (_status === "UP")               return "실행중";
      else if (_status === "ACTIVE")      return "활성화";
      else if (_status === "DOWN")        return "중지";
      else if (_status === "INACTIVE")    return "비활성화";
      else if (_status === "UNINITIALIZED") return "초기화되지 않음";
      else if (_status === "REBOOT")      return "재부팅중";
      else if (_status === "SUSPENDED")   return "일시중지";
      else if (_status === "MAINTENANCE") return "유지보수";
      else if (_status === "OPERATIONAL") return "가동 중";
      else if (_status === "NON_OPERATIONAL") return "비 가동 중";
      else if (_status === "UNATTACHED")  return "붙어있지 않음";
      return _status;
    },

    renderSeverity(severity="NORMAL") {
      const _severity = severity?.toUpperCase() ?? "";
      if (_severity === "ALERT")            return "알림";
      else if (_severity === "ERROR")       return "실패";
      else if (_severity === "WARNING")     return "경고";
      else if (_severity === "NORMAL")      return "정상";
      return _severity;
    }
  }
}

export default Localization;
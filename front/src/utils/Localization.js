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
    TEMPLATE: "템플릿",
    SNAPSHOT: "스냅샷",
    NETWORK: "네트워크",
    NETWORK_FILTER: `네트워크 필터`,
    NICS: `네트워크 인터페이스`,
    VNIC: "vNic",
    VNIC_PROFILE: "vNic 프로파일",
    DOMAIN: "스토리지 도메인",
    DISK: "디스크",
    DISK_PROFILE: "디스크 프로파일",
    EVENT: "이벤트",
    UP: "실행 중",
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
    STARTED: "시작됨",
    FINISHED: "완료",

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
    HOUR: "시간",
    MINUTE: "분",
    SECOND: "초",
    SEARCH: "검색",
    CREATE: "생성",
    UPDATE: "편집",
    REMOVE: "삭제",
    DESTROY: "파괴",
    START: "실행",
    RESTART: "재시작",
    PAUSE: "일시중지",
    ACTIVATE: "활성화",
    DEACTIVATE: "비활성화",
    MOVE: "이동",
    COPY: "복사",
    IMPORT: "가져오기",
    OK: "확인",
    CANCEL: "취소",

    PLACEHOLDER_SEARCH: "검색어를 입력하세요.",
    PLACEHOLDER_USERNAME: "사용자명을 입력하세요.",
    PLACEHOLDER_PASSWORD: "비밀번호를 입력하세요.",
    NO_INFO: "🤷‍♂️ 내용이 없습니다",

    renderTime(milliseconds){
      const hours = Math.floor(milliseconds / 3600000);
      const minutes = Math.floor((milliseconds % 3600000) / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);
    
      let result = "";
    
      if (hours > 0) result += `${hours}시간 `;
      if (minutes > 0) result += `${minutes}분 `;
      if (seconds > 0 || hours > 0 || minutes > 0) result += `${seconds}초`;
    
      return result.trim();
    },

    renderStatus(status = "") {
      const _status = status?.toUpperCase() ?? "";
      if (_status === "UP" || _status === "UNASSIGNED")  return "실행 중";
      else if (_status === "ACTIVE")      return "활성화";
      else if (_status === "INSTALLING")      return "설치 중";
      else if (_status === "DOWN")        return "중지";
      else if (_status === "INACTIVE")    return "비활성화";
      else if (_status === "UNINITIALIZED") return "초기화되지 않음";
      else if (_status === "REBOOT")  return "재부팅 중";
      else if (_status === "REBOOT_IN_PROGRESS")  return "재부팅/재설정 중";
      else if (_status === "SUSPENDED" || _status === "PAUSED")   return "일시중지";
      else if (_status === "SAVING_STATE")  return "일시중지 중";
      else if (_status === "MAINTENANCE") return "유지보수";
      else if (_status === "PREPARING_FOR_MAINTENANCE") return "유지보수 준비 중";
      else if (_status === "WAIT_FOR_LAUNCH") return "전원을 켜는 중";
      else if (_status === "POWERING_UP") return "전원을 켜는 중";
      else if (_status === "POWERING_DOWN") return "전원을 끄는 중";
      else if (_status === "OPERATIONAL") return "가동 중";
      else if (_status === "NON_OPERATIONAL") return "비 가동 중";
      else if (_status === "NON_RESPONSIVE") return "응답하지 않음";
      else if (_status === "UNATTACHED")  return "붙어있지 않음";
      else if (_status === "RESTORING_STATE")  return "복구 중";
      else if (_status === "MIGRATING")  return "마이그레이션 중";
      else if (_status === "LOCKED")  return "잠김";
      else if (_status === "STARTED")  return "시작됨";
      else if (_status === "FAILED")  return "실패";
      else if (_status === "FINISHED")  return "완료";
      else if (_status === "UNKNOWN")  return "알 수 없음";
      else if (_status === "IN_PREVIEW")  return "미리보기";
      return _status;
    },

    renderSeverity(severity="NORMAL") {
      const _severity = severity?.toUpperCase() ?? "";
      if (_severity === "ALERT")            return "알림";
      else if (_severity === "ERROR")       return "실패";
      else if (_severity === "WARNING")     return "경고";
      else if (_severity === "NORMAL")      return "정상";
      return _severity;
    },
  }
}

export default Localization;
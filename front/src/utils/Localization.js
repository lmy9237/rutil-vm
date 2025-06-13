import Logger from "./Logger";

export const Localization = {
  en: {
    CERTIFICATE_GUIDES: [
      "RutilVM automatically requires the renewal of certificates that are set to expire within 30 days.",
      "If the engine-setup command is executed within 30 days before the expiration date, the PKI CONFIGURATION stage will be activated.",
      "If more than 30 days remain before the expiration date, the PKI stage will be skipped when running the engine-setup command.",
      "oVirt checks the expiration date of both the existing CA certificate and the server certificate. If either certificate is set to expire within 30 days, renewal is required.",
      "Failure to renew the certificates may result in the inability to access the web interface and disruption of certain services, so it is crucial to renew them in advance.",
    ]
  },
  kr: {
    NAME: "이름",
    DESCRIPTION: "설명",
    COMMENT: "코멘트",
    STATUS: "상태",
    DETAILS: "세부 정보",
    TYPE: "유형",
    CAPABILITIES: "기능",
    ALIAS: "별칭",
    STATELESS: "상태 비저장",
    ROLE: "역할",
    NOT_ASSOCIATED: "N/A",
    UNATTACHED: "붙어있지 않음",
    UNKNOWN: "알 수 없음",
    AVAILABLE: "사용 가능",
    UP_TIME: "업타임",

    DATA_CENTER: "데이터센터",
    CLUSTER: "클러스터",
    HOST: "호스트",
    HOST_DEVICE: "호스트 장치",
    ENGINE: "엔진",
    VM: "가상머신",
    TEMPLATE: "템플릿",
    SNAPSHOT: "스냅샷",
    NETWORK: "네트워크",
    NETWORK_FILTER: `네트워크 필터`,
    NICS: `네트워크 인터페이스`,
    VNIC: "vNIC",
    VNIC_PROFILE: "vNIC 프로파일",
    STORAGE: "스토리지",
    DOMAIN: "스토리지 도메인",
    DISK: "디스크",
    DISK_PROFILE: "디스크 프로파일",
    NFS_SHARE_PATH: "NFS 공유 경로",
    EVENT: "이벤트",
    CONSOLE: "콘솔",
    UP: "실행 중",
    DOWN: "정지",
    HA: "고가용성",
    SPARSE: "할당 정책",
    SIZE_AVAILABLE: "여유 공간",
    SIZE_USED: "사용된 공간",
    SIZE_TOTAL: "총 공간",
    SIZE_VIRTUAL: "가상 크기",
    SIZE_ACTUAL: "실제 크기",
    ADDRESS: "주소",
    IP_ADDRESS: `IP 주소`,
    CONNECTION: "연결",
    ATTACH: "연결",
    DETACH: "분리",
    SPEED: "속도 (Mbps)",
    SPEED_RX: "Rx 속도 (Mbps)",
    SPEED_TX: "Tx 속도 (Mbps)",
    TOTAL_BYTE_RX: "총 Rx (byte)",
    TOTAL_BYTE_TX: "총 Rx (byte)",
    IS_SHARABLE: "공유가능",
    IS_BOOTABLE: "부팅가능",
    IS_READ_ONLY: "읽기전용",
    IS_IN_USE: "현재 사용중",
    WIPE_AFTER_DELETE: "삭제 후 초기화",
    PREVIEW: "미리보기",
    COMMIT: "커밋",
    UNDO: "되돌리기",
    STARTED: "시작됨",
    FINISHED: "완료",
    APPLICATION: "애플리케이션",
    CPU: "CPU",
    MEMORY: "메모리",
    HARDWARE: "하드웨어",
    SOFTWARE: "소프트웨어",
    OPERATING_SYSTEM: "운영 체제",
    ARCH: "아키텍처",
    OPTIMIZATION_OPTION: "최적화 옵션",

    GENERAL: "일반",
    MANAGEMENT: "관리",
    TARGET: "대상",
    SYSTEM: "시스템",
    USER: "사용자",
    USER_ID: "사용자ID",
    USER_SESSION: "사용자세션",
    EMAIL: "이메일",
    ALERT: "알림",
    MESSAGE: "메세지",
    LOGIN: "로그인",
    LOGOUT: "로그아웃",
    PRINT: "출력",
    JOB: "작업",
    COMPUTING: "컴퓨팅",
    TIME: "시간",
    TIMESTAMP: "총 소요 시간",
    TIMEZONE: "시간대",
    DATE: "날짜",
    DATE_CREATED: "생성일자",
    DATE_EXPIRATION: "만료일자",
    HOUR: "시간",
    MINUTE: "분",
    SECOND: "초",
    SEARCH: "검색",
    CREATE: "생성",
    UPDATE: "편집",
    UPLOAD: "업로드",
    REMOVE: "삭제",
    DESTROY: "파괴",
    START: "시작",
    RESTART: "재시작",
    REFRESH: "새로고침",
    REFRESH_CAPABILITIES: "기능을 새로고침",
    END: "종료",
    POWER_OFF: "전원끔",
    PAUSE: "일시중지",
    REBOOT: "재부팅",
    RESET: "재설정",
    ACTIVATE: "활성화",
    DEACTIVATE: "비활성화",
    MAINTENANCE: "유지보수",
    ENROLL: "등록",
    MOVE: "이동",
    COPY: "복사",
    IMPORT: "가져오기",
    EXPORT: "내보내기",
    MIGRATION: "마이그레이션",
    OK: "확인",
    CANCEL: "취소",
    LOADING: "로딩",
    IN_PROGRESS: "중 ...",
    YES: "예",
    NO: "아니오",
    NO_CONTENT: "내용 없음",
    NO_ITEM: "항목 없음",
    PRIORITY: "우선순위",
    CERTIFICATE: "인증서",
    DAYS_REMAINING: "남은 일수",
    COUNT: "수",
    VERSION_COMPATIBLE: "호환 버전",

    PLACEHOLDER: "임력하세요.",
    PLACEHOLDER_SELECT: "선택하세요.",
    PLACEHOLDER_SEARCH: "검색어를 입력하세요.",
    PLACEHOLDER_USERNAME: "사용자명",
    PLACEHOLDER_PASSWORD: "암호",
    NO_INFO: "🤷‍♂️ 내용이 없습니다",
    
    TITLE_API_FETCH: "API 조회",
    REFETCH_IN_PROGRESS: "다시 조회 중 ...",
    TITLE_API_SUCCESS: "API 요청 성공",
    TITLE_API_ERROR: "API 요청 실패",
    TITLE_DEBUGGING: "디버깅용 값 확인",
    TITLE_SOMETHING_WENT_WRONG: "문제가 발생하였습니다",
    REQ_COMPLETE: "요청완료",
    ERR_OCCURRED: "오류발생",

    CERTIFICATE_GUIDES: [
      "RutilVM은 만료까지 30일 이하로 남은 인증서를 자동으로 갱신해야 합니다.",
      "engine-setup 명령어가 만료일 30일 이내에 실행되면, PKI CONFIGURATION 단계가 활성화됩니다.",
      "만료일까지 30일 이상 남아 있는 경우, engine-setup 명령어를 실행할 때 PKI 단계는 건너뜁니다.",
      "oVirt는 기존 CA 인증서와 서버 인증서의 만료일을 모두 확인합니다. 두 인증서 중 하나라도 만료까지 30일 이하로 남아 있으면 갱신이 필요합니다.",
      "인증서를 갱신하지 않으면 웹 인터페이스에 접근할 수 없거나 일부 서비스가 중단될 수 있으므로, 사전에 반드시 갱신하는 것이 중요합니다.",
    ],
    renderTime(milliseconds) {
      Logger.debug(`Localization > renderTime ... milliseconds: ${milliseconds}`)
      // Handle invalid or zero input
      if (isNaN(milliseconds) || milliseconds <= 0) {
        return "0초"; // Or you could return an empty string "" or throw an error
      }

      const MS_IN_SECOND = 1000;
      const MS_IN_MINUTE = MS_IN_SECOND * 60;
      const MS_IN_HOUR = MS_IN_MINUTE * 60;
      const MS_IN_DAY = MS_IN_HOUR * 24;
      const MS_IN_YEAR = MS_IN_DAY * 365; // Approximate, doesn't account for leap years

      let remainingMilliseconds = milliseconds;

      const years = Math.floor(remainingMilliseconds / MS_IN_YEAR);
      remainingMilliseconds %= MS_IN_YEAR;

      const days = Math.floor(remainingMilliseconds / MS_IN_DAY);
      remainingMilliseconds %= MS_IN_DAY;

      const hours = Math.floor(remainingMilliseconds / MS_IN_HOUR);
      remainingMilliseconds %= MS_IN_HOUR;

      const minutes = Math.floor(remainingMilliseconds / MS_IN_MINUTE);
      remainingMilliseconds %= MS_IN_MINUTE;

      // Using Math.ceil for seconds as in your original code
      // This means even 1ms will show as 1초. If you prefer 0초 for <1000ms, use Math.floor.
      const seconds = Math.ceil(remainingMilliseconds / MS_IN_SECOND);

      let result = "";
      let hasHigherUnits = false;

      if (years > 0) {
        result += `${years}년 `;
        hasHigherUnits = true;
      }
      if (days > 0) {
        result += `${days}일 `;
        hasHigherUnits = true;
      }
      if (hours > 0) {
        result += `${hours}시간 `;
        hasHigherUnits = true;
      }
      if (minutes > 0) {
        result += `${minutes}분 `;
        hasHigherUnits = true;
      }

      // Always show seconds if it's the only unit, or if other units are present,
      // or if the original millisecond value was non-zero (covered by the initial check and seconds calculation)
      // The `hasHigherUnits` check ensures "0초" is appended if there are, for example, hours but 0 minutes and 0 seconds.
      if (seconds > 0 || hasHigherUnits) {
        result += `${seconds}초`;
      } else if (!hasHigherUnits && seconds === 0 && milliseconds > 0){
        // This case handles inputs like 500ms which would ceil to 1초.
        // If seconds somehow became 0 after Math.ceil (e.g. if input was 0.1ms, which is unlikely with integer ms)
        // and no higher units, but original ms was >0, we might still want to show 0초 or 1초 based on rounding.
        // Given Math.ceil, if milliseconds > 0, seconds will be >= 1. So this specific 'else if' is mostly redundant
        // unless Math.ceil was changed to Math.floor and you wanted to explicitly show "0초" for small ms values.
        // For now, with Math.ceil, this branch is unlikely to be hit if ms > 0.
      }
      return result.trim();
    },

    renderStatus(status = "") {
      const _status = status?.toUpperCase() ?? "";
      if (_status === "OK")                 return "양호";
      if (_status === "UP" || _status === "UNASSIGNED")  return Localization.kr.UP;
      else if (_status === "ACTIVE")        return Localization.kr.ACTIVATE;
      else if (_status === "ACTIVATING")    return "활성화 중";
      else if (_status === "INSTALLING")    return "설치 중";
      else if (_status === "INSTALL_FAILED")    return "설치 실패";
      else if (_status === "DOWN")          return "정지";
      else if (_status === "INACTIVE")      return "비활성화";
      else if (_status === "UNINITIALIZED") return "초기화되지 않음/연결해제";
      else if (_status === "NEXT_RUN")      return "다음 실행 시 변경내용 적용";
      else if (_status === "REBOOT")        return "재부팅 중";
      else if (_status === "REBOOT_IN_PROGRESS")  return "재부팅/재설정 중";
      else if (_status === "SUSPENDED" || _status === "PAUSED")   return "일시중지";
      else if (_status === "SAVINGSTATE" || _status === "SAVING_STATE")  return "저장 중";
      else if (_status === "MAINTENANCE") return "유지보수";
      else if (_status === "PREPARING_FOR_MAINTENANCE") return "유지 관리 모드 준비 중";
      else if (_status === "WAIT_FOR_LAUNCH") return "전원을 켜는 중";
      else if (_status === "POWERING_UP") return "전원을 켜는 중";
      else if (_status === "POWERING_DOWN") return "전원을 끄는 중";
      else if (_status === "OPERATIONAL") return "가동 중";
      else if (_status === "NON_OPERATIONAL") return "비 가동 중";
      else if (_status === "NON_RESPONSIVE") return "응답하지 않음";
      else if (_status === "UNATTACHED")  return "연결 해제";
      else if (_status === "DETACHING")  return "분리 중";
      else if (_status === "RESTORING_STATE" || _status === "RESTORINGSTATE")  return "복구 중";
      else if (_status === "MIGRATING")  return "마이그레이션 중";
      else if (_status === "LOCKED")  return "잠김";
      else if (_status === "IMAGE_LOCKED") return "이미지 잠김";
      // else if (_status === "NEXTRUN")  return "??";
      else if (_status === "STARTED")  return "시작됨";
      else if (_status === "FAILED")  return "실패";
      else if (_status === "FINISHED")  return "완료";
      else if (_status === "UNKNOWN")  return "알 수 없음";
      else if (_status === "IN_PREVIEW")  return "미리보기";
      return _status;
    },

    renderDomainStatus(status = "") {
      const _status = status?.toUpperCase() ?? "";
      if (_status === "UP")  return "활성화";
      else if (_status === "UNINITIALIZED") return "연결 해제";
      else if (_status === "MAINTENANCE") return "유지 보수";
      else if (_status === "NOT_OPERATIONAL") return "비 가동 중";
      else if (_status === "NON_RESPONSIVE") return "응답하지 않음";
      else if (_status === "CONTEND") return "?";
      
      return _status;
    },

    renderSeverity(severity="NORMAL") {
      const _severity = severity?.toUpperCase() ?? "";
      if (_severity === "ALERT")            return "알림";
      else if (_severity === "ERROR")       return "실패";
      else if (_severity === "WARNING")     return "경고";
      else if (_severity === "NORMAL")      return "양호";//"정상"
      return _severity;
    },
  }
}

export default Localization;
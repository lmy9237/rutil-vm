export const Localization = {
  kr: {
    NAME: "이름",
    DESCRIPTION: "설명",
    COMMENT: "코멘트",
    STATUS: "상태",
    ALIAS: "별칭",
    STATELESS: "상태 비저장",
    ROLE: "역할",
    NOT_ASSOCIATED: "해당 없음",
    IMPORT: "가져오기",
    UNKNOWN: "알 수 없음",
    AVAILABLE: "사용가능",
    CPU: "CPU",
    MEMORY: "메모리",

    DATA_CENTER: "데이터센터",
    CLUSTER: "클러스터",
    HOST: "호스트",
    VM: "가상머신",
    NETWORK: "네트워크",
    NETWORK_FILTER: `네트워크 필터`,
    NICS: `네트워크 인터페이스`,
    VNIC: "vNic",
    VNIC_PROFILE: "vNic 프로파일",
    EVENT: "이벤트",
    HA: "고가용성",

    GENERAL: "일반",
    TIME: "시간",
    TIMEZONE: "시간대",
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
      else if (_status === "NON_OPERATIONAL") return "작동하지 않음";
      return _status;
    },
  }
}

export default Localization;
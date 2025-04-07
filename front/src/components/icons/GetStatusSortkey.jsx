// 아이콘 정렬 기능

/**
 * 상태 문자열에 따른 정렬 우선순위 반환
 * UP / ACTIVE / OPERATIONAL → 1
 * DOWN / INACTIVE / UNINITIALIZED → 2
 * 나머지 → 99
 */
export const getStatusSortKey = (status = "") => {
    const upper = status?.toUpperCase?.() ?? "";
  
    const priorityMap = {
      "UP": 1,
      "ACTIVE": 1,
      "OPERATIONAL": 1,
      "DOWN": 2,
      "INACTIVE": 2,
      "UNINITIALIZED": 2,
      "REBOOT": 3,
      "SUSPENDED": 4,
      "MAINTENANCE": 5,
      "UNKNOWN": 98
    };
  
    return priorityMap[upper] ?? 99;
  };
  
import Localization from "./utils/Localization";
import Logger from "./utils/Logger";
import { useEffect } from 'react';

/**
 * @name readString
 * 
 * @param {string} buf 버퍼 값
 * @returns {string} 변환된 버퍼의 문자열 값
 */
export function readString(buf) {
  Logger.debug(`util > readString ... `)
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// Modern version using DataView, which is cleaner
export function readUint32(buf) {
  Logger.debug(`util > readUint32 ... `)
  const view = new DataView(buf);
  return view.getUint32(0, false); // false = big-endian
}

// Modern version using BigInt for full 64-bit precision, as recommended
export function readBigUint64(buf) {
  Logger.debug(`util > readBigUint64 ... `)
  const view = new DataView(buf);
  return view.getBigUint64(0, false); // false = big-endian
}

export function toGiB(bytes) {
  if (typeof bytes !== 'bigint' && typeof bytes !== 'number') return 'N/A';
  return (Number(bytes) / (1024 * 1024 * 1024)).toFixed(2);
}

/**
 * vo에 {id="", name=""} 일때 사용
 * @returns 
 */
export function emptyIdNameVo() {
  return { id: "", name: "" };
}

/**
 * 
 * @param {*} items 
 * @param {*} setFn 
 */
export function useSelectFirstItemEffect(items, setVo) {
  useEffect(() => {
    if (items && items.length > 0) {
      const first = items[0];
      if (first && first.id !== undefined && first.name !== undefined) {
        setVo({ id: first.id, name: first.name });
      }
    }
  }, [items, setVo]);
}

export function useSelectItemEffect(id, editMode, items, setVo) {
  useEffect(() => {
    if (id) {
      const selected = items?.find(i => i.id === id);
      if (selected) {
        setVo({ id: selected.id, name: selected.name });
      }
    } else if (!editMode && items?.length > 0) {
      const first = items[0];
      if (first?.id !== undefined && first?.name !== undefined) {
        setVo({ id: first.id, name: first.name });
      }
    }
  }, [id, editMode, items, setVo]);
}

export function useSelectItemOrDefaultEffect(id, editMode, items, setVo, defaultName) {
  useEffect(() => {
    if (id) {
      const selected = items?.find(i => i.id === id);
      if (selected) {
        setVo({ id: selected.id, name: selected.name });
      }
    } else if (!editMode && items?.length > 0) {
      const defaultN = items.find(i => i.name === defaultName);
      const first = defaultN || items[0];
      if (first?.id !== undefined && first?.name !== undefined) {
        setVo({ id: first.id, name: first.name });
      }
    }
  }, [id, editMode, items, setVo]);
}


export function checkEmpty(value) {
  Logger.debug(`util > checkKoreanName ... value: ${value}`);
  return (value == null || value === undefined || value === "")

}
/**
 * @name CheckKoreanName
 * @description 한글이 들어갔는지 확인
 * 
 * @param {string} name 문자열
 * @returns 
 */
export function checkKoreanName(name) {
  const res = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(name);
  Logger.debug(`util > checkKoreanName ... name: ${name}, res: ${res}`);
  return res; // 한글이 포함되면 true 반환
}


/**
 * @name checkSpaceName
 * @description 띄어쓰기 들어갔는지 확인
 * 
 * @param {string} name 
 * @returns 
 */
export function checkSpaceName(name) {
  const res = /\s/.test(name);
  Logger.debug(`util > checkSpaceName ... name: ${name}, res: ${res}`);
  return res;
}

/**
 * @name checkName
 * @param {string} name 
 * @returns 
 */
export function checkName(name) {
  Logger.debug(`util > checkName ... name: ${name}`);
  if (!name) return `${Localization.kr.NAME}을 입력해주세요`;  
  if (checkKoreanName(name)) return `${Localization.kr.NAME}이 유효하지 않습니다.`;
  if (checkSpaceName(name)) return `${Localization.kr.NAME}에 공백은 허용되지 않습니다.`;
  return null; // 유효성 문제 없음
}

/**
 * 중복 이름 체크
 * @param {Array} options 전체 리스트
 * @param {string} name 확인할 이름
 * @param {string=} id (선택) 제외할 항목 id
 * @returns {string | undefined} 중복 시 에러 메시지 반환, 아니면 undefined
 */
export function checkDuplicateName(options, name, id) {
  if (!name || !Array.isArray(options)) return;

  const duplicate = options.find(option =>
    option?.name === name && (!id || option?.id !== id)
  );

  if (duplicate) {
    return `${name}는 중복된 이름입니다.`;
  }
}

/**
 * @name formatNumberWithCommas
 * @description 숫자 구분
 * 
 * @param {number} number
 */
export function formatNumberWithCommas(number) {
  if (isNaN(number)) return "N/A"
  const _number = (typeof number === 'string' || number instanceof String) ? parseInt(number) : number
  const res = parseInt(_number).toLocaleString(); // Locale 기반 쉼표 포맷
  Logger.debug(`util > formatNumberWithCommas ... number: ${_number}, res: ${res}`);
  return res;
}


/**
 * @name convertBytesToMB
 * @description byte -> mb
 * 
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in MB.
 */
export function convertBytesToMB(bytes) {
  const res = (bytes / (1024 * 1024)).toFixed(0);
  // Logger.debug(`util > convertBytesToMB ... bytes: ${bytes}, res: ${res}`); // 무한 루푸가 외 
  return res
}

/**
 * byte -> gb
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in GB.
 */
export function convertBytesToGB(bytes) {
  // const res = (bytes / (1024 * 1024)).toFixed(0);
  // Logger.debug(`util > convertBytesToMB ... bytes: ${bytes}, res: ${res}`);
  return (bytes / (1024 * 1024 * 1024)).toFixed(0);
}

// /**
//  * @name convertBytesToGiB
//  * @description 바이트를 GiB로 변환합니다. 소수점 둘째자리까지 표기
//  *
//  * @param {number} bytes
//  * @returns {number} GiB 값
//  */
// export function convertBytesToGiB(bytes) {
//   return Number((bytes / (1024 ** 3)).toFixed(2));
// }

// /**
//  * @name checkZeroSizeToGiB
//  * @description 바이트 값을 GiB 문자열로 표현합니다. (1 GiB 이하 처리 포함)
//  *
//  * @param {number} size 바이트 크기
//  * @returns {string} 변환된 GiB 표현 값
//  */
// export function checkZeroSizeToGiBs(size) {
//   const GiB = convertBytesToGiB(size);
//   return GiB < 1 ? "< 1 GiB" : `${GiB} GiB`;
// }


/**
 * @name convertBytesToGBFixed1
 * @description byte -> gb 소수점 한자리 출력
 *
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in GB.
 */
export function convertBytesToGBFixed1(bytes) {
  const res = (bytes / (1024 * 1024 * 1024)).toFixed(1);
  // Logger.debug(`util > convertBytesToGBFixed1 ... bytes: ${bytes}, res: ${res}`);
  return res;
}

/**
 * @name convertGBToBytes
 * @description gb -> byte
 * 
 * @param {number} gb - The number of bytes to convert.
 * @returns {string} The formatted size in btye
 */
export function convertGBToBytes(gb) {
  const res = gb * (1024 * 1024 * 1024);
  // Logger.debug(`util > convertGBToBytes ... gb: ${gb}, res: ${res}`);
  return res;
}

/**
 * @name sizeToBytes
 * @description GB로 받은 값을 byte로 변경
 * 가상머신 생성, 디스크 생성에서 사용
 * 
 * @param {number} size 
 * @returns {number} 변환 된 값
 */
export function sizeToBytes(size) {
  const res = parseInt(size, 10) * 1024 * 1024 * 1024;
  // Logger.debug(`util > sizeToBytes ... size: ${size}, res: ${res}`);
  return res
}

/**
 * @name checkZeroSizeToGiB
 * @description 
 * 
 * @param {number} size 
 * @returns {string} 변환 된 값
 */
export function checkZeroSizeToGiB(size) {
  const res = convertBytesToGB(size) < 1 ? "< 1 GiB" : `${convertBytesToGB(size)} GiB`
  // Logger.debug(`util > checkZeroSizeToGiB ... size: ${size}, res: ${res}`);
  return res;
}

/**
 * @name calculateOvercommitRatio
 * @description commitedSize와 size 기반 오버커밋 비율 계산
 *
 * @param {number} commitedSize 논리적으로 할당된 용량 (bytes)
 * @param {number} totalSize 총 물리 용량 (bytes)
 * @returns {string} 오버커밋 비율 = (논리 할당량 / 실제 물리 크기) * 100
 */
export function calculateOvercommitRatio(commitedSize, totalSize) {
  if (!totalSize || isNaN(commitedSize) || isNaN(totalSize)) return "N/A";
  const ratio = (commitedSize / totalSize) * 100;
  const formatted = ratio.toFixed(1);
  Logger.debug(`util > calculateOvercommitRatio ... commited: ${commitedSize}, total: ${totalSize}, ratio: ${formatted}%`);
  return `${formatted}%`;
}

/**
 * @name checkZeroSizeToMB
 * @description 
 * 
 * @param {number} size 
 * @returns {string} 변환 된 값
 */
export function checkZeroSizeToMB(size) {
  const res = convertBytesToMB(size) < 1 ? "< 1 MB" : `${convertBytesToMB(size)} MB`;
  // Logger.debug(`util > checkZeroSizeToMB ... size: ${size}, res: ${res}`);
  return res;
}


export function convertBpsToMbps(bytes) {
  const res = bytes / 1_000_000;
  // Logger.debug(`util > convertBpsToMbps ... bytes: ${bytes}, res: ${res}`)
  return res;
}

export function checkZeroSizeToMbps(size) {
  return convertBpsToMbps(size) < 1 ? "< 1" : `${convertBpsToMbps(size).toLocaleString()}` 
}

/**
 * @name validateUsername
 * oVirt 사용자 ID 값 유효 검증
 * 
 * @param {string} username oVirt사용자 ID 입력값
 * @param {*} oneUser 사용자 상세조회 API 결과값
 * 
 * @returns {*} (문제있을 경우) 메시지
 */
export const validateUsername = (username, oneUser) => {
  Logger.debug("SettingUsersModal > validateUsername ... ");
  if (!username) {
    Logger.error("SettingUsersModal > validateForm ... username EMPTY ");
    return "아이디를 입력해주세요.";
  }
  if (username.length < 4)  {
    Logger.error(`SettingUsersModal > validateForm ... username.length: ${username.length}`);
    return "아이디 길이가 짧습니다. (4자 이상)";
  }
  if (oneUser != null && oneUser.username === username) {
    Logger.error(`SettingUsersModal > validateForm ... duplicate ovirt user FOUND!: ${oneUser.username}`);
    return "중복된 아이디가 있어 사용할 수 없습니다.";
  }
  Logger.debug("SettingUsersModal > validateUsername ... ALL GOOD!");
  return null;
}

/**
 * @name validatePw
 * oVirt 사용자 비밀번호 값 유효 검증
 * 
 * @param {string} password oVirt사용자 비밀번호 입력값
 * @param {string} repassword oVirt사용자 비밀번호 다시 입력값 
 * 
 * @returns {*} (문제있을 경우) 메시지
 */
export const validatePw = (password, repassword) => {
  Logger.debug("util > validatePw ... ");
  if (!password) {
    Logger.error("SettingUsersModal > validateForm ... password EMPTY ");
    return "비밀번호를 입력해주세요.";
  }
  if (password.length < 4)  {
    Logger.error(`SettingUsersModal > validateForm ... password.length: ${password.length}`);
    return "비밀번호 길이가 짧습니다. (4자 이상)";
  }
  if (password !== repassword)  {
    Logger.error(`SettingUsersModal > validateForm ... password: ${password}, repasword: ${repassword}`);
    return "비밀번호가 같지 않습니다.";
  }
  return null;
}

export const triggerDownload = (
  blobData, filename
) => {
  Logger.debug(`util > triggerDownload ... filename: ${filename}`);
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute("download", filename || 'console.vv'); // Fallback filename
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url); // Clean up
}

/**
 * @name isNameDuplicated
 * @description 리스트에서 중복된 이름이 존재하는지 확인
 *
 * @param {string} name - 검사할 이름
 * @param {Array<Record<string, any>>} list - 중복 검사 대상 리스트
 * @param {string} key - 비교할 필드명 (기본값: 'name')
 * @param {object} options - ignoreCase (기본 true), trim (기본 true)
 * @returns {boolean} - 중복 여부
 */
export function isNameDuplicated(
  name,
  list,
  key = "name",
  options = { ignoreCase: true, trim: true }
) {
  if (!Array.isArray(list)) {
    Logger.warn("isNameDuplicated > list가 배열이 아님 또는 undefined", list);
    return false;
  }

  const { ignoreCase, trim } = options;
  const normalize = (str) =>
    typeof str === "string" ? (trim ? str.trim() : str) : "";

  const input = ignoreCase
    ? normalize(name).toLowerCase()
    : normalize(name);

  const result = list.some((item) => {
    const value = item?.[key];
    if (!value) return false;

    const compare = ignoreCase
      ? normalize(value).toLowerCase()
      : normalize(value);

    return compare === input;
  });

  Logger.debug(`util > isNameDuplicated ... name: ${name}, result: ${result}`);
  return result;
}

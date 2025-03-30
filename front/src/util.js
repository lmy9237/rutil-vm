import Localization from "./utils/Localization";
import Logger from "./utils/Logger";

/**
 * @name CheckKoreanName
 * @description 한글이 들어갔는지 확인
 * 
 * @param {string} name 문자열
 * @returns 
 */
export function checkKoreanName(name) {
  const res = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(name);
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
 * @name formatNumberWithCommas
 * @description 숫자 구분
 * 
 * @param {number} number
 */
export function formatNumberWithCommas(number) {
  const res = number.toLocaleString(); // Locale 기반 쉼표 포맷
  Logger.debug(`util > formatNumberWithCommas ... number: ${number}, res: ${res}`);
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
  Logger.debug(`util > convertBytesToMB ... bytes: ${bytes}, res: ${res}`);
  return res
}

/**
 * byte -> gb
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in GB.
 */
export function convertBytesToGB(bytes) {
  const res = (bytes / (1024 * 1024)).toFixed(0);
  Logger.debug(`util > convertBytesToMB ... bytes: ${bytes}, res: ${res}`);
  return (bytes / (1024 * 1024 * 1024)).toFixed(0);
}

/**
 * @name convertBytesToGBFixed1
 * @description byte -> gb 소수점 한자리 출력
 *
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in GB.
 */
export function convertBytesToGBFixed1(bytes) {
  const res = (bytes / (1024 * 1024 * 1024)).toFixed(1);
  Logger.debug(`util > convertBytesToGBFixed1 ... bytes: ${bytes}, res: ${res}`);
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
  Logger.debug(`util > convertGBToBytes ... gb: ${gb}, res: ${res}`);
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
  Logger.debug(`util > sizeToBytes ... size: ${size}, res: ${res}`);
  return res
}

/**
 * @name checkZeroSizeToGB
 * @description 
 * 
 * @param {number} size 
 * @returns {string} 변환 된 값
 */
export function checkZeroSizeToGB(size) {
  const res = convertBytesToGB(size) < 1 ? "< 1 GB" : `${convertBytesToGB(size)} GB`
  Logger.debug(`util > checkZeroSizeToGB ... size: ${size}, res: ${res}`);
  return res;
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
  Logger.debug(`util > checkZeroSizeToMB ... size: ${size}, res: ${res}`);
  return res;
}


export function convertBpsToMbps(bytes) {
  const res = bytes / 1_000_000;
  Logger.debug(`util > convertBpsToMbps ... bytes: ${bytes}, res: ${res}`)
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
  Logger.debug("SettingUsersModal > validatePw ... ");
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



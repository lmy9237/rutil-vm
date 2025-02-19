/**
 * @name CheckKoreanName
 * @description 한글이 들어갔는지 확인
 * 
 * @param {string} name 문자열
 * @returns 
 */
export function CheckKoreanName(name) {
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(name);
  if (hasKorean) {
    return false; // 한글이 포함된 경우 false 반환
  }
  return true; // 검사를 통과한 경우 true 반환
}

/**
 * 숫자 구분
 */
export function formatNumberWithCommas(number) {
  return number.toLocaleString(); // Locale 기반 쉼표 포맷
}

/**
 * byte -> mb
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in MB.
 */
export function convertBytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(0);
}

/**
 * byte -> gb
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in GB.
 */
export function convertBytesToGB(bytes) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(0);
}

/**
 * byte -> gb 소수점 한자리 출력
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in GB.
 */
export function convertBytesToGBFixed1(bytes) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(1);
}

/**
 * GB로 받은 값을 byte로 변경
 * 가상머신 생성, 디스크 생성에서 사용
 * @param {number} size 
 * @returns 
 */
export function sizeToBytes(size) {
  return parseInt(size, 10) * 1024 * 1024 * 1024
}


export function checkZeroSizeToGB(size) {
  return convertBytesToGB(size) < 1 ? "< 1 GB" : `${convertBytesToGB(size)} GB`;
}

export function checkZeroSizeToMB(size) {
  return convertBytesToMB(size) < 1 ? "< 1 MB" : `${convertBytesToMB(size)} MB`;
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
  console.log("SettingUsersModal > validateUsername ... ");
  if (!username) {
    console.error("SettingUsersModal > validateForm ... username EMPTY ");
    return "아이디를 입력해주세요.";
  }
  if (username.length < 4)  {
    console.error(`SettingUsersModal > validateForm ... username.length: ${username.length}`);
    return "아이디 길이가 짧습니다. (4자 이상)";
  }
  if (oneUser != null && oneUser.username === username) {
    console.error(`SettingUsersModal > validateForm ... duplicate ovirt user FOUND!: ${oneUser.username}`);
    return "중복된 아이디가 있어 사용할 수 없습니다.";
  }
  console.log("SettingUsersModal > validateUsername ... ALL GOOD!");
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
export const validatePw = (pasword, repassword) => {
  console.log("SettingUsersModal > validatePw ... ");
  if (!pasword) {
    console.error("SettingUsersModal > validateForm ... password EMPTY ");
    return "비밀번호를 입력해주세요.";
  }
  if (pasword.length < 4)  {
    console.error(`SettingUsersModal > validateForm ... pasword.length: ${pasword.length}`);
    return "비밀번호 길이가 짧습니다. (4자 이상)";
  }
  if (pasword !== repassword)  {
    console.error(`SettingUsersModal > validateForm ... pasword: ${pasword}, repasword: ${repassword}`);
    return "비밀번호가 같지 않습니다.";
  }
  return null;
}
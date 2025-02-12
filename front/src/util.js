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



/***
 * 숫자 구분
 */
export function formatNumberWithCommas(number) {
  return number.toLocaleString(); // Locale 기반 쉼표 포맷
}

/**
 * Converts bytes to megaabytes and formats the result to one decimal place.
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in MB.
 */
export function formatBytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(0);
}

/**
 * Converts bytes to gigabytes and formats the result to one decimal place.
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The formatted size in GB.
 */
export function formatBytesToGB(bytes) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(1);
}

export function formatBytesToGBToFixedZero(bytes) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(0);
}

export function sizeToBytes(size) {
  return parseInt(size, 10) * 1024 * 1024 * 1024
}

export function zeroValue(size) {
  return size < 1 ? "< 1 GB" : `${size} GB`;
}


// const sizeToGB = (data) => (data / Math.pow(1024, 3));
// const formatSize = (size) => (sizeToGB(size) < 1 ? '< 1 GB' : `${sizeToGB(size).toFixed(0)} GB`);


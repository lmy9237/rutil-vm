const baseUrl = () => {
  let _value = 'localhost'; // 기본값
  try {
    _value = import.meta.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS;
    if (import.meta.env.PROD) _value = '__RUTIL_VM_OVIRT_IP_ADDRESS__';
  } catch(e) {
     console.error(`Constants > baseUrl ... ${e.message}`)
  }
  console.log(`Constants > baseUrl ... value: ${_value}`)
  return _value;
}

const itemsPerPage = () => {
  let _value = 10; // 기본값
  try {
    _value = parseInt(import.meta.env.VITE_RUTIL_VM_ITEMS_PER_PAGE);
    if (import.meta.env.PROD) _value = parseInt('__RUTIL_VM_ITEMS_PER_PAGE__');
  } catch(e) {
     console.error(`Constants > itemsPerPage ... ${e.message}`)
  }
  console.log(`Constants > itemsPerPage ... value: ${_value}`)
  return _value;
}

const isLoggingEnabled = () => {
  const _value = import.meta.env.VITE_RUTIL_VM_LOGGING_ENABLED === "true" || 
    '__RUTIL_VM_LOGGING_ENABLED__' === 'true';
  console.debug(`Constants > isLoggingEnabled ... value: ${_value}`)
  return _value
}

/**
 * @name CONSTANT
 * 
 * @prop {number} itemsPerPage 페이징테이블에서 목록 1페이지 당 개수
 * @prop {boolean} isLoggingEnabled 로깅 활성화 여부
 */
const CONSTANT = {
  baseUrl: baseUrl(),
  itemsPerPage: itemsPerPage(),
  isLoggingEnabled: isLoggingEnabled(),
  templateIdDefault: "00000000-0000-0000-0000-000000000000"
}

export default CONSTANT;
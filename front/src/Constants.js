const itemsPerPage = () => {
  let _value = 10; // default
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
  itemsPerPage: itemsPerPage(),
  isLoggingEnabled: isLoggingEnabled()
}

export default CONSTANT;
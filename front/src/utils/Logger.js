const isLoggingEnabled = 
  import.meta.env.VITE_RUTIL_VM_LOGGING_ENABLED === "true" || 
  '__RUTIL_VM_LOGGING_ENABLED__' === 'true';

let Logger = {
  label: `This is RutilVM's Logger`,
  debug: () => {},
  table: () => {},
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.warn(...args)
}

if (isLoggingEnabled) {
  Logger = {
    label: `This is RutilVM's Logger`,
    debug: (...args) => console.log(...args),
    table: (...args) => console.table(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.warn(...args)
  }
} 

export default Logger;
import CONSTANT from "@/Constants";

let Logger = {
  label: `This is RutilVM's Logger`,
  debug: (...args) => CONSTANT.isLoggingEnabled && console.log(...args),
  table: (...args) => CONSTANT.isLoggingEnabled && console.table(...args),
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.warn(...args)
}

export default Logger;
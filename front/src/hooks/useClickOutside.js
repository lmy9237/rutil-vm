import { useRef, useEffect } from "react"
import Logger from "../utils/Logger"

const useClickOutside = (
  elementRef,
  callback
) => {
  const callbackRef = useRef(null)
  callbackRef.current = callback

  const stopPropagation = (e) => e.stopPropagation();
  const handleClickOutside = (e) => {
    if (!elementRef?.current?.contains(e?.target) && callbackRef?.current) {
      Logger.debug(`hooks > useClickOutside ... callback will TRIGGER`)
      stopPropagation(e)
      callbackRef.current(e)
    }
  }
  useEffect(() => {
    Logger.debug(`hooks > useClickOutside ... `)
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [callbackRef, elementRef])
}

export default useClickOutside
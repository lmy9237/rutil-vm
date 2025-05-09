import { useRef, useEffect } from "react"
import Logger from "../utils/Logger"

/**
 * @name useClickOutside
 * @description 클릭 밖 이벤트 처리
 * 
 * @param {JSX.MutableRefObject} elementRef ref객체
 * @param {function} callback 이벤트 트리거 후 처리
 * @param {Array<string>} closestElements 그 외 대상 객체 (selector 유형)
 */
const useClickOutside = (
  elementRef,
  callback,
  closestElements=[],
) => {
  const callbackRef = useRef(null)
  callbackRef.current = callback

  const handleClickOutside = (e) => {
    Logger.debug(`hooks > useClickOutside ... closestElements: `, closestElements)
    if (
      !elementRef?.current?.contains(e?.target) && 
      !closestElements?.reduce((acc, el, i) => acc || e.target.closest(el), false) &&
      callbackRef?.current
    ) {
      Logger.debug(`hooks > useClickOutside ... callback will TRIGGER`)
      // e.stopPropagation();
      callbackRef.current(e)
    }
  }
  useEffect(() => {
    Logger.debug(`hooks > useClickOutside ... `)
    document.addEventListener('mousedown', handleClickOutside, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [callbackRef, elementRef])
}

export default useClickOutside
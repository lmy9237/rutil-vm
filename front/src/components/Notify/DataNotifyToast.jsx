import toast, { useToaster } from "react-hot-toast/headless";
import Logger from "../../utils/Logger";

/**
 * @name DataNotifyToast
 * @description 데이터 정보를 불러주는 Toast 컴포넌트
 * 
 * @param {*} data
 *
 * @returns {JSX.Element} DataNotifyToast
 */
const DataNotifyToast = ({ data }) => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  Logger.debug("...")
  return (
    <div onMouseEnter={startPause} onMouseLeave={endPause}>
      {toasts.filter((toast) => toast.visible)
        .map((toast) => (
          <div key={toast.id} {...toast.ariaProps}>
            {toast.message}
          </div>
        ))}
    </div>
  )
}
;

import PropTypes from "prop-types"
import useGlobal                  from "@/hooks/useGlobal";
import Spinner                    from "@/components/common/Spinner";
import { 
  useValidationToast
} from "@/hooks/useSimpleToast";
import Logger                     from "@/utils/Logger";
import "./VmOs.css"

/**
 * @name VmOsIcon
 * @description (oVirt API에서 받아올) 가상머신 OS 아이콘 이미지 출력용
 * 
 * @param {string} dataUrl 아이콘 URL
 * @param {string} className
 * 
 * @returns {JSX.Element} 가상머신 OS 아이콘
 */
export const VmOsIcon = ({
  dataUrl,
  ...props
}) => {
  const { vmsSelected } = useGlobal();
  const selected1st = [...vmsSelected][0];

  return (
    <span className="vm-os-wrapper icon f-center"
      style={{
        cursor: props.disabled ? "normal" : "pointer"
      }}
      {...props}
    >
      {dataUrl 
        ? <img src={dataUrl} loading="lazy"
            className={`vm-icon ${props.className}`}
            alt=''
          />
        : <Spinner />}
    </span>
  );
}

VmOsIcon.propTypes = {
  // icon: PropTypes.object, // see the 'icons' reducer
  dataUrl: PropTypes.string,
  className: PropTypes.string, // either card-pf-icon or vm-detail-icon
}

export const VmOsScreenshot = ({
  dataUrl,
  ...props
}) => {
  const { vmsSelected } = useGlobal();
  const selected1st = [...vmsSelected][0];

  return (
    <span className="vm-os-wrapper screenshot f-center"
      {...props}
    >
      {dataUrl 
        ? <img src={dataUrl} loading="lazy"
            className={`vm-screenshot ${props.className}`}
            alt=''
          />
        : <Spinner />}
    </span>
  );
}

VmOsScreenshot.propTypes = {
  // icon: PropTypes.object, // see the 'icons' reducer
  dataUrl: PropTypes.string,
  className: PropTypes.string, // either card-pf-icon or vm-detail-icon
}
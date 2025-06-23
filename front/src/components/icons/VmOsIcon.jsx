import React from "react";
import PropTypes from 'prop-types'
import useGlobal                  from "@/hooks/useGlobal";
import Spinner                    from "@/components/common/Spinner";
import { 
  useValidationToast
} from "@/hooks/useSimpleToast";
import Logger                     from "@/utils/Logger";
import "./VmOsIcon.css"

/**
 * @name VmOsIcon
 * @description (oVirt API에서 받아올) 가상머신 OS 아이콘 이미지 출력용
 * 
 * @param {string} dataUrl 아이콘 URL
 * @param {string} className
 * 
 * @returns {JSX.Element} 가상머신 OS 아이콘
 */
const VmOsIcon = ({
  dataUrl,
  ...props
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected } = useGlobal();
  const selected1st = [...vmsSelected][0];
  const vmId = selected1st?.id;

  return (
    <span className="icon-os-wrapper f-center">
      {dataUrl 
        ? <img src={dataUrl} className={`icon-os ${props.className}`} alt='' />
        : <Spinner />}
    </span>
  );
}

VmOsIcon.propTypes = {
  // icon: PropTypes.object, // see the 'icons' reducer
  dataUrl: PropTypes.string,
  className: PropTypes.string, // either card-pf-icon or vm-detail-icon
}

export default VmOsIcon;
import React from "react";
import PropTypes from 'prop-types'
import useGlobal from "@/hooks/useGlobal";
import { openNewTab } from "@/navigation";
import "./VmOsIcon.css"
import Logger from "@/utils/Logger";
import { useValidationToast } from "@/hooks/useSimpleToast";

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

  const handleStartConsole = () => {
    Logger.debug(`VmOsIcon > handleStartConsole ... `);
    if (vmId === undefined || vmId === null || vmId === "") {
      validationToast.fail("웹 콘솔을 시작할 수 없습니다. (가상머신 ID 없음)");
      return;
    }
    openNewTab("console", vmId); 
  };

  return (
    <span className="icon-os-wrapper">
      <div>
        {dataUrl 
          ? <img src={dataUrl} className={`icon-os ${props.className}`} alt='' />
          : null}
      </div>
      <button 
        onClick={handleStartConsole}
        className="mt-3 w-full fs-14"
        disabled={!selected1st?.qualified4ConsoleConnect}
      >
        웹 콘솔 시작
      </button>
    </span>
  );
}

VmOsIcon.propTypes = {
  // icon: PropTypes.object, // see the 'icons' reducer
  dataUrl: PropTypes.string,
  className: PropTypes.string, // either card-pf-icon or vm-detail-icon
}

export default VmOsIcon;
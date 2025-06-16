import React from "react";
import PropTypes from 'prop-types'
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
  className=""
}) => (
  <>
  <span className="icon-os-wrapper">
    <div>
      {dataUrl 
        ? <img src={dataUrl} className={`icon-os ${className}`} alt='' />
        : null}
    </div>
    <button className="mt-3 w-[100%] fs-14">웹 콘솔 시작</button>
  </span>
  </>
)

VmOsIcon.propTypes = {
  // icon: PropTypes.object, // see the 'icons' reducer
  dataUrl: PropTypes.string,
  className: PropTypes.string, // either card-pf-icon or vm-detail-icon
}

export default VmOsIcon;
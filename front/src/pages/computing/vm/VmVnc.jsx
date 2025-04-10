import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import HeaderButton from '../../../components/button/HeaderButton';
import Vnc from "../../../components/Vnc";
import { rvi24Desktop } from '../../../components/icons/RutilVmIcons';
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import { useVm } from "../../../api/RQHook";
import "./VmVnc.css"

/**
 * @name VmVnc
 * @description 가상머신 접속 VNC 페이지
 * #/vnc/<VM_ID>
 *  
 * @returns 
 */
const VmVnc = ({
  ...props
}) => {
  const { 
    id: vmId,
  } = useParams();
  const { data: vm } = useVm(vmId);
  
  const screenRef = useRef(null);
  const takeScreenshot = () => {
    Logger.debug(`VmVnc > takeScreenshot ... `);
    // If you have access to the canvas element:
    const r = screenRef.current;
    if (!r) {
      Logger.warn(`VmVnc > takeScreenshot ... no ref FOUND`);
      return
    }
    const canvas = r.querySelector('canvas');
    if (!canvas) {
      Logger.warn(`VmVnc > takeScreenshot ... no canvas FOUND`);
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    Logger.debug(`VmVnc > takeScreenshot ... dataUrl: ${dataUrl}`);
    // Do something with the dataUrl (e.g., display it, send to server, etc.)
  };

  const sectionHeaderButtons = [
    { type: "screenshot", label: "스크린샷", onClick: () => takeScreenshot()}
  ]

  Logger.debug("VmVnc ...")
  return (
    <div className="section-vnc w-full h-full v-center">
      <HeaderButton titleIcon={rvi24Desktop("#F8F8F8")}
        title={vm?.name ?? "RutilVM에 오신걸 환영합니다."}
        status={Localization.kr.renderStatus(vm?.status)}
        buttons={sectionHeaderButtons}
        inverseColor
      />
      <div
        className="section-vnc-content" 
      >
        <Vnc vmId={vmId}
          autoConnect={true}
          ref={screenRef}
        />
      </div>
    </div>
  );
}

export default VmVnc;

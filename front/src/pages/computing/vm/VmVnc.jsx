import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useCopyToClipboard     from "@/hooks/useCopyToClipboard";
import HeaderButton           from "@/components/button/HeaderButton";
import Vnc                    from "@/components/Vnc";
import {
  rvi24Desktop
} from "@/components/icons/RutilVmIcons";
import {
  useVm
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./VmVnc.css"
import CONSTANT from "@/Constants";
import { useValidationToast } from "@/hooks/useSimpleToast";
import useGlobal from "@/hooks/useGlobal";
import useUIState from "@/hooks/useUIState";

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
  const { setVncScreenshotDataUrl } = useUIState()
  const { id: vmId, } = useParams();
  const {
    data: vm,
  } = useVm(vmId);
  const { validationToast } = useValidationToast()

  const screenRef = useRef(null);
  const [dataUrl, setDataUrl] = useState()
  const [copied, copy] = useCopyToClipboard(dataUrl)
  
  const takeScreenshotFromRFB = (rfb) => {
    Logger.debug(`VmVnc > takeScreenshotFromRFB ...`)
    if (rfb && rfb._display && rfb._display._target) {
      try {
        const canvas = rfb._display._target;
        setDataUrl(canvas.toDataURL('image/png'));
        setVncScreenshotDataUrl(vmId, dataUrl);
        Logger.debug(`VmVnc > takeScreenshotFromRFB ... dataUrl: ${dataUrl}`);
        triggerDownload()
        import.meta.env.DEV && validationToast.debug(`스크린샷 클립보드로 복사 완료`);
      } catch(error) {
        Logger.error(`VmVnc > takeScreenshotFromRFB ... error: ${error.message}`);
      }
    }
  }

  const triggerDownload = () => {
    Logger.debug(`VmVnc > triggerDownload ...`)
    if (!dataUrl) {
      Logger.warn('VmVnc > triggerDownload ... no screenshot data available');
      return;
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace(/-/g, '');
    const filename = `screenshot-${vmId}-${timestamp}.png`
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const sectionHeaderButtons = [
    { type: "screenshot", label: "스크린샷", onClick: () => takeScreenshotFromRFB(screenRef.current.rfb)}
  ]

  // 텝 이름변경
  useEffect(() => {
    Logger.debug(`VmVnc > useEffect ... `)
    if (vm && vm.name)
      document.title = `RutilVM (${vm.name})`
  }, [vmId, vm])

  return (
    <div
      className="section-vnc w-full h-full v-center"
    >
      <HeaderButton titleIcon={rvi24Desktop(CONSTANT.color.white)}
        title={vm?.name ?? "RutilVM에 오신걸 환영합니다."}
        status={Localization.kr.renderStatus(vm?.status)}
        buttons={sectionHeaderButtons}
        inverseColor
      />
      <div
        className="section-vnc-content" 
      >
        <Vnc vmId={vmId}
          ref={screenRef}
          autoConnect={true}
        />
      </div>
    </div>
  );
}

export default VmVnc;

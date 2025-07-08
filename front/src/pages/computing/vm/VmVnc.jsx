import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CONSTANT                         from "@/Constants";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import useCopyToClipboard               from "@/hooks/useCopyToClipboard";
import RightClickMenu                   from "@/components/common/RightClickMenu";
import HeaderButton                     from "@/components/button/HeaderButton";
import Vnc                              from "@/components/Vnc";
import {
  rvi24Desktop
} from "@/components/icons/RutilVmIcons";
import {
  useVm,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
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
  const { validationToast } = useValidationToast()
  const { setActiveModal, setVncScreenshotDataUrl } = useUIState()
  const { vmsSelected, setVmsSelected } = useGlobal()
  const { id: vmId, } = useParams();
  const { data: vm } = useVm(vmId);

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

  const doSendCtrlAltDel = (rfb) => {
    Logger.debug(`VmVnc > doSendCtrlAltDel ... `)
    rfb.sendCtrlAltDel()
    import.meta.env.DEV && validationToast.debug(`Ctrl+Alt+Del 입력 완료`);
  }

  const sectionHeaderButtons = [
    { type: "screenshot",  onClick: () => takeScreenshotFromRFB(screenRef.current.rfb), label: "스크린샷", },
    { type: "ctrlaltdel",  onClick: () => doSendCtrlAltDel(screenRef.current.rfb), label: "Ctrl+Alt+Del",  },
    { type: "updateCdrom", onClick: () => setActiveModal("vm:updateCdrom"), label: Localization.kr.UPDATE_CDROM,       disabled: vm?.notRunning ?? false },
  ]

  useEffect(() => {
    Logger.debug(`VmVnc > useEffect ... `)
    setVmsSelected(vm)
    if (vm?.name) {
      document.title = `RutilVM (${vm.name})`
    }
  }, [vmId, vm])

  return (<>
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
    <RightClickMenu />
  </>);
}

export default VmVnc;

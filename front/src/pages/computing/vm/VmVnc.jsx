import React, { useState, useEffect, useMemo, useRef } from "react";
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
  rvi24Desktop,
} from "@/components/icons/RutilVmIcons";
import {
  useVm,
} from "@/api/RQHook";
import {
  refetchIntervalInMilli
} from "@/util";
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
  const { 
    vmsSelected, setVmsSelected,
    setCurrentVncRfb,
  } = useGlobal()
  const { id: vmId } = useParams();
  const fetchVm = useVm(vmId);
  const vm = fetchVm.data;

  const screenRef = useRef(null);
  const [dataUrl, setDataUrl] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, copy] = useCopyToClipboard(dataUrl)

  const allUp = vmsSelected.length > 0 && vmsSelected.every(vm => vm?.running ?? false);
  const allDown = vmsSelected.length > 0 && vmsSelected.every(vm => vm?.notRunning ?? false);
  const allPause = vmsSelected.length > 0 && vmsSelected.every(vm => 
    vm?.status?.toLowerCase() === "PAUSED".toLowerCase() || 
    vm?.status?.toLowerCase() === "SUSPENDED".toLowerCase()
  );
  const allMaintenance = vmsSelected.length > 0 && vmsSelected.every(vm => 
    vm?.status?.toLowerCase() === "MAINTENANCE".toLowerCase()
  );
  const allOkay2PowerDown = vmsSelected.length > 0 && vmsSelected.every(vm => {
    const status = vm?.status?.toLowerCase();
    return (
      vm?.qualified4PowerDown ||
      status.toLowerCase() === "DOWN".toLowerCase() ||
      status.toLowerCase() === "SUSPENDED".toLowerCase() ||
      status.toLowerCase() === "REBOOT_IN_PROGRESS".toLowerCase()
    );
  });

  const sectionHeaderButtons = [
    { 
      type: "start", 
      onClick: () => {
        // TODO: API 아직 덜됨
        /*
        const hasBootableDisk = selected1st?.diskAttachmentVos?.some(d => d.bootable);
        if (!hasBootableDisk || hasPreviewSnapshot) {
          validationToast.fail("부팅 가능한 디스크가 최소 1개는 있어야 합니다.");
          return;
        }
        */
        setActiveModal("vm:start");
      }, 
      label: Localization.kr.START,
      disabled: !(allDown || allPause || allMaintenance) 
    },
    { type: "pause",             onClick: () => setActiveModal("vm:pause"),                   label: Localization.kr.PAUSE,                                   disabled: !allUp },
    { type: "reboot",            onClick: () => setActiveModal("vm:reboot"),                  label: Localization.kr.REBOOT,                                  disabled: !allUp },
    { type: "reset",             onClick: () => setActiveModal("vm:reset"),                   label: Localization.kr.RESET,                                   disabled: !allUp },
    { type: "shutdown",          onClick: () => setActiveModal("vm:shutdown"),                label: Localization.kr.END,                                     disabled: !allOkay2PowerDown },
    { type: "powerOff",          onClick: () => setActiveModal("vm:powerOff"),                label: Localization.kr.POWER_OFF,                               disabled: !allOkay2PowerDown },
    { type: "screenshot",        onClick: () => takeScreenshotFromRFB(screenRef.current.rfb), label: Localization.kr.SCREENSHOT,                              disabled: !allUp },
    { type: "ctrlaltdel",        onClick: () => doSendCtrlAltDel(screenRef.current.rfb),      label: "Ctrl+Alt+Del",                                          disabled: !allUp },
    { type: "updateCdrom",       onClick: () => setActiveModal("vm:updateCdrom"),             label: Localization.kr.UPDATE_CDROM,                            disabled: vm?.notRunning ?? false },
    { type: "fullscreen",        onClick: () => toggleFullscreen(),                           label: Localization.kr.FULLSCREEN, },
  ]

  if (import.meta.env.DEV) sectionHeaderButtons.push(
    { type: "vncClipboardPaste", onClick: () => setActiveModal("vm:vncClipboardPaste"),       label: `${Localization.kr.CLIPBOARD} ${Localization.kr.PASTE}`, disabled: !allUp }
  )

  // Function to toggle fullscreen mode
  const vncContainerRef = useRef(null)
  const toggleFullscreen = () => {
    Logger.debug(`VmVnc > toggleFullscreen ...`)
    if (!vncContainerRef.current) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      vncContainerRef.current.requestFullscreen().catch((err) => {
        validationToast.fail(`${Localization.kr.FULLSCREEN} ${Localization.kr.ACTIVATE} 실패: ${err.message} (${err.name})`);
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen();
    }
  };

  const takeScreenshotFromRFB = (rfb) => {
    Logger.debug(`VmVnc > takeScreenshotFromRFB ...`)
    if (rfb && rfb._display && typeof rfb.toDataURL === "function") {
      try {
        const _dataUrl = rfb.toDataURL('image/png');
        Logger.debug(`VmVnc > takeScreenshotFromRFB ... dataUrl: ${_dataUrl}`);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace(/-/g, '');
        const filename = `screenshot-${vmId}-${timestamp}.png`
        
        const link = document.createElement('a');
        link.href = _dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        validationToast.debug(`${Localization.kr.SCREENSHOT} 클립보드로 복사 완료`);
        setDataUrl(_dataUrl);
        setVncScreenshotDataUrl(vmId, _dataUrl);
      } catch(error) {
        Logger.error(`VmVnc > takeScreenshotFromRFB ... error: ${error.message}`);
      }
    }
  }

  const doSendCtrlAltDel = (rfb) => {
    Logger.debug(`VmVnc > doSendCtrlAltDel ... `)
    rfb.sendCtrlAltDel()
    validationToast.debug(`Ctrl+Alt+Del 입력 완료`);
  }

  useEffect(() => {
    Logger.debug(`VmVnc > useEffect ... (for vnc rfb)`)
    if (!screenRef.current?.rfb) return;
    setCurrentVncRfb(screenRef.current.rfb)
  }, [screenRef.current])

  useEffect(() => {
    Logger.debug(`VmVnc > useEffect ... (for fullscreen)`)
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {document.removeEventListener('fullscreenchange', handleFullscreenChange);};
  }, []);

  useEffect(() => {
    Logger.debug(`VmVnc > useEffect ... (for VM status check)`)
    setVmsSelected(vm)
    if (vm?.name) document.title = `RutilVM (${vm.name})`
    const intervalInMilli = refetchIntervalInMilli(vm?.status)
    Logger.debug(`VmVnc > useEffect ... look for VM status (${vm?.status}) in ${intervalInMilli/1000} second(s)`)
    const intervalId = setInterval(() => {
      fetchVm.refetch()
    }, intervalInMilli) // 주기적 조회
    return () => {clearInterval(intervalId)}
  }, [vmId, vm])

  return (<>
    <div ref={vncContainerRef}
      className="section-vnc w-full h-full v-center"
    >
      <HeaderButton title={vm?.name ?? "RutilVM에 오신걸 환영합니다."}
        titleIcon={rvi24Desktop(CONSTANT.color.white)}
        status={Localization.kr.renderStatus(vm?.status)}
        isLoading={fetchVm.isLoading} isRefetching={fetchVm.isRefetching} refetch={fetchVm.refetch}
        buttons={sectionHeaderButtons}
        inverseColor
      />
      <div
        className="section-vnc-content" 
      >
        <Vnc vmId={vmId}
          api={fetchVm}
          ref={screenRef}
          autoConnect={true}
        />
      </div>
    </div>
    <RightClickMenu />
  </>);
}

export default VmVnc;

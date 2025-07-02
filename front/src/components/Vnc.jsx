import React, { forwardRef, useEffect, useState } from 'react'
import { VncScreen } from 'react-vnc'
import CONSTANT                   from "@/Constants";
import { useValidationToast }     from "@/hooks/useSimpleToast";
import useUIState                 from "@/hooks/useUIState";
import Spinner                    from "@/components/common/Spinner";
import {
  useVmConsoleAccessInfo,
  useVm
} from "@/api/RQHook";
import Localization               from "@/utils/Localization";
import Logger                     from "@/utils/Logger";
import "./Vnc.css"

const Vnc = forwardRef(({
  vmId, autoConnect = false,
  isPreview=false,
  onSuccess,
  ...props
}, ref) => {
  // 1. VM 정보 가져오기 (상태 확인용)
  // const [intervalId, setIntervalId] = useState("");
  const { data: vm } = useVm(vmId);
  const status = vm?.status ?? "";
  const isVmQualified4ConsoleConnect = vm?.qualified4ConsoleConnect ?? false;

  // 2. 콘솔 정보: VM이 실행중일 때만 요청
  const {
    data: vmConsoleAccessInfo, 
    error,
    refetch: refetchVmConsoleAccessInfo,
  } = useVmConsoleAccessInfo(vmId, {
    enabled: isVmQualified4ConsoleConnect
  });

  // 3. WebSocket URL 구성
  let wsUrl = `wss://${CONSTANT.baseUrl}/ws`;
  if (import.meta.env.PROD) {
    wsUrl = "wss://__RUTIL_VM_OVIRT_IP_ADDRESS__/ws";
  }

  const isReady = () => 
    isVmQualified4ConsoleConnect &&
    vmConsoleAccessInfo !== null && vmConsoleAccessInfo !== undefined &&
    vmConsoleAccessInfo?.address !== null && vmConsoleAccessInfo?.address !== undefined &&
    vmConsoleAccessInfo?.port !== null && vmConsoleAccessInfo?.port !== undefined && !isNaN(vmConsoleAccessInfo?.port) && 
    vmConsoleAccessInfo?.token !== null && vmConsoleAccessInfo?.token !== undefined;

  const isValid = (url) => url.startsWith("ws://") || url.startsWith("wss://");

  const fullAccessUrl = () =>
    `${wsUrl}/${vmConsoleAccessInfo?.address}:${vmConsoleAccessInfo?.port}`;

  if (error) {
    Logger.error("VNC API 오류:", error.message);
  }

  const renderUnavailableMessage = () => {
    if (!status) {
      return <>콘솔 정보를 불러오는 중입니다...</>;
    }

    if (!isVmQualified4ConsoleConnect) {
      return (
        <>
          {Localization.kr.VM}이{" "}
          <span className="text-red-600 font-bold text-[16px]">{Localization.kr.renderStatus(status)}</span>(상태) 입니다. 콘솔을 사용할 수 없습니다.
        </>
      );
    }

    return (
      <>
        {Localization.kr.VM}이 현재 상태 (<span className="text-green-600 font-bold text-[16px]">{Localization.kr.renderStatus(status)}</span>)에서는 콘솔 연결이 제한됩니다.
      </>
    );
  };

  useEffect(() => {
    Logger.debug(`Vnc > useEffect ... `)
    if (isValid(wsUrl) && isReady()) return;
    
    const intervalId = setInterval(() => {
      // 2초간의 간격으로 상태를 확인하도록
      refetchVmConsoleAccessInfo();
    }, 2000);
    
    return () => {
      clearInterval(intervalId)
    }
  }, [isVmQualified4ConsoleConnect, vmConsoleAccessInfo])

  return (
    <div
      className={`${isPreview ? "vnc-size-preview" : "w-full h-full"} ${props.className}`}
      {...props}
    >
      {isReady() && isValid(wsUrl) ? (
        <VncScreen
          ref={ref}
          loadingUI={`${Localization.kr.LOADING} ${Localization.kr.IN_PROGRESS}`}
          url={fullAccessUrl()}
          viewOnly={isPreview}
          autoConnect={autoConnect}
          rfbOptions={{
            wsProtocols: ['binary']
          }}
          retryDuration={3000}
          scaleViewport
          background="#222222"
          style={{width:'100%',height:'100%',}}
          debug
          onConnect={(rfb) => {
            Logger.debug("Vnc > onConnect ... ")
            setTimeout(() => {
              onSuccess && onSuccess(rfb)
            }, 400)
          }}
          onDisconnect={(rfb) => { 
            Logger.debug("Vnc > onDisconnect ... ")
          }}
          onCredentialsRequired={(rfb) => {
            Logger.debug("Vnc > 인증 필요");
            rfb.sendCredentials({
              password: vmConsoleAccessInfo?.token
            });
          }}
          onSecurityFailure={(e) => {
            Logger.error(`Vnc > 보안 오류: ${e?.detail?.reason}`);
            refetchVmConsoleAccessInfo()
          }}
          onClipboard={(e) => {
            Logger.debug(`Vnc > 클립보드: ${e.detail}`);
          }}
          showDotCursor={true}
        />
      ) : (
        <div className="vnc-status-message">
          {renderUnavailableMessage()}
        </div>
      )}
    </div>
  );
});

export default Vnc;

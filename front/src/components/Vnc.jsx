import React, { forwardRef } from 'react'
import { VncScreen } from 'react-vnc'
import CONSTANT                   from '@/Constants';
import {
  useVmConsoleAccessInfo,
  useVm
} from "@/api/RQHook";
import Localization               from "@/utils/Localization";
import Logger                     from "@/utils/Logger";
import "./Vnc.css"

const Vnc = forwardRef(({
  vmId, autoConnect = false,
  isPreview = false,
  ...props
}, ref) => {

  // 1. VM 정보 가져오기 (상태 확인용)
  const { data: vm } = useVm(vmId);
  const status = vm?.status ?? "";
  const isVmQualified4ConsoleConnect = vm?.qualified4ConsoleConnect ?? false;

  // 2. 콘솔 정보: VM이 실행중일 때만 요청
  const {
    data: vmConsoleAccessInfo, 
    error
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
    vmConsoleAccessInfo &&
    vmConsoleAccessInfo.address &&
    vmConsoleAccessInfo.port &&
    vmConsoleAccessInfo.token;

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

  return (
    <div
      className={isPreview ? "vnc-size-preview" : "w-full h-full"}
      ref={ref}
    >
      {isReady() && isValid(wsUrl) ? (
        <VncScreen
          url={fullAccessUrl()}
          autoConnect={autoConnect}
          rfbOptions={{
            wsProtocols: ['binary']
          }}
          scaleViewport
          background="#000000"
          style={{ width: '100%', height: '100%' }}
          debug
          onConnect={() => Logger.debug("Vnc > 연결됨")}
          onDisconnect={() => Logger.debug("Vnc > 연결 종료됨")}
          onCredentialsRequired={(rfb) => {
            Logger.debug("Vnc > 인증 필요");
            rfb.sendCredentials({
              password: vmConsoleAccessInfo?.token
            });
          }}
          onSecurityFailure={(e) => {
            Logger.error(`Vnc > 보안 오류: ${e?.detail?.reason}`);
          }}
          onClipboard={(e) => {
            Logger.debug(`Vnc > 클립보드: ${e.detail}`);
          }}
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

// import React, { forwardRef, useEffect,  } from 'react'
// import { VncScreen } from 'react-vnc'
// import CONSTANT from '@/Constants';
// import {
//   useVmConsoleAccessInfo
// } from "@/api/RQHook";
// import Localization           from "@/utils/Localization";
// import Logger                 from "@/utils/Logger";
// import "./Vnc.css"

// const Vnc = forwardRef(({
//   vmId, autoConnect=false,
//   isPreview=false,
//   ...props
// }, ref) => {
//   const { data: vmConsoleAccessInfo } = useVmConsoleAccessInfo(vmId);  


//   let wsUrl = `wss://${CONSTANT.baseUrl}/ws`;
//   // let wsUrl = `wss://localhost/ws`;
//   if (import.meta.env.PROD) {
//     Logger.debug("THIS IS PRODUCTION !!!");
//     Logger.debug(`VmLoggerModal ... import.meta.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: __RUTIL_VM_OVIRT_IP_ADDRESS__\n\n`);
//     wsUrl = "wss://__RUTIL_VM_OVIRT_IP_ADDRESS__/ws";
//   }

//   const isReady = () => vmId !== undefined
//     && vmConsoleAccessInfo !== null && vmConsoleAccessInfo !== undefined
//     && vmConsoleAccessInfo?.address !== null && vmConsoleAccessInfo?.address !== ""
//     && vmConsoleAccessInfo?.port !== null && vmConsoleAccessInfo?.port !== ""
//     && vmConsoleAccessInfo?.token !== null && vmConsoleAccessInfo?.token !== ""
//     && vmConsoleAccessInfo?.vm !== null && vmConsoleAccessInfo?.vm !== ""
  
//   const isValid = (vncUrl) => {
//     if (!vncUrl.startsWith('ws://') && !vncUrl.startsWith('wss://')) {
//       return false;
//     }
//     return true;
//   };
//   const fullAccessUrl = () => `${wsUrl}/${vmConsoleAccessInfo?.address}:${vmConsoleAccessInfo?.port}`
  
//   isReady() && Logger.debug(
//     `... wsUrl: ${wsUrl}, address: ${vmConsoleAccessInfo?.address}, port: ${vmConsoleAccessInfo?.port}, ticket: ${vmConsoleAccessInfo?.token}`
//   );
//   isReady() && Logger.debug(`... fullAccessUrl: ${fullAccessUrl()}`)

//   /*
//   useEffect(() => {
//     if (!ref.current) {
//       Logger.error('Container ref is not assigned');
//       return;
//     }

//     const rfb = new RFB(ref.current, fullAccessUrl(), {
//       credentials: { password: ticket },
//       wsProtocols: ['binary']
//     })
//     rfb.addEventListener('connect', () => {
//       Logger.debug("Vnc > Connected to VNC")
//     })

//     rfb.addEventListener('disconnect', (evt) => {
//       Logger.debug("Vnc > Disconnected from VNC", evt)
//     })

//     return () => {
//       rfb.disconnect();
//     };
//   }, [host, ticket])
//   */
 
//   return (
//     <div className={isPreview 
//       ? "vnc-size-preview"
//       : "w-full h-full"} 
//       ref={ref}
//     >
//     {isReady() && isValid(wsUrl) ? (
//       <VncScreen
//         url={fullAccessUrl()}
//         autoConnect={autoConnect}
//         rfbOptions={{
//           "wsProtocols": ['binary']
//         }}
//         scaleViewport
//         background="#000000"
//         style={{width: '100%', height: '100%'}}
//         debug
//         onConnect={(rfb) => {
//           Logger.debug("Vnc > onConnect ... ");
//         }}
//         onDisconnect={(rfb) => {
//           Logger.debug("Vnc > onDisconnect ... ");
//         }}
//         onCredentialsRequired={(rfb) => {
//           Logger.debug("Vnc > onCredentialsRequired ... ")
//           rfb.sendCredentials({
//             "password": vmConsoleAccessInfo?.token,
//           })
//         }}
//         onSecurityFailure={(e) => {
//           Logger.error(`Vnc > onSecurityFailure (${e?.detail?.status}): ${e?.detail?.reason}`)
//         }}
//         onClipboard={(e) => {
//           Logger.debug(`Vnc > onClipboard ${e.detail}`)
//         }}
//         // ref={ref}
//       />
//     ) : (
//       <div>VNC URL not provided.</div>
//     )}
//     </div>
//   )
// })

// export default Vnc

import React, { forwardRef } from 'react'
import { VncScreen } from 'react-vnc'
import CONSTANT from '@/Constants';
import {
  useVmConsoleAccessInfo,
  useVm
} from "@/api/RQHook";
import Localization from "@/utils/Localization";
import Logger from "@/utils/Logger";
import "./Vnc.css"

const Vnc = forwardRef(({
  vmId, autoConnect = false,
  isPreview = false,
  ...props
}, ref) => {

  // 1. VM 정보 가져오기 (상태 확인용)
  const { data: vm } = useVm(vmId);
  const status = vm?.status ?? "";
  const isVmRunning = status === "UP";

  // 2. 콘솔 정보: VM이 실행중일 때만 요청
  const { data: vmConsoleAccessInfo, error } = useVmConsoleAccessInfo(vmId, {
    enabled: isVmRunning
  });

  // 3. WebSocket URL 구성
  let wsUrl = `wss://${CONSTANT.baseUrl}/ws`;
  if (import.meta.env.PROD) {
    wsUrl = "wss://__RUTIL_VM_OVIRT_IP_ADDRESS__/ws";
  }

  const isReady = () =>
    isVmRunning &&
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

    // 콘솔이 제한되는 상태 목록
    const blockedStatuses = [
      "DOWN", "SUSPENDED", "POWERING_DOWN", "POWERING_UP", "WAIT_FOR_LAUNCH"
    ];

    if (blockedStatuses.includes(status)) {
      return (
        <>
          {Localization.kr.VM}이{" "}
          <strong>{Localization.kr.renderStatus(status)}</strong>(상태) 입니다. 콘솔을 사용할 수 없습니다.
        </>
      );
    }

    // 그 외의 비정상 상태(질문??)
    return (
      <>
        {Localization.kr.VM}이 현재 상태 (<strong>{Localization.kr.renderStatus(status)}</strong>)에서는 콘솔 연결이 제한됩니다.
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

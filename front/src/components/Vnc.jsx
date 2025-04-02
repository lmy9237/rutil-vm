import React, { forwardRef,  } from 'react'
import { VncScreen } from 'react-vnc'
import { useVmConsoleAccessInfo } from "../api/RQHook";
import Logger from '../utils/Logger';
import "./Vnc.css"

const Vnc = forwardRef(({
  vmId, autoConnect=false,
  isPreview=false,
  ...props
}, ref) => {
  const { data: vmConsoleAccessInfo } = useVmConsoleAccessInfo(vmId);  
  
  let wsUrl = `wss://localhost/ws`;
  if (import.meta.env.PROD) {
    Logger.debug("THIS IS PRODUCTION !!!");
    Logger.debug(`VmLoggerModal ... import.meta.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: __RUTIL_VM_OVIRT_IP_ADDRESS__\n\n`);
    wsUrl = "wss://__RUTIL_VM_OVIRT_IP_ADDRESS__/ws";
  }

  const isReady = () => vmId !== undefined && vmConsoleAccessInfo 
    && vmConsoleAccessInfo?.address 
    && vmConsoleAccessInfo?.port 
    && vmConsoleAccessInfo?.token
    && vmConsoleAccessInfo?.vm
  
  const isValid = (vncUrl) => {
    if (!vncUrl.startsWith('ws://') && !vncUrl.startsWith('wss://')) {
      return false;
    }
    return true;
  };
  const fullAccessUrl = () => `${wsUrl}/${vmConsoleAccessInfo?.address}:${vmConsoleAccessInfo?.port}`
  
  isReady() && Logger.debug(
    `... wsUrl: ${wsUrl}, address: ${vmConsoleAccessInfo?.address}, port: ${vmConsoleAccessInfo?.port}, ticket: ${vmConsoleAccessInfo?.token}`
  );
  isReady() && Logger.debug(`... fullAccessUrl: ${fullAccessUrl()}`)

  /*
  useEffect(() => {
    if (!ref.current) {
      Logger.error('Container ref is not assigned');
      return;
    }

    const rfb = new RFB(ref.current, fullAccessUrl(), {
      credentials: { password: ticket },
      wsProtocols: ['binary']
    })
    rfb.addEventListener('connect', () => {
      Logger.debug("Vnc > Connected to VNC")
    })

    rfb.addEventListener('disconnect', (evt) => {
      Logger.debug("Vnc > Disconnected from VNC", evt)
    })

    return () => {
      rfb.disconnect();
    };
  }, [host, ticket])
  */
 
  return (
    <div className={isPreview 
      ? "vnc-size-preview"
      : "w-full h-full"} 
      ref={ref}
    >
    {isReady() && isValid(wsUrl) ? (
      <VncScreen
        url={fullAccessUrl()}
        autoConnect={autoConnect}
        rfbOptions={{
          "wsProtocols": ['binary']
        }}
        scaleViewport
        background="#000000"
        style={{width: '100%', height: '100%'}}
        debug
        onConnect={(rfb) => {
          Logger.debug("Vnc > onConnect ... ");
        }}
        onDisconnect={(rfb) => {
          Logger.debug("Vnc > onDisconnect ... ");
        }}
        onCredentialsRequired={(rfb) => {
          Logger.debug("Vnc > onCredentialsRequired ... ")
          rfb.sendCredentials({
            "password": vmConsoleAccessInfo?.token,
          })
        }}
        onSecurityFailure={(e) => {
          Logger.error(`Vnc > onSecurityFailure (${e?.detail?.status}): ${e?.detail?.reason}`)
        }}
        onClipboard={(e) => {
          Logger.debug(`Vnc > onClipboard ${e.detail}`)
        }}
        // ref={ref}
      />
    ) : (
      <div>VNC URL not provided.</div>
    )}
    </div>
  )
})

export default Vnc
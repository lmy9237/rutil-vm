import React, { useRef } from 'react'
import { VncScreen } from 'react-vnc'
import { useVmConsoleAccessInfo } from "../api/RQHook";

const Vnc = ({
  vmId, autoConnect = false,
}) => {
  const { data: vmConsoleAccessInfo } = useVmConsoleAccessInfo(vmId);
    
  let wsUrl = `wss://localhost/ws`;
  if (import.meta.env.PROD) {
    console.log("THIS IS PRODUCTION !!!");
    console.log(`VmConsoleModal ... import.meta.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: __RUTIL_VM_OVIRT_IP_ADDRESS__\n\n`);
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
  const ref = useRef()
  isReady() && console.log(
    `... wsUrl: ${wsUrl}, address: ${vmConsoleAccessInfo?.address}, port: ${vmConsoleAccessInfo?.port}, ticket: ${vmConsoleAccessInfo?.token}`
  );
  isReady() && console.log(`... fullAccessUrl: ${fullAccessUrl()}`)

  /*
  useEffect(() => {
    if (!ref.current) {
      console.error('Container ref is not assigned');
      return;
    }

    const rfb = new RFB(ref.current, fullAccessUrl(), {
      credentials: { password: ticket },
      wsProtocols: ['binary']
    })
    rfb.addEventListener('connect', () => {
      console.log("Vnc > Connected to VNC")
    })

    rfb.addEventListener('disconnect', (evt) => {
      console.log("Vnc > Disconnected from VNC", evt)
    })

    return () => {
      rfb.disconnect();
    };
  }, [host, ticket])*/

  return (
    <>
      {isReady() && isValid(wsUrl) ? (
        <VncScreen
          url={fullAccessUrl()}
          autoConnect={true}
          rfbOptions={{
            "wsProtocols": ['binary']
          }}
          scaleViewport
          background="#000000"
          style={{
            width: '100%',
            height: '100%',
          }}
          debug
          onConnect={(rfb) => {
            console.log("Vnc > onConnect ... ");
          }}
          onDisconnect={(rfb) => {
            console.log("Vnc > onDisconnect ... ");
          }}
          onCredentialsRequired={(rfb) => {
            console.log("Vnc > onCredentialsRequired ... ")
            rfb.sendCredentials({
              "password": vmConsoleAccessInfo?.token,
            })
          }}
          onSecurityFailure={(e) => {
            console.error(`Vnc > onSecurityFailure (${e?.detail?.status}): ${e?.detail?.reason}`)
          }}
          onClipboard={(e) => {
            console.log(`Vnc > onClipboard ${e.detail}`)
          }} 
          ref={ref}
        />
      ) : (
        <div>VNC URL not provided.</div>
      )}
    </>
  )
}

export default Vnc
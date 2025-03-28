import React, { useRef } from 'react'
import { VncScreen } from 'react-vnc'
import HeaderButton from './button/HeaderButton';
import Localization from "../utils/Localization";

const Vnc = ({
  wsUrl, vm, host, port, ticket,
  autoConnect = false,
}) => {
  const isValid = (vncUrl) => {
    if (!vncUrl.startsWith('ws://') && !vncUrl.startsWith('wss://')) {
      return false;
    }
    return true;
  };
  const fullAccessUrl = () => `${wsUrl}/${host}:${port}`
  const Spacer = () => <div style={{ width: '2rem', display: 'inline-block' }} />;
  const ref = useRef()

  console.log(`... fullAccessUrl: ${fullAccessUrl()}`)
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
    <div style={{ margin: '1rem' }}>
      {/* <HeaderButton 
        title={vm?.name ?? "RutilVM에 오신걸 환영합니다."}
        status={Localization.kr.renderStatus(vm?.status)}
      /> */}
      <Spacer />
      {/*<input type="text" onChange={({ target: { value } }) => {
        setInputUrl(value);
      }} name="url" placeholder="wss://your-vnc-url" />
      */}
    </div>

    <div style={{ margin: '1rem' }}>
      <button
        onClick={() => {
          const { connect, connected, disconnect } = ref.current ?? {};
          if (connected) {
            console.log(`Vnv > onClick ... connected: ${connected}`)
            disconnect?.();
            return;
          }
          connect?.();
        }}
      >
        Connect / Disconnect
      </button>
    </div>

    <div style={{ margin: '1rem' }}>
      {
        isValid(wsUrl)
          ? (
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
                height: '60vh',
                // aspectRatio: '1024/'
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
                  "password": ticket,
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
            // <VncScreen 
            //   url={wsUrl}
            //   scaleViewport
            //   autoConnect={autoConnect}
            //   background='#333'
            //   style={{
            //     height: '650px',
            //     background: "#333",
            //   }}
            //   ref={ref}
            // />
          )
          : <div>VNC URL not provided.</div>
      }
    </div>
  </>
  )
}

export default Vnc
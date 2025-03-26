import React, { useRef } from 'react'
import { VncScreen } from 'react-vnc'

const Vnc = ({
  wsUrl, host, port, ticket,
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

  console.log(`... wsUrl: ${wsUrl} autoConnect: ${autoConnect}`)
  return (
    <>
    <div style={{ margin: '1rem' }}>
      <label htmlFor="url">RutilVM 접속시도</label>
      <Spacer />
      {/*<input type="text" onChange={({ target: { value } }) => {
        setInputUrl(value);
      }} name="url" placeholder="wss://your-vnc-url" />

      <Spacer />
       <button onClick={() => setVncUrl(inputUrl)}>Go!</button> */}
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
              scaleViewport
              background="#000000"
              style={{
                width: '100%',
                height: '75vh',
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
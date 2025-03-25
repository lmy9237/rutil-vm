import React, { useRef } from 'react'
import { VncScreen } from 'react-vnc'

const Vnc = ({
  wsUrl = '',
  autoConnect = false,
}) => {
  const isValid = (vncUrl) => {
    if (!vncUrl.startsWith('ws://') && !vncUrl.startsWith('wss://')) {
      return false;
    }

    return true;
  };

  const Spacer = () => <div style={{ width: '2rem', display: 'inline-block' }} />;

  const ref = useRef()

  console.log(`... wsUrl: ${wsUrl} autoConnect: ${autoConnect}`)
  return (
    <>
    <div style={{ margin: '1rem' }}>
      <label htmlFor="url">URL for VNC Stream</label>
      <Spacer />

      {/*<input type="text" onChange={({ target: { value } }) => {
        setInputUrl(value);
      }} name="url" placeholder="wss://your-vnc-url" />

      <Spacer />
       <button onClick={() => setVncUrl(inputUrl)}>Go!</button> */}
    </div>

    <div style={{ opacity: 0.5, margin: '1rem' }}>
      Since the site is loaded over HTTPS, only `wss://` URLs (SSL encrypted websockets URLs) are supported.
      <br />
      To test a `ws://` URL, clone the application and run it on http://localhost:3000, or <a href="https://experienceleague.adobe.com/docs/target/using/experiences/vec/troubleshoot-composer/mixed-content.html?lang=en#task_5448763B8DC941FD80F84041AEF0A14D">enable Mixed Content on your browser</a>.
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
          ?
          (
            <VncScreen
              url={wsUrl}
              scaleViewport
              background="#000000"
              style={{
                width: '75vw',
                height: '75vh',
              }}
              debug
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
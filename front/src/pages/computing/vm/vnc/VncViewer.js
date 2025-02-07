// VncViewer.jsx
import React, { useEffect, useRef, useState } from 'react';
// import RFB from '@novnc/novnc/core/rfb';
import RFB from '@novnc/novnc';
import './VncViewer.css'; // Create a CSS file to style your component

const VncViewer = () => {
  const [rfb, setRfb] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const vncContainerRef = useRef(null);
  const [host, setHost] = useState('');  // Input field for the host
  const [port, setPort] = useState('');  // Input field for the port
  const [password, setPassword] = useState('');  // Input field for the password

  useEffect(() => {
    // Cleanup function to disconnect from VNC server on component unmount
    return () => {
      if (rfb) {
        rfb.disconnect();
      }
    };
  }, [rfb]);

  const connectToVnc = () => {
    if (!host || !port) {
      setErrorMessage('Please provide both host and port.');
      return;
    }

    try {
      const url = `ws://${host}:${port}`;
      const newRfb = new RFB(vncContainerRef.current, url, { credentials: { password } });

      newRfb.addEventListener('connect', () => {
        setIsConnected(true);
        setErrorMessage('');
        console.log('Connected to VNC server');
      });

      newRfb.addEventListener('disconnect', () => {
        setIsConnected(false);
        setErrorMessage('Disconnected from VNC server');
        console.log('Disconnected from VNC server');
      });

      newRfb.addEventListener('securityfailure', (event) => {
        setErrorMessage(`Security failure: ${event.detail.status}`);
      });

      newRfb.addEventListener('credentialsrequired', () => {
        setErrorMessage('Authentication required');
      });

      setRfb(newRfb);
    } catch (error) {
      setErrorMessage(`Connection error: ${error.message}`);
      console.error('Connection error', error);
    }
  };

  const disconnectFromVnc = () => {
    if (rfb) {
      rfb.disconnect();
      setRfb(null);
      setIsConnected(false);
      setErrorMessage('');
    }
  };

  return (
    <div className="vnc-viewer-container">
      <div className="vnc-controls">
        <input
          type="text"
          placeholder="Host"
          value={host}
          onChange={(e) => setHost(e.target.value)}
        />
        <input
          type="text"
          placeholder="Port"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isConnected ? (
          <button onClick={connectToVnc}>Connect</button>
        ) : (
          <button onClick={disconnectFromVnc}>Disconnect</button>
        )}
      </div>
      {errorMessage && <div className="vnc-error">{errorMessage}</div>}
      <div ref={vncContainerRef} className="vnc-canvas"></div>
    </div>
  );
};

export default VncViewer;
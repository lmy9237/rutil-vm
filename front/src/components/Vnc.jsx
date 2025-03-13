import React, { useRef } from 'react'
import { VncScreen } from 'react-vnc'

const Vnc = ({
  wsUrl = '',
  autoConnect = false,
}) => {
  const ref = useRef()

  return (
    <VncScreen 
      url={wsUrl}
      scaleViewport
      autoConnect={autoConnect}
      background='#000000'
      style={{
        width: '75vw',
        height: '75vw',
      }}
      ref={ref}
    />
  )
}

export default Vnc
import React from 'react'
import BaseModal from "../BaseModal";
import Vnc from '../../Vnc'

const VmConsoleModal = ({
  isOpen,
  onClose,
  vmId,
  // wsUrl = `wss://localhost:6690/vnc`,
  wsUrl = `ws://localhost:7000`,
  autoConnect = true,
}) => {
  console.log(`... wsUrl: ${wsUrl}`)
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"가상머신 그래픽콘솔"}
      submitTitle={"연결"}
      contentStyle={{ 
        width: "850px",
      }} 
    >
    <Vnc wsUrl={wsUrl}
      autoConnect={autoConnect}
    />
    </BaseModal>
  )
}

export default VmConsoleModal
import React from 'react'
import BaseModal from "../BaseModal";
import Vnc from '../../Vnc'

const VmConsoleModal = ({
  isOpen,
  onClose,
  vmId,
  wsUrl = '',
  autoConnect = false,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"가상머신 그래픽콘솔"}
      submitTitle={"연결"}
    >
    <Vnc
        wsUrl={wsUrl}
        autoConnect={autoConnect}
      />
    </BaseModal>
  )
}

export default VmConsoleModal
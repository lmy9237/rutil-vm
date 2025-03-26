import React from 'react'
import BaseModal from "../BaseModal";
import Vnc from '../../Vnc'
import { useVmConsoleAccessInfo } from '../../../api/RQHook';

const VmConsoleModal = ({
  isOpen,
  onClose,
  vmId,
  wsUrl=`ws://localhost:9999`,
  autoConnect=true,
}) => {

  const {
    data: vmConsoleAccessInfo,
  } = useVmConsoleAccessInfo(vmId)

  console.log(`... wsUrl: ${wsUrl}, address: ${vmConsoleAccessInfo?.address}, port: ${vmConsoleAccessInfo?.port}, ticket: ${vmConsoleAccessInfo?.token}`)
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"가상머신 그래픽 콘솔"}
      submitTitle={"연결"}
      contentStyle={{ 
        width: "850px",
      }} 
    >
    <Vnc wsUrl={wsUrl}
      host={vmConsoleAccessInfo?.address}
      port={vmConsoleAccessInfo?.port}
      ticket={vmConsoleAccessInfo?.token}
      autoConnect={autoConnect}
    />
    </BaseModal>
  )
}

export default VmConsoleModal
import React from "react";
import BaseModal from "../BaseModal";
import Vnc from "../../Vnc";
import Logger from "../../../utils/Logger";
import { useVmConsoleAccessInfo } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

const VmConsoleModal = ({ 
  isOpen,
  onClose,
  vmId,
  autoConnect=true
}) => {
  const { data: vmConsoleAccessInfo } = useVmConsoleAccessInfo(vmId);

  let wsUrl = `wss://localhost/ws`;
  if (import.meta.env.PROD) {
    Logger.info("THIS IS PRODUCTION !!!");
    Logger.debug(`VmConsoleModal ... import.meta.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: __RUTIL_VM_OVIRT_IP_ADDRESS__\n\n`);
    wsUrl = "wss://__RUTIL_VM_OVIRT_IP_ADDRESS__/ws";
  }

  Logger.debug(`... wsUrl: ${wsUrl}, address: ${vmConsoleAccessInfo?.address}, port: ${vmConsoleAccessInfo?.port}, ticket: ${vmConsoleAccessInfo?.token}`);
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={`${Localization.kr.VM} 그래픽 ${Localization.kr.CONSOLE}`}
      submitTitle={"연결"}
      contentStyle={{
        width: "850px",
      }}
    >
      <Vnc
        wsUrl={wsUrl}
        host={vmConsoleAccessInfo?.address}
        port={vmConsoleAccessInfo?.port}
        ticket={vmConsoleAccessInfo?.token}
        autoConnect={autoConnect}
      />
    </BaseModal>
  );
};

export default VmConsoleModal;

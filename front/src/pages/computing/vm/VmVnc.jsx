import React, { useState, useEffect } from "react";
import Vnc from "../../../components/Vnc";
import { useNavigate, useParams } from "react-router-dom";
import { useVmConsoleAccessInfo } from "../../../api/RQHook";

/**
 * @name VmVnc
 * @description 가상머신 접속 VNC 페이지
 * #/vnc/<VM_ID>
 *  
 * @returns 
 */
const VmVnc = () => {
  const { 
    id: vmId,
  } = useParams();

  const { data: vmConsoleAccessInfo } = useVmConsoleAccessInfo(vmId);
  const navigate = useNavigate();
  
  let wsUrl = `wss://localhost/ws`;
  if (import.meta.env.PROD) {
    console.log("THIS IS PRODUCTION !!!");
    console.log(`VmConsoleModal ... import.meta.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: __RUTIL_VM_OVIRT_IP_ADDRESS__\n\n`);
    wsUrl = "wss://__RUTIL_VM_OVIRT_IP_ADDRESS__/ws";
  }

  const isReady = () => vmId && vmConsoleAccessInfo 
    && vmConsoleAccessInfo?.address 
    && vmConsoleAccessInfo?.port 
    && vmConsoleAccessInfo?.token
    && vmConsoleAccessInfo?.vm

  isReady() && console.log(
    `... wsUrl: ${wsUrl}, address: ${vmConsoleAccessInfo?.address}, port: ${vmConsoleAccessInfo?.port}, ticket: ${vmConsoleAccessInfo?.token}`
  );

  console.log("...")
  return (
    <div className="w-full h-full">
      {isReady() &&
        <Vnc wsUrl={wsUrl}
          vm={vmConsoleAccessInfo?.vm}
          host={vmConsoleAccessInfo?.address}
          port={vmConsoleAccessInfo?.port}
          ticket={vmConsoleAccessInfo?.token}
          autoConnect={true}
        />
      }
    </div>
  );
}

export default VmVnc;

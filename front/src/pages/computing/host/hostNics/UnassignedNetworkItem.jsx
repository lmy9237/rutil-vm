/* 할당되지 않은 네트워크 목록 아이템 */
import React from "react";
import { RVI16, rvi16VirtualMachine, status2Icon } from "../../../../components/icons/RutilVmIcons";


const UnassignedNetworkItem = ({ network, onDragStart }) => {
  return (
    <div
      className="network-item f-btw"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex text-left">
        {status2Icon(network?.status)}&nbsp;&nbsp;{network?.name}
        {network?.vlan === 0 ? "" : `(VLAN ${network?.vlan})`}
      </div>
      <RVI16 iconDef={rvi16VirtualMachine} className="icon" />
    </div>
  );
};

export default UnassignedNetworkItem;

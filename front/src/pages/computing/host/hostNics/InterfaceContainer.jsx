/* 단일 NIC 렌더링 */
import React from "react";
import { RVI16, rvi16TriangleUp, rvi16TriangleDown } from "../../../../components/icons/RutilVmIcons";
import { Tooltip } from "react-tooltip";

const InterfaceContainer = ({
  nic,
  onClick,
  onDragStart,
  tooltipHTML,
}) => {
  return (
    <div
      className="interface-container container"
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      data-tooltip-id={`nic-tooltip-${nic.id}`}
      data-tooltip-html={tooltipHTML}
    >
      <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
      {nic.name}
      <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
    </div>
  );
};

export default InterfaceContainer;
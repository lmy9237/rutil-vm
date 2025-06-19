import { Tooltip } from "react-tooltip";
import {
  RVI16,
  rvi16TriangleDown,
  rvi16TriangleUp,
} from "@/components/icons/RutilVmIcons";
import NicToolTip from "./NicToolTip";

const BaseNic = ({ 
  nic, 
  handleDragStart, 
  handleDrop, 
  handleDragOver 
}) => {

  return (
    <div className="interface-container container"
      key={nic.id}
      data-tooltip-id={`nic-tooltip-${nic.id}`}
      data-tooltip-html={NicToolTip(nic)}
      draggable
      onDragStart={(e) => handleDragStart(e, nic, "nic", "nic")}
      onDrop={(e) => { handleDrop(e, "bond", nic)}}
      onDragOver={(e) => handleDragOver(e, "nic", "bond")}
    >
      <RVI16 iconDef={nic.status?.toUpperCase() === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
      {nic.name}
      <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
    </div>
  );
};

export default BaseNic;

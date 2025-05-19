import { Tooltip } from "react-tooltip";
import { RVI16, rvi16TriangleDown, rvi16TriangleUp } from "../../../../components/icons/RutilVmIcons";

const BaseNic = ({ nic, generateNicTooltipHTML }) => {
  return (
    <div
      key={nic.id}
      className="interface-container container"
      data-tooltip-id={`nic-tooltip-${nic.id}`}
      data-tooltip-html={generateNicTooltipHTML(nic)}
      draggable
      // onClick={() => {
      //   setSelectedNic(nic);
      //   setSelectedSlave(null);
      // }}
      // onDragStart={(e) => dragStart(e, nic, "container")}
    >
      <RVI16 iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
      {nic.name}
      <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
    </div>
  );
};

export default BaseNic;

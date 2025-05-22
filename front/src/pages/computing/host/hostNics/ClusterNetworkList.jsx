import { Tooltip } from "react-tooltip";
import { RVI16, rvi16TriangleDown, rvi16TriangleUp, rvi16VirtualMachine } from "../../../../components/icons/RutilVmIcons";

const ClusterNetworkList = ({ net, handleDragStart }) => {

  return (
    <div className="network-item f-btw"
      draggable
      onDragStart={(e) => handleDragStart(e, net, "network", "attach")}
    >
      <div className="f-start text-left">
        <RVI16 className="mr-1.5" iconDef={net?.status === "OPERATIONAL" ? rvi16TriangleUp() : rvi16TriangleDown()} />
        [{net?.required}] {net?.name}
        {net?.vlan === 0 ? "" : <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {net.vlan})</span>}
      </div>
      {net?.usageVm === true && <RVI16 iconDef={rvi16VirtualMachine()} className="icon" />}
    </div>
  );
};

export default ClusterNetworkList;

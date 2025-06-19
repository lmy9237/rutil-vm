import { RVI16, rvi16TriangleDown, rvi16TriangleUp, rvi16VirtualMachine } from "../../../../components/icons/RutilVmIcons";

const ClusterNetworkList = ({ network, handleDragStart }) => {

  return (
    <div className="network-item f-btw"
      draggable
      onDragStart={(e) => handleDragStart(e, network, "network", "attach")}
    >
      <div className="f-start text-left">
        <RVI16 className="mr-1.5" iconDef={network?.status?.toUpperCase() === "OPERATIONAL" ? rvi16TriangleUp() : rvi16TriangleDown()} />
        {network?.name}
        {network?.vlan === 0 ? "" : <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {network.vlan})</span>}
      </div>
      {network?.usageVm === true && <RVI16 className="icon" iconDef={rvi16VirtualMachine()} />}
    </div>
  );
};

export default ClusterNetworkList;

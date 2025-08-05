import { 
  RVI16, rvi16Event, rvi16Monitor, rvi16TriangleDown, rvi16TriangleUp, rvi16VirtualMachine, rvi16VmNetwork, rvi16Wrench, rvil16Migration,
  networkUsage2Icons,
} from "@/components/icons/RutilVmIcons";

/**
 * @name ClusterNetworkList
 * 
 * @param {*} param0 
 * @returns {JSX.Element} ClusterNetworkList
 */
const ClusterNetworkList = ({
  network,
  handleDragStart=(e)=>{}
}) => {
  return (
    <div className="network-item f-btw"
      draggable
      onDragStart={(e) => handleDragStart(e, network, "network", "attach")}
    >
      <div className="f-start text-left gap-4">
        <RVI16 className="mr-1.5" iconDef={network?.status?.toUpperCase() === "OPERATIONAL" ? rvi16TriangleUp() : rvi16TriangleDown()} />
        {network?.name}
        {network?.vlan === 0 ? "" : <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {network.vlan})</span>}
      </div>
      {/* {network?.usageVm === true && <RVI16 className="icon" iconDef={rvi16VirtualMachine()} />} */}
      {networkUsage2Icons(network?.usage)}
    </div>
  );
};

export default ClusterNetworkList;

import { RVI16, rvi16Event, rvi16Monitor, rvi16TriangleDown, rvi16TriangleUp, rvi16VirtualMachine, rvi16VmNetwork, rvi16Wrench, rvil16Migration } from "../../../../components/icons/RutilVmIcons";

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
      {/* {network?.usageVm === true && <RVI16 className="icon" iconDef={rvi16VirtualMachine()} />} */}
      <div>
        {network?.usage?.management === true ? <RVI16 iconDef={rvi16Wrench()} />:""}
        {network?.usage?.display === true ? <RVI16 iconDef={rvi16Monitor} />:""}
        {network?.usage?.migration === true ? <RVI16 iconDef={rvil16Migration("#555555")} />:""}
        {network?.usage?.defaultRoute === true ? <RVI16 iconDef={rvi16Event("#555555")} />:""}
        {network?.usage?.vm === true ? <RVI16 iconDef={rvi16VmNetwork("#555555")} />:""}
        <br/>
      </div>
    </div>
  );
};

export default ClusterNetworkList;

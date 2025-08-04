import { Tooltip } from "react-tooltip";
import { 
  RVI16, 
  rvi16Event, 
  rvi16Monitor, 
  rvi16StarGold, 
  rvi16TriangleDown, 
  rvi16TriangleUp, 
  rvi16VmNetwork, 
  rvi16Wrench, 
  RVI36, 
  rvi36Edit,
  rvil16Migration,
  status2Icon
} from "../../../../components/icons/RutilVmIcons";
import NetworkToolTip from "./NetworkToolTip";

const MatchNetwork = ({ 
  networkAttach, 
  nic, 
  handleDrop, 
  handleDragOver, 
  handleDragStart, 
  setSelectedNetwork, 
  editNetworkAttachmentData
}) => {
  const networkVo = networkAttach?.networkVo;

  return (
    <div className="assigned-network-outer network-drop-target"
      onDrop={(e) => handleDrop(e, "detach", nic)}
      onDragOver={(e) => handleDragOver(e, "network", "detach")}
      data-tooltip-id={`network-tooltip-${networkVo.id}`}
      data-tooltip-html={NetworkToolTip(networkAttach)}
    >
      <div className="assigned-network-content fs-14"
        draggable
        onDragStart={(e) => handleDragStart(e, networkVo, "network", "detach")}
        onDragOver={(e) => e.preventDefault()} // 중요: 자식은 drop 대상 아님
      >
        <div className="f-start">
          <RVI16 className="mr-1.5"
            iconDef={networkVo?.status?.toUpperCase() === "OPERATIONAL" ? rvi16TriangleUp(): rvi16TriangleDown()}
          />
          {networkAttach.inSync === false && (
            <span className="mr-1">
              {status2Icon("async")}
            </span>
          )}
          {networkVo?.name}
          {networkVo?.vlan === 0 ? "" : (
            <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {networkVo.vlan})</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center"}}>
          {networkVo?.usage?.management === true ? <RVI16 iconDef={rvi16Wrench()} />:""}
          {networkVo?.usage?.display === true ? <RVI16 iconDef={rvi16Monitor} />:""}
          {networkVo?.usage?.migration === true ? <RVI16 iconDef={rvil16Migration("#555555")} />:""}
          {networkVo?.usage?.defaultRoute === true ? <RVI16 iconDef={rvi16Event("#555555")} />:""}
          {networkVo?.usage?.vm === true ? <RVI16 iconDef={rvi16VmNetwork("#555555")} />:""}
          <br/>
        </div>
        <div className="right-section">
          <RVI36 className="icon cursor-pointer"
            iconDef={rvi36Edit()}
            onClick={() => {
              setSelectedNetwork(networkAttach);
              editNetworkAttachmentData(networkAttach);
            }}
          />
        </div>
      </div>
      <Tooltip id={`network-tooltip-${networkVo.id}`} place="top" effect="solid" />
    </div>
  );
};

export default MatchNetwork;

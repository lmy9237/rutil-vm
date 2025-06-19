import { Tooltip } from "react-tooltip";
import { 
  RVI16, 
  rvi16Close, 
  rvi16Refresh,
  rvi16TriangleDown, 
  rvi16TriangleUp, 
  RVI36, 
  rvi36Edit
} from "../../../../components/icons/RutilVmIcons";
import NetworkToolTip from "./NetworkToolTip";
import CONSTANT from "@/Constants";

const MatchNetwork = ({ 
  networkAttach, 
  nic, 
  handleDrop, 
  handleDragOver, 
  handleDragStart, 
  setSelectedNetwork, 
  editNetworkAttachmentData
}) => {

  return (
    <div className="assigned-network-outer network-drop-target"
      onDrop={(e) => handleDrop(e, "detach", nic)}
      onDragOver={(e) => handleDragOver(e, "network", "detach")}
      data-tooltip-id={`network-tooltip-${networkAttach.networkVo.id}`}
      data-tooltip-html={NetworkToolTip(networkAttach)}
    >
      <div className="assigned-network-content fs-14"
        draggable
        onDragStart={(e) => handleDragStart(e, networkAttach.networkVo, "network", "detach")}
        onDragOver={(e) => e.preventDefault()} // 중요: 자식은 drop 대상 아님
      >
        <div className="f-start">
          <RVI16 className="mr-1.5"
            iconDef={networkAttach.networkVo?.status?.toUpperCase() === "OPERATIONAL" ? rvi16TriangleUp(): rvi16TriangleDown()}
          />
          {/* TODO: X 와 refresh 가 겹쳐진 아이콘 필요 */}
          {networkAttach.inSync === false 
            ? <>
              <RVI16 className="mr-1.5" iconDef={rvi16Refresh(CONSTANT.color.alert)} />
              <RVI16 className="mr-1.5" iconDef={rvi16Close(CONSTANT.color.alert)} />
            </>
            : ""
          } 
          {networkAttach.networkVo?.name}
          {networkAttach.networkVo?.vlan === 0 ? "" : (
            <span style={{ marginLeft: "4px", color: "#888" }}>(VLAN {networkAttach.networkVo.vlan})</span>
          )}
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
      <Tooltip id={`network-tooltip-${networkAttach.networkVo.id}`} place="top" effect="solid" />
    </div>
  );
};

export default MatchNetwork;

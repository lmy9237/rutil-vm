import { Tooltip } from "react-tooltip";
import { 
  RVI16, 
  rvi16TriangleDown, 
  rvi16TriangleUp, 
  RVI36, 
  rvi36Edit,
  networkUsage2Icons,
  status2Icon
} from "@/components/icons/RutilVmIcons";
import NetworkToolTip from "./NetworkToolTip";
import Tippy from "@tippyjs/react";

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
    <Tippy
      content={<div dangerouslySetInnerHTML={{ __html: NetworkToolTip(networkAttach) }} />}
      placement="top"
      delay={[100, 0]}
      interactive={true}
    >
      <div className="assigned-network-outer network-drop-target"
        onDrop={(e) => handleDrop(e, "detach", nic)}
        onDragOver={(e) => handleDragOver(e, "network", "detach")}
        // data-tooltip-id={`network-tooltip-${networkVo.id}`}
        // data-tooltip-html={NetworkToolTip(networkAttach)}
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
        
          <br/>
          <div>
            {/* {import.meta.env.DEV && <>&nbsp;<span style={{ fontSize: "5px"}}>{networkAttach?.id}</span></>} */}
          </div>
          <div className="flex">
            <div className="f-center host-icon-list mr-3">
              {networkUsage2Icons(networkVo?.usage)}       
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
        </div>
        {/* <Tooltip id={`network-tooltip-${networkVo.id}`} place="top" effect="solid" /> */}
      </div>
    </Tippy>
  );
};

export default MatchNetwork;

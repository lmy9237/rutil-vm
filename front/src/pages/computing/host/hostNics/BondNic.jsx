import { Tooltip } from "react-tooltip";
import { RVI16, rvi16TriangleDown, rvi16TriangleUp, RVI36, rvi36Edit } from "../../../../components/icons/RutilVmIcons";
import NicToolTip from "./NicToolTip";

const BondNic = ({ 
  nic, 
  dragItem,
  handleDragStart,
  handleAddBaseNicToBond,
  editBondingData
}) => {
  const onlyBasicNic = dragItem && dragItem.type === "nic" && dragItem.list === "nic"; // base NIC만 드롭 허용
  
  return (
    <div className="interface-outer relative overflow-visible container flex-col p-2"
      data-tooltip-id={`nic-tooltip-${nic.id}`}
      data-tooltip-html={NicToolTip(nic)}
      onDragOver={e => {
        if (onlyBasicNic) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }
      }}
      onDrop={e => {
        if (onlyBasicNic) {
          handleAddBaseNicToBond(dragItem.item, nic);
        }
      }}
    >
      <div className="interface-content">
        <div className="f-start  fs-14">{nic.name}</div>
        <RVI36 className="icon cursor-pointer" iconDef={rvi36Edit()}
          onClick={() => editBondingData && editBondingData(nic)}
        />
      </div>
      <div className="w-full interface-container-outer2" onDragOver={e => e.preventDefault()}>
        {nic.bondingVo?.slaveVos.map((slave) => (
          <div className="interface-container container"
            key={slave.id}
            // data-tooltip-id={`nic-tooltip-${slave.id}`}
            // data-tooltip-html={NicToolTip(slave)}
            draggable
            onDragStart={e => handleDragStart(e, slave, "nic", "slave", nic)}
          >
            <div className="f-start gap-1">
              <RVI16 iconDef={slave.status?.toUpperCase() === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-0.5" />
              {slave.name}
              {/* {idView(slave)} */}
            </div>
            <Tooltip id={`nic-tooltip-${slave.id}`} place="top" effect="solid" />
          </div>
        ))}
      </div>
      <Tooltip
        anchorSelect={`[data-tooltip-id="nic-tooltip-${nic.id}"]`}
        html={NicToolTip(nic)}
        place="top"
        effect="solid"
        offset={10}
        style={{ zIndex: 9999, maxWidth: "250px", whiteSpace: "normal", wordBreak: "break-word" }}
      />
    </div>     
  );
};

export default BondNic;

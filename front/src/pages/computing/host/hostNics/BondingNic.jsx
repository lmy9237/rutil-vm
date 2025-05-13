import React from "react";
import { Tooltip } from "react-tooltip";
import { rvi16TriangleDown, rvi16TriangleUp, RVI36, rvi36Edit } from "../../../../components/icons/RutilVmIcons";

const BondingNic = ({ nic, onEditClick, generateNicTooltipHTML }) => {
  return (
    <div
      className="interface-outer container flex-col p-2"
      data-tooltip-id={`nic-tooltip-${nic.id}`}
      data-tooltip-html={generateNicTooltipHTML(nic)}
    >
      <div className="interface-content">
        <div className="f-start">{nic.name}</div>
        <RVI36
          className="icon cursor-pointer"
          iconDef={rvi36Edit()}
          onClick={onEditClick}
        />
      </div>
      <div
        className="w-full interface-container-outer2"
        onDragOver={(e) => e.preventDefault()}
      >
        {nic.bondingVo?.slaves.map((slave) => (
          <div
            key={slave.id}
            className="interface-container container"
            data-tooltip-id={`nic-tooltip-${slave.id}`}
            data-tooltip-html={generateNicTooltipHTML(slave)}
            draggable
          >
            <div className="flex gap-1">
              <RVI36
                iconDef={nic.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()}
                className="mr-0.5"
              />
              {slave.name}
            </div>
          </div>
        ))}
      </div>
      <Tooltip id={`nic-tooltip-${nic.id}`} place="top" effect="solid" />
    </div>
  );
};

export default BondingNic;

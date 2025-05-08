/*  할당된 네트워크 박스 */
import React from "react";
import { RVI16, rvi16TriangleUp, rvi16TriangleDown, RVI36, rvi36Edit } from "../../../../components/icons/RutilVmIcons";

const AssignedNetworkItem = ({
  matchedNA,
  onClick,
  onEdit,
  onDragStart,
  tooltipHTML,
}) => {
  const isUp = matchedNA.status === "UP";

  return (
    <div className="container w-[44%] assigned-network-outer">
      <div
        className="assigned-network w-full"
        draggable
        onDragStart={onDragStart}
        onClick={onClick}
        data-tooltip-id={`network-tooltip-${matchedNA.networkVo.id}`}
        data-tooltip-html={tooltipHTML}
      >
        <div className="assigned-network-content fs-16">
          <div>
            <div className="f-start">
              <RVI16 iconDef={isUp ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-1.5" />
              {matchedNA.networkVo?.name || "이름 없음"}
            </div>
            <div className="pl-5 assigned-network-label">{`(VLAN ${matchedNA.networkVo?.id})`}</div>
          </div>
          <div className="right-section">
            <RVI36
              iconDef={rvi36Edit()}
              className="icon cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // 아이템 클릭과 충돌 방지
                onEdit();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedNetworkItem;

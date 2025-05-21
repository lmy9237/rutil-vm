import React from "react";
import {
  RVI16,
  rvi16ChevronDown,
  rvi16ChevronRight,
} from "@/components/icons/RutilVmIcons";
import Logger           from "@/utils/Logger";
import "./TreeMenuItem.css";

const TreeMenuItem = ({
  level=1,
  title="",
  iconDef,
  isNextLevelVisible=false,
  setNextLevelVisible,
  isSelected,
  isChevronVisible=true,
  onChevronClick = () => {},
  ...props
}) => {
  const renderChevron = () => (
    isNextLevelVisible
      ? <RVI16 iconDef={rvi16ChevronDown()} onClick={(e) => _onChevronClick(e)}/> 
      : <RVI16 iconDef={rvi16ChevronRight()} onClick={(e) => _onChevronClick(e)}/>
  )
  const _onChevronClick = (e) => {
    Logger.debug(`TreeMenuItem > _onChevronClick ... `)
    e.stopPropagation();
    onChevronClick(e);
  }

  return (
    <div id={`tmi-${level}`}
      className={`tmi f-start ${isSelected() ? " active" : ""}${isChevronVisible ? " wc" : ""}`}
      // style={{ backgroundColor: getBackgroundColor("rutil-manager") }}
      {...props}
    >
      {isChevronVisible && renderChevron()}
      <RVI16 iconDef={iconDef} />
      <span id="tmi-label" className={`${isSelected() ? " fw-500" : ""}`}>{title}</span>
    </div>
  )
}

export default TreeMenuItem
import React, { useCallback, useMemo } from "react";
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
  status="",
  iconDef,
  isNextLevelVisible=false,
  setNextLevelVisible,
  isSelected,
  isContextSelected, setContextSelected,
  isChevronVisible=true,
  onChevronClick = () => {},
  ...props
}) => {
  const renderChevron = () => (
    isNextLevelVisible
      ? <RVI16 iconDef={rvi16ChevronDown()} onClick={_onChevronClick}/> 
      : <RVI16 iconDef={rvi16ChevronRight()} onClick={_onChevronClick}/>
  )
  const _onChevronClick = (e) => {
    Logger.debug(`TreeMenuItem > _onChevronClick ... `)
    e.stopPropagation();
    onChevronClick(e);
  }

  return (
    <div id={`tmi-${level}`}
      className={`tmi f-start ${isSelected() ? " active" : ""}${isChevronVisible ? " wc" : ""}${isContextSelected ? " context-selected" : ""}`}
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
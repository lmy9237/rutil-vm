import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { TreeMenuIconChevronDown, TreeMenuIconChevronRight } from '../../icons/RutilVmIcons';
import "./TreeMenuItem.css";

const TreeMenuItem = ({
  title="",
  icon,
  onClick,
  isNextLevelVisible=false,
  setNextLevelVisible,
  style,
}) => {
  const renderChevron =() => (
    isNextLevelVisible 
    ? <TreeMenuIconChevronDown onClick={(e) => {
      e.stopPropagation();
      setNextLevelVisible(!isNextLevelVisible);
    }}/> 
    : <TreeMenuIconChevronRight onClick={(e) => {
      e.stopPropagation();
      setNextLevelVisible(!isNextLevelVisible);
    }}/>
  )

  const onChevronClick = (e) => {
    e.stopPropagation();
    setNextLevelVisible(!isNextLevelVisible);
  }

  return (
    <div id="tmi-1"
      className="tmi active"
      // style={{ backgroundColor: getBackgroundColor("rutil-manager") }}
      onClick={onClick}
      style={style}
    >
      {/* <FontAwesomeIcon
        icon={isNextLevelVisible ? faChevronDown : faChevronRight}
        onClick={(e) => {
          e.stopPropagation();
          setNextLevelVisible(!isNextLevelVisible);
        }}
        fixedWidth
      /> */}
      {renderChevron()}
      {icon}
      <span>{title}</span>
    </div>
  )
}

export default TreeMenuItem
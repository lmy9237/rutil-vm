import React, { useRef, useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import {
  RVI16,
  rvi16DataCenter,
  rvi16Cluster,
  rvi16Host,
  rvi16Desktop,
  rvi16Storage,
  rvi16HardDrive,
  rvi16Network,
  rvi16Template,
} from "@/components/icons/RutilVmIcons";
import Logger                           from "@/utils/Logger";
import "./TableRowClick.css";
import CONSTANT from "@/Constants";

const TableRowClick = ({
  type,
  id,
  hideIcon=false,
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const spanRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  const basePath = `/${location.pathname.split("/")[1]}`;  

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    setShowTooltip(el.scrollWidth > el.clientWidth);
  }, [props.children]);

  const handleClick = (e) => {
    Logger.debug("TableRowClick > handleClick ...");
    if (!id) return;
    e.stopPropagation();

    const paths = {
      datacenter: `${basePath}/datacenters/${id}`,
      cluster: `/computing/clusters/${id}`,
      host: `/computing/hosts/${id}`,
      vm: `/computing/vms/${id}`,
      template: `/computing/templates/${id}`,
      domain: `/storages/domains/${id}`,
      disk: `/storages/disks/${id}`,
      network: `/networks/${id}`,
      vnicProfile: `/vnicProfiles/${id}/vms`,
      provider:`/settings/provider/${id}`,
    };

    const path = paths[type];
    if (path) navigate(path);
    else Logger.debug(`Unknown navigation type: ${type}`);
  };
  
  const showIcon = useMemo(() => {
    let iconByType = null;
    let color = isHovered ? CONSTANT.color.primary : CONSTANT.color.down
    switch(type) {
      case "datacenter": iconByType = rvi16DataCenter(color);break;
      case "cluster":    iconByType = rvi16Cluster(color);break;
      case "host":       iconByType = rvi16Host(color);break;
      case "vm":         iconByType = rvi16Desktop(color);break;
      case "network":    iconByType = rvi16Network(color);break;
      case "domain":     iconByType = rvi16Storage(color);break;
      case "disk":       iconByType = rvi16HardDrive(color);break;
      // case "vnicProfile": iconByType = rvi16Lan(color);break;
      case "template":   iconByType = rvi16Template(color);break;
      default: break;
    }
    return (
      !!iconByType && !hideIcon && !!id && props.children && (
        <div className="w-[16px] h-[16px] tr-clickable"
          onClick={props.onClick ?? handleClick}
        >
          <RVI16 iconDef={iconByType} />
        </div>
      )
    )
  }, [hideIcon, id, isHovered, setIsHovered])

  return (
    <Tippy
      appendTo={() => document.body}
      content={<div className="v-start w-full tooltip-content">{props.children}</div>}
      delay={[200, 0]}
      placement="top"
      animation="shift-away"
      theme="dark-tooltip"
      arrow={true}
      zIndex={9999}
      disabled={!showTooltip}
    >
      <div
        className="tr-clickable-wrapper f-start w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showIcon}
        <span
          ref={spanRef}
          className="tr-clickable cell-ellipsis"
          onClick={props.onClick ?? handleClick}
          data-rowclick
          style={{
            textAlign: "left",
            cursor: id ? "pointer" : "default",
            ...props.style,
          }}
        >
          {props.children}
        </span>
      </div>
    </Tippy>
  );
};

export default TableRowClick;
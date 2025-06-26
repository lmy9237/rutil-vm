import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import Logger                           from "@/utils/Logger";
import "./TableRowClick.css";

const TableRowClick = ({
  type,
  id,
  ...props
}) => {
  const navigate = useNavigate();
  const spanRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

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
      datacenter: `/computing/datacenters/${id}/clusters`,
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
      >
        <span
          ref={spanRef}
          className="tr-clickable cell-ellipsis"
          data-rowclick
          onClick={props.onClick ?? handleClick}
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
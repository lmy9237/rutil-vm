import React from "react";
import { useNavigate } from "react-router-dom";
import Logger from "../../utils/Logger";
import "./TableRowClick.css"

/**
 * @name TableRowClick
 * @description 테이블 행 선택
 *
 * @param {string} type
 * @param {string} id
 *
 * @returns
 */
const TableRowClick = ({ 
  type, 
  id, 
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    Logger.debug("TableRowClick > handleClick ...");
    if (!id) { // 빈칸이면 클릭x
      return;
    }
    e.stopPropagation(); // 테이블 row 클릭과 충돌 방지

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
    };

    const path = paths[type];
    if (path) navigate(path);
    else Logger.debug(`Unknown navigation type: ${type}`);
  };

  return (
    <span className="tr-clickable "
      data-rowclick 
      onClick={props.onClick ?? handleClick}
      style={{ 
        display: "inline-block", 
        textAlign: "left",
        cursor: id ? "pointer" : "default",
        ...props.style, 
      }}
    >
      {props.children}
    </span>
  );
};

export default TableRowClick;

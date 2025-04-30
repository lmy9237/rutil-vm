import React from "react";
import { useNavigate } from "react-router-dom";
import Logger from "../../utils/Logger";

/**
 * @name TableRowClick
 * @description 테이블 행 선택
 *
 * @param {string} type
 * @param {string} id
 *
 * @returns
 */
const TableRowClick = ({ type, id, children, style }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    Logger.debug("TableRowClick > handleClick ...");
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
    <div style={{ textAlign: "left" }}>
      <span
        className="row-click"
        data-rowclick 
        onClick={handleClick}
        style={{ color: "rgb(9, 83, 153)", textAlign: "left"  }}
      >
        {children}
      </span>
    </div>
  );
};

export default TableRowClick;

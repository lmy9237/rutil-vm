import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  children, 
  style 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    console.log("TableRowClick > handleClick ...");
    e.stopPropagation(); // 테이블 row 클릭과 충돌 방지

    const paths = {
      datacenter: `/computing/datacenters/${id}/clusters`,
      cluster: `/computing/clusters/${id}`,
      host: `/computing/hosts/${id}`,
      vms: `/computing/vms/${id}`,
      domains: `/storages/domains/${id}`,
      disks: `/storages/disks/${id}`,
      network: `/networks/${id}`,
      templates: `/computing/templates/${id}`,
      vnicProfile: `/vnicProfiles/${id}/vms`,
    };

    const path = paths[type];
    if (path) 
      navigate(path);
    else
      console.warn(`Unknown navigation type: ${type}`);
  };
  
  return (
    <div style={{textAlign: 'left'}}>
      <span
        className='row-click'
        onClick={handleClick}
        style={{ color: 'rgb(9, 83, 153)' }}
      >
        {children}
      </span>
    </div>
  );
};

export default TableRowClick;

import React, { useState } from 'react';
import Permission from "../../../components/Modal/Permission";
import Table from "../../table/Table";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faUser, fa1, fa2
} from '@fortawesome/free-solid-svg-icons'
import TableColumnsInfo from '../table/TableColumnsInfo';
import TableOuter from '../../table/TableOuter';
const VmPower = () => {

    const [activePermissionFilter, setActivePermissionFilter] = useState('all');
    const handlePermissionFilterClick = (filter) => setActivePermissionFilter(filter);
    const handleOpenModal = () => setIsModalOpen(true); // 모달 열기
    const handleCloseModal = () => setIsModalOpen(false); // 모달 닫기
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

    const permissionData = [
        {
          icon: <FontAwesomeIcon icon={faUser} fixedWidth/>,
          user: 'ovirtmgmt',
          authProvider: '',
          namespace: '*',
          role: 'SuperUser',
          createdDate: '2023.12.29 AM 11:40:58',
          inheritedFrom: '(시스템)',
        },
      ];
    return (
<>
              <div className="content_header_right">
                <button onClick={handleOpenModal}>추가</button> {/* 추가 버튼 */}
                <button>제거</button>
              </div>
              <div className="host_filter_btns">
                <span>Permission Filters:</span>
                <div>
                  <button
                    className={activePermissionFilter === 'all' ? 'active' : ''}
                    onClick={() => handlePermissionFilterClick('all')}
                  >
                    All
                  </button>
                  <button
                    className={activePermissionFilter === 'direct' ? 'active' : ''}
                    onClick={() => handlePermissionFilterClick('direct')}
                  >
                    Direct
                  </button>
                </div>
              </div>
              <TableOuter
                columns={TableColumnsInfo.PERMISSIONS}
                data={activePermissionFilter === 'all' ? permissionData : []}
                onRowClick={() => console.log('Row clicked')}
              />
        {/* 모달 컴포넌트 */}
        <Permission isOpen={isModalOpen} onRequestClose={handleCloseModal} />
</>

    
    );
  };
export default VmPower;
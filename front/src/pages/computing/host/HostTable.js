import React from 'react';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { renderHostStatusIcon } from '../../../utils/format';

const HostTable = ({ columns, hosts, setSelectedHosts }) => {
  const navigate = useNavigate();

  const formatData = hosts.map((host) => ({
    ...host,
    icon: renderHostStatusIcon(host.status),
    hostedEngine:
      host?.hostedEngine && host?.hostedEngineVM ? (
        <FontAwesomeIcon 
            icon={faPencil} 
            fixedWidth 
            style={{ color: 'gold', fontSize: '0.3rem', transform: 'rotate(90deg)' }} 
        />
      ) : host?.hostedEngine ? (
        <FontAwesomeIcon 
            icon={faPencil} 
            fixedWidth 
            style={{ color: 'grey', fontSize: '0.3rem', transform: 'rotate(90deg)' }} 
        />
      ) : (
        ''
      ),
    status: host?.status,
    spmStatus: host?.spmStatus === 'NONE' ? '보통' : host?.spmStatus,
    vmCnt: host?.vmSizeVo.allCnt,
    memoryUsage: host?.usageDto.memoryPercent === null ? '' : host?.usageDto.memoryPercent + '%',
    cpuUsage: host?.usageDto.cpuPercent === null ? '' : host?.usageDto.cpuPercent + '%',
    networkUsage: host?.usageDto.networkPercent === null ? '' : host?.usageDto.networkPercent + '%',
    cluster: (
      <TableRowClick type="cluster" id={host.clusterVo.id}>
        {host?.clusterVo?.name}
      </TableRowClick>
    ),
    dataCenter: (
      <TableRowClick type="datacenter" id={host.dataCenterVo.id}>
        {host?.dataCenterVo?.name}
      </TableRowClick>
    ),
  }));

  const handleNameClick = (id) => {
    navigate(`/computing/hosts/${id}`);
  };

  const handleRowSelection = (selectedRows) => {
    setSelectedHosts(selectedRows); // 선택된 데이터 배열 업데이트
  };

  return (
    <>
      {/* 테이블 */}
      <TablesOuter
        columns={columns}
        data={formatData}
        shouldHighlight1stCol={true}
        onRowClick={handleRowSelection} // 다중 선택된 행 데이터를 업데이트
        clickableColumnIndex={[2]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
      />
    </>
  );
};

export default HostTable;
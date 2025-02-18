import React from 'react';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import { useNavigate } from 'react-router-dom';

/**
 * @name NetworkTable
 * @description 네트워크 테이블
 *
 * @param {string}
 * @returns {JSX.Element} NetworkTable
 */
const NetworkTable = ({
  columns,
  networks,
  setSelectedNetworks, // 다중 선택된 네트워크를 관리하기 위한 함수
}) => {
  const navigate = useNavigate();

  const handleNameClick = (id) => {
    navigate(`/networks/${id}`);
  };
  const handleRowSelection = (selectedRows) => {
    setSelectedNetworks(selectedRows); // 선택된 데이터 전달
  };
  return (
    <TablesOuter
      columns={columns}
      data={networks.map((network) => ({
        ...network,
        name: 
          <TableRowClick type="network" id={network.id}>
            {network.name}
          </TableRowClick>,
        vlan: network.vlan === 0 ? '-' : network.vlan,
        mtu: network.mtu === 0 ? '기본값(1500)' : network.mtu,
        datacenter: (
          <TableRowClick type="datacenter" id={network.datacenterVo.id}>
            {network.datacenterVo.name}
          </TableRowClick>
        ),
      }))}
      shouldHighlight1stCol={true}
      onRowClick={handleRowSelection} // 다중 선택된 행 데이터를 업데이트
      // clickableColumnIndex={[0]}
      onClickableColumnClick={(row) => handleNameClick(row.id)}
      
    />
  );
};

export default NetworkTable;
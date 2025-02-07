import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkActionButtons from './button/NetworkActionButtons';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import NetworkModals from './modal/NetworkModals';
  
const NetworkDupl = ({ networks = [], columns = [] }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const selectedIds = (Array.isArray(selectedNetworks) ? selectedNetworks : []).map(network => network.id).join(', ');

  const handleNameClick = (id) => navigate(`/networks/${id}`);
  
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <NetworkActionButtons
        openModal={openModal}
        isEditDisabled={selectedNetworks.length !== 1}
        isDeleteDisabled={selectedNetworks.length === 0}
      />
      <span>ID: {selectedIds}</span>

      <TablesOuter
        columns={columns}
        data={networks.map((network) => ({
          ...network,
          // name: <TableRowClick type="network" id={network?.id}>{network?.name}</TableRowClick>,
          vlan: network?.vlan === 0 ? '-' : network?.vlan,
          mtu: network?.mtu === 0 ? '기본값(1500)' : network?.mtu,
          datacenter: <TableRowClick type="datacenter" id={network?.datacenterVo?.id}>{network?.datacenterVo?.name}</TableRowClick>,
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedNetworks(selectedRows)}
        clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true} // 다중 선택 활성화
        onContextMenuItems={(row) => [
          <NetworkActionButtons
            openModal={openModal}
            isEditDisabled={!row} 
            type='context'
          />
        ]}
      />

      {/* 네트워크 모달창 */}
      <NetworkModals
        activeModal={activeModal}
        network={activeModal === 'edit' ? selectedNetworks[0] : null}
        selectedNetworks={selectedNetworks}
        onClose={closeModal}
      />
    </>
  );
};

export default NetworkDupl;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VnicProfileActionButtons from './button/VnicProfileActionButtons.js';
import TablesOuter from '../../../components/table/TablesOuter.js';
import TableRowClick from '../../../components/table/TableRowClick.js';
import VnicProfileModals from '../../../components/modal/vnic-profile/VnicProfileModals';

const VnicProfileDupl = ({ vnicProfiles = [], columns = [], networkId }) => {
  const navigate = useNavigate();
  
  const [activeModal, setActiveModal] = useState(null);
  const [selectedVnicProfiles, setSelectedVnicProfiles] = useState([]); // 다중 선택된 vNIC 프로파일
  const selectedIds = (Array.isArray(selectedVnicProfiles) ? selectedVnicProfiles : []).map(vnic => vnic.id).join(', ');

  const handleNameClick = (id) => navigate(`/vnicProfiles/${id}/vms`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <div onClick={(e) => e.stopPropagation()}> {/* 테이블 외부 클릭 방지 */}
      <VnicProfileActionButtons
        openModal={openModal}
        isEditDisabled={selectedVnicProfiles.length !== 1}
      />
      <span> ID: {selectedIds}</span>

      <TablesOuter
        columns={columns}
        data={vnicProfiles.map((vnic) => ({
          ...vnic,
          network: <TableRowClick type="network" id={vnic?.networkVo?.id}>{vnic?.networkVo?.name}</TableRowClick>,          
          dataCenter: <TableRowClick type="datacenter" id={vnic?.dataCenterVo?.id}>{vnic?.dataCenterVo?.name}</TableRowClick>,
          passThrough: vnic?.passThrough === 'DISABLED' ? '아니요' : '예',
          networkFilter: vnic?.networkFilterVo?.name || '-',
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedVnicProfiles(selectedRows)}
        clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <VnicProfileActionButtons
            openModal={openModal}
            isEditDisabled={!row} 
            type='context'
          />
        ]}
      />

      {/* vnicProfile 모달창 */}
      <VnicProfileModals
        activeModal={activeModal}
        vnicProfile={activeModal === 'edit' ? selectedVnicProfiles[0] : null}
        selectedVnicProfiles={selectedVnicProfiles}
        networkId={networkId}
        onClose={closeModal}
      />
    </div>
  );
};

export default VnicProfileDupl;

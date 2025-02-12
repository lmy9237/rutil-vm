import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import VmDiskActionButtons from './button/VmDiskActionButtons';
import { renderTFStatusIcon } from '../../../components/Icon';
import { formatBytesToGBToFixedZero } from '../../../util';
import VmDiiskModals from '../../../components/modal/vm/VmDiiskModals';


/**
 * @name VmDiskDupl
 * @description ...
 * 
 * @param {Array} vmDisks
 * @returns 
 */
const VmDiskDupl = ({ vmDisks = [], columns = [], vmId }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDisks, setSelectedDisks] = useState([]); // 다중 선택된 디스크
  const selectedIds = (Array.isArray(selectedDisks) ? selectedDisks : []).map((disk) => disk.id).join(', ');

  const handleNameClick = (id) => navigate(`/storages/disks/${id}`);
  
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);  

  const status = selectedDisks.length === 0 ? 'none': selectedDisks.length === 1 ? 'single': 'multiple';
  
  return (
    <div onClick={(e) => e.stopPropagation()}> {/* 테이블 외부 클릭 방지 */}
      <VmDiskActionButtons
        openModal={openModal}
        isEditDisabled={selectedDisks?.length !== 1}
        isDeleteDisabled={selectedDisks?.length === 0}
        status={selectedDisks[0]?.active ? 'active' : 'deactive'}
        selectedDisks={selectedDisks}
      />
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter
        columns={columns}
        data={vmDisks.map((d) => {
          return {
            ...d,
            icon: renderTFStatusIcon(d?.active),
            alias: <TableRowClick type="disks" id={d?.diskImageVo?.id}>{d?.diskImageVo?.alias}</TableRowClick>,
            description: d?.diskImageVo?.description,
            bootable: d?.bootable ? '예' : '',
            readOnly: d?.readOnly ? '예' : '',
            sharable: d?.diskImageVo?.sharable ? '예' : '',
            status: d?.diskImageVo?.status,
            interface: d?.interface_,
            storageType: d?.diskImageVo?.storageType,
            sparse: d?.diskImageVo?.sparse ? '씬 프로비저닝' : '사전 할당',
            virtualSize: formatBytesToGBToFixedZero(d?.diskImageVo?.virtualSize) + " GB",
            actualSize: formatBytesToGBToFixedZero(d?.diskImageVo?.actualSize) + " GB",
            storageDomain: <TableRowClick type="domains" id={d?.diskImageVo?.storageDomainVo?.id}>{d?.diskImageVo?.storageDomainVo?.name}</TableRowClick>,
            storageType: d?.diskImageVo?.storageType,
          };
        })}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDisks(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        // onContextMenuItems={(row) => [ // 마우스 버튼
        //   <DiskActionButtons
        //     openModal={openModal}
        //     isEditDisabled={!row} 
        //     type='context'
        //   />
        // ]}
      />

      {/* 디스크 모달창 */}
      <VmDiiskModals
        activeModal={activeModal}
        disk={selectedDisks[0]}
        selectedDisks={selectedDisks}
        vmId={vmId}
        onClose={closeModal}
      />
    </div>
  );
};

export default VmDiskDupl;

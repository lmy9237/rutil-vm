import React, {Suspense, useState } from 'react';
import Loading from '../../../components/common/Loading';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useHostdevicesFromVM } from '../../../api/RQHook';

const VmDeviceAddModal = React.lazy(() => import('../../../components/modal/vm/VmDeviceAddModal'));

const VmHostDevices = ({ vmId }) => {
  const { 
    data: hostDevices = [], isLoading: isHostDevicesLoading
  } = useHostdevicesFromVM(vmId, (e) => ({...e}));  

  const [activeModal, setActiveModal] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const selectedIds = (Array.isArray(selectedDevices) ? selectedDevices : []).map(d => d.id).join(', ');

  const closeModal = () => setActiveModal(null);
  
  const renderModals = () => (
    <Suspense fallback={<Loading/>}>
      <VmDeviceAddModal
        isOpen={activeModal === 'add'}
        hostDevices={hostDevices}
        onRequestClose={closeModal}
      />
      {/* 장치 삭제 */}
      {/*View CPU Pinning 팝업 */}
      {/* <VmCPUPinningModal
        isOpen={activePopup === 'view_cpu'}
        onRequestClose={closePopup}
      /> */}
    </Suspense>
  );
  
  return (
    <>
      <div className="header-right-btns">
        <button onClick={() => setActiveModal('add')}>장치 추가</button>
        <button onClick={() => setActiveModal('delete')} className='disabled'>장치 삭제</button>
        {/* <button className='disabled'>vGPU 관리</button> */}
        {/* <button onClick={() => openPopup('view_cpu')}>View CPU Pinning</button> */}
      </div>
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter 
        columns={TableColumnsInfo.HOST_DEVICE_FROM_VM} 
        data={hostDevices.map((hostDevice) => ({
          ...hostDevice,
          name: hostDevice?.name ?? 'Unknown',
          capability: hostDevice?.capability ?? 'Unknown',
          vendorName: hostDevice?.vendorName ?? 'Unknown',
          productName: hostDevice?.productName ?? 'Unknown',
          driver: hostDevice?.driver ?? 'Unknown',
          // currentlyUsed: hostDevice?.currentlyUsed ?? 'Unknown',
          // connectedToVM: hostDevice?.connectedToVM ?? 'Unknown',
          // iommuGroup: hostDevice?.iommuGroup ?? '해당 없음',
          // mdevType: hostDevice?.mdevType ?? '해당 없음',
        }))} 
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDevices(selectedRows)}
        multiSelect={true}
      />
    
      {/* 모달창 */}
      { renderModals() }
        
    </>
  );
};
  
  export default VmHostDevices;
  
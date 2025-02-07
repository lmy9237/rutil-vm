import { Suspense, useState } from 'react';
import { useAllVmsFromNetwork } from "../../../api/RQHook";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import { renderUpDownStatusIcon, renderVmStatusIcon } from "../../../utils/Icon";
import { formatBytesToMB } from '../../../utils/format';
import VmDeleteModal from '../../computing/vm/modal/VmDeleteModal';

// const 

const NetworkVms = ({ networkId }) => {
  const { 
    data: vms = [], isLoading: isVmsLoading,
  } = useAllVmsFromNetwork(networkId, (e) => ({ ...e }));

  const [activeFilter, setActiveFilter] = useState("running");
  const [selectedVms, setSelectedVms] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const buttonClass = (filter) => `filter_button ${activeFilter === filter ? 'active' : ''}`;

  const selectedIds = (Array.isArray(selectedVms) ? selectedVms : []).map((vm) => vm.id).join(', ');
  const toggleDeleteModal = (isOpen) => setDeleteModalOpen(isOpen);

  // 필터링된 VM 데이터 계산
  const filteredVms = activeFilter === 'running' 
    ? vms.filter(vm => vm.status !== 'DOWN')
    : vms.filter(vm => vm.status === 'DOWN');

  const modalData = selectedVms.map(vm => ({ id: vm.id, name: vm.vnic || vm.name || ''}));

  return (
    <>
      <div className="header-right-btns">
        <button onClick={() => toggleDeleteModal(true)} disabled={activeFilter !== 'stopped' || !selectedVms.length}>
          제거
        </button>
      </div>
      
      <div className="host-filter-btns">
        <button className={buttonClass("running")} onClick={() => setActiveFilter("running")}>
          실행중
        </button>
        <button className={buttonClass("stopped")} onClick={() => setActiveFilter("stopped")}>
          정지중
        </button>
      </div>

      <span>id = {selectedIds || ''}</span>

      <TablesOuter
        columns={
          activeFilter === "running" 
            ? TableColumnsInfo.VMS_NIC 
            : TableColumnsInfo.VMS_STOP
        }
        data={filteredVms.map((vm) => ({ 
          ...vm,
          icon: renderVmStatusIcon(vm?.status),
          name: <TableRowClick type="vms" id={vm?.id}>{vm?.name}</TableRowClick>,
          cluster: <TableRowClick type="cluster" id={vm?.clusterVo?.id}>{vm?.clusterVo?.name}</TableRowClick>,
          vnicStatus: renderUpDownStatusIcon(vm?.nicVos[0]?.status),
          vnic: vm?.nicVos?.[0]?.name || '알 수 없음',
          vnicRx: vm?.nicVos?.[0]?.rxSpeed ? Math.round(formatBytesToMB(vm?.nicVos[0].rxSpeed)): '',
          vnicTx: vm?.nicVos?.[0]?.txSpeed ? Math.round(formatBytesToMB(vm?.nicVos[0].txSpeed)): '',
          totalRx: vm?.nicVos?.[0]?.rxTotalSpeed ? vm?.nicVos?.[0]?.rxTotalSpeed.toLocaleString() : '',
          totalTx: vm?.nicVos?.[0]?.txTotalSpeed ? vm?.nicVos?.[0]?.txTotalSpeed.toLocaleString() : '',
        }))}
          onRowClick={(rows) => {
          console.log('Selected Rows:', rows); // 선택된 데이터 확인
          setSelectedVms(Array.isArray(rows) ? rows : []);
        }}
      />

      {/* nic 를 삭제하는 코드를 넣어야함 */}
      <Suspense>
        {isDeleteModalOpen && (
          <VmDeleteModal
            isOpen={isDeleteModalOpen}
            onRequestClose={() => toggleDeleteModal(false)}
            data={modalData}
            onClose={() => toggleDeleteModal(false)} 
          />
        )}
      </Suspense>
    </>
  );
};

export default NetworkVms;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAllVmsFromNetwork } from "../../api/RQHook";
import TableColumnsInfo from "../table/TableColumnsInfo";
import TableOuter from "../table/TableOuter";
import { useNavigate } from 'react-router-dom';
import { Suspense, useState } from 'react';
import { faChevronDown, faPlay } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../Modal/DeleteModal";

const NetworkVm = ({ network }) => {
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);
  const openPopup = (popupType) => setActivePopup(popupType);
  const closePopup = () => setActivePopup(null);
  const [activeVmFilter, setActiveVmFilter] = useState('running');
  
  const handleVmFilterClick = (filter) => {
    setActiveVmFilter(filter);
  };

  const [modals, setModals] = useState({ delete: false });
  const [selectedVms, setSelectedVms] = useState(null);
  const toggleModal = (type, isOpen) => {
    setModals((prev) => ({ ...prev, [type]: isOpen }));
};


  const { 
    data: vms = [],  // 기본값 설정
    status: vmsStatus,
    isLoading: isVmsLoading,
    isError: isVmsError
  } = useAllVmsFromNetwork(network?.id, toTableItemPredicateVms);

  function toTableItemPredicateVms(vm) {
    const status = vm?.status ?? '';
    const icon = status === 'UP' 
      ? <FontAwesomeIcon icon={faPlay} fixedWidth style={{ color: 'lime', fontSize: '0.3rem', transform: 'rotate(270deg)' }} />
      : status === 'DOWN' 
      ? <FontAwesomeIcon icon={faPlay} fixedWidth style={{ color: 'red', fontSize: '0.3rem', transform: 'rotate(90deg)' }} />
      : '';
    
    return {
      id: vm?.id ?? '없음',  
      name: vm?.name ?? '없음',  
      cluster: vm?.clusterVo?.name ?? '없음',
      ipAddress: vm?.ipAddress ?? '없음',
      fqdn: vm?.fqdn ?? '',
      icon: icon,
      status: status,
      vnic: vm?.vnic ?? '',
      vnicRx: vm?.vnicRx ?? '',
      vnicTx: vm?.vnicTx ?? '',
      rxTotalSpeed: vm?.rxTotalSpeed
      ? vm.rxTotalSpeed.toLocaleString() // 천 단위 구분 기호 추가
      : '',
      txTotalSpeed: vm?.txTotalSpeed
      ? vm.txTotalSpeed.toLocaleString() // 천 단위 구분 기호 추가
      : '',
      description: vm?.description ?? '없음'
    };
  }

  // 실행 중인 VM과 정지된 VM을 각각 필터링
  const runningVms = vms.filter(vm => vm.status === 'UP');
  const stoppedVms = vms.filter(vm => vm.status === 'DOWN');

  return (
    <>
      <div className="header_right_btns">
      <button onClick={() => selectedVms?.id && toggleModal('delete', true)} disabled={!selectedVms?.id}>제거</button>
      </div>
      
      <div className="host_filter_btns">
        <button
          className={activeVmFilter === 'running' ? 'active' : ''}
          onClick={() => handleVmFilterClick('running')}
        >
          실행중
        </button>
        <button
          className={activeVmFilter === 'stopped' ? 'active' : ''}
          onClick={() => handleVmFilterClick('stopped')}
        >
          정지중
        </button>
      </div>

      <span>id = {selectedVms?.id || ''}</span>
      {activeVmFilter === 'running' && (
        <TableOuter
          columns={TableColumnsInfo.VMS_NIC}
          data={runningVms} // 실행 중인 VM 데이터만 전달
          onRowClick={(row, column, colIndex) => {
            console.log('선택한 vNIC Profile 행 데이터:', row);
  
            setSelectedVms(row);
            if (colIndex === 1) {
              navigate(`/computing/vms/${row.id}`);
            } 
          }}
          clickableColumnIndex={[1]}
          onContextMenuItems={() => [
            <div key="제거" onClick={() => console.log()}>제거</div>,
          ]}
        />
      )}

      {activeVmFilter === 'stopped' && (
        <TableOuter
          columns={TableColumnsInfo.VMS_STOP}
          data={stoppedVms} // 정지된 VM 데이터만 전달
          onRowClick={() => console.log('Row clicked')}
        />
      )}
      <Suspense>
         {/*api없음 */}
          {modals.delete && selectedVms && (
            <DeleteModal
                isOpen={modals.delete}
                type='가상머신'
                onRequestClose={() => toggleModal('delete', false)}
                contentLabel={'가상머신'}
                data={ selectedVms}
                networkId={network?.id}
            />
            )}
        </Suspense>

    </>
  );
};

export default NetworkVm;

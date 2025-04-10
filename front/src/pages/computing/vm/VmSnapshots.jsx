  import React, { Suspense, useState } from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmSnapshotModal from '../../../components/modal/vm/VmSnapshotModal';
import { useDeleteSnapshot, useSnapshotsFromVM, useVm } from '../../../api/RQHook';
import { convertBytesToMB } from '../../../util';
import TablesRow from '../../../components/table/TablesRow';
import DeleteModal from '../../../utils/DeleteModal';
import ActionButton from '../../../components/button/ActionButton';
import { RVI16, rvi16ChevronDown, rvi16ChevronRight, rvi16Desktop, rvi16Location, rvi16Pause, RVI24, status2Icon } from '../../../components/icons/RutilVmIcons';
import Localization from '../../../utils/Localization';
import Loading from '../../../components/common/Loading';
import toast from 'react-hot-toast';
import VmSnapshotDeleteModal from '../../../components/modal/vm/VmSnapshotDeleteModal';

const VmSnapshots = ({ vmId }) => {
  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
  } = useVm(vmId);

  const {
    data: snapshots = [],
    isLoading: isSnapshotsLoading,
    isError: isSnapshotsError,
    isSuccess: isSnapshotsSuccess
  } = useSnapshotsFromVM(vmId, (e) => ({ ...e }));


  const transformedData = snapshots.map((snapshot) => ({
    ...snapshot,
    id: snapshot?.id,
    description: snapshot?.description,
    status: snapshot?.status,
    created: snapshot?.date ?? "현재",
    interface_: snapshot?.interface_,
    persistMemory: snapshot?.persistMemory ? "true" : "false",
    cpuCore: `${snapshot?.vmViewVo?.cpuTopologyCnt} (${snapshot?.vmViewVo?.cpuTopologyCore}:${snapshot?.vmViewVo?.cpuTopologySocket}:${snapshot?.vmViewVo?.cpuTopologyThread})`,
    memorySize: convertBytesToMB(snapshot?.vmViewVo?.memorySize) + " MB" ?? "",
    memoryActual: convertBytesToMB(snapshot?.vmViewVo?.memoryGuaranteed) + " MB" ?? "",
    _status: status2Icon(snapshot?.status)
  }));

  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const hasLockedSnapshot = transformedData.some(snap => snap.status === "locked");

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  const toggleSnapshotSelection = (snapshot) => {
    setSelectedSnapshot(snapshot);
  };

  return (
    <>
      <div className="header-right-btns no-search-box">
        <ActionButton actionType="default" label={Localization.kr.CREATE}
          disabled={hasLockedSnapshot} 
          onClick={() => openModal("create")}
        />
        <ActionButton actionType="default" label="미리보기"          
          disabled={!selectedSnapshot} 
          onClick={() => openModal("preview")}
        />
        <ActionButton actionType="default" label={Localization.kr.REMOVE}
          disabled={!selectedSnapshot} 
          onClick={() => openModal("delete")}
        />
        <ActionButton actionType="default" label={Localization.kr.MOVE}          
          disabled={!selectedSnapshot} 
          onClick={() => openModal("move")}
        />
      </div>

      <div className='center'>
        <div className=" vm-snap-item">
          <div className="snapshot-item f-start">
            <RVI16 iconDef={rvi16ChevronDown} />
            <div className="snapshot-label">VM 스냅샷 {new Date().toLocaleString()}</div>
          </div>

          {/* 항상 현재 위치 표시 */}
          <div className="snapshot-item f-start">
            <RVI16 iconDef={rvi16ChevronDown} />
            <div className='snapshot-label  f-center'>
              <RVI16 iconDef={rvi16Location} className="mr-1.5 ml-2.5" />
              현재 위치
            </div>
          </div>
   
          {isSnapshotsLoading && (<Loading/>)}

          {/*스냅샷없을때*/}
          {!isSnapshotsLoading && transformedData?.length === 0 && (<></>)}

          {transformedData?.length > 0 && transformedData?.map((snapshot) => (
            <div
              key={snapshot.id}
              className="snapshot-item f-start"
              onClick={() => toggleSnapshotSelection(snapshot)}
              style={{ cursor: 'pointer', padding: '4px 26px', background: selectedSnapshot?.id === snapshot.id ? '#E2E5EB' : 'none' }}
            >
               {/* 선택된 스냅샷이면 아래, 아니면 오른쪽 화살표 */}
              <RVI16 iconDef={selectedSnapshot?.id === snapshot.id? rvi16ChevronDown : rvi16ChevronRight}/>
              <div className='snapshot-label f-center'>
              [상태: {snapshot?._status}]<RVI16 iconDef={rvi16Desktop} className="mr-1.5 ml-2.5" />
                {snapshot?.description}
              </div>          
            </div>
          ))}
        </div>
        
        <div className="vm-snap-item">
          {selectedSnapshot ? (
            <TablesRow
              columns={TableColumnsInfo.SNAPSHOT_INFO_FROM_VM}
              data={selectedSnapshot}
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      <Suspense>
        {activeModal === "create" && (
          <VmSnapshotModal
            isOpen
            onClose={closeModal}
            selectedVm={vm}
            // diskData={disks}
          />
        )}
        {activeModal === "delete" && (
          <VmSnapshotDeleteModal 
            isOpen
            onClose={closeModal}
            data={selectedSnapshot}
            vmId={vm.id}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmSnapshots;

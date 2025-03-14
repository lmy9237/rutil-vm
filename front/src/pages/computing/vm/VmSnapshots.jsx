import React, { Suspense, useEffect, useState } from 'react';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmSnapshotModal from '../../../components/modal/vm/VmSnapshotModal';
import VmSnapshotDeleteModal from '../../../components/modal/vm/VmSnapshotDeleteModal';
import { useSnapshotsFromVM, useVmById } from '../../../api/RQHook';
import { convertBytesToMB } from '../../../util';
import TablesRow from '../../../components/table/TablesRow';

const VmSnapshots = ({ vmId }) => {
  const {
    data: snapshots,
    isLoading: isSnapshotsLoading,
  } = useSnapshotsFromVM(vmId, (snapshot) => ({
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
  }));

  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  const toggleSnapshotSelection = (snapshot) => {
    setSelectedSnapshot(snapshot);
  };

  return (
    <>
      <div className="header-right-btns">
        <button className="snap_create_btn">생성</button>
        <button className="snap_create_btn">미리보기</button>
        <button className="snap_create_btn">삭제</button>
        <button className="snap_create_btn">이동</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        <div className="info-table-outer">
          {isSnapshotsLoading && <div className="no_snapshots">로딩중...</div>}
          {snapshots?.length > 0 && snapshots?.map((snapshot) => (
            <div
              key={snapshot.id}
              className="snapshot-item"
              onClick={() => toggleSnapshotSelection(snapshot)}
              style={{ cursor: 'pointer', padding: '5px', border: selectedSnapshot?.id === snapshot.id ? '1px solid blue' : 'none' }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
              {" " + snapshot?.description + "  |  " + snapshot?.date}
            </div>
          ))}
        </div>

          {selectedSnapshot ? (
          <div className="abc" style={{ padding: '10px', width: '40%' }}>
            <TablesRow
              columns={TableColumnsInfo.SNAPSHOT_INFO_FROM_VM}
              data={selectedSnapshot}
            />
            </div>
          ) : (
            <div className="abc" style={{ padding: '10px', width: '40%' }}>
            <span></span>
            </div>
        
          )}
      </div>

      <Suspense>
        {activeModal === "create" && (
          <VmSnapshotModal
            isOpen
            onClose={closeModal}
            vmId={vmId}
            // diskData={disks}
          />
        )}
        {activeModal === "delete" && (
          <VmSnapshotDeleteModal
            isOpen
            data={selectedSnapshot}
            vmId={vmId}
            onClose={closeModal}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmSnapshots;

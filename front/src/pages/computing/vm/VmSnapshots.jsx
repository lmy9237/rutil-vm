import React, { Suspense, useState } from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmSnapshotModal from '../../../components/modal/vm/VmSnapshotModal';
import { useSnapshotsFromVM } from '../../../api/RQHook';
import { convertBytesToMB } from '../../../util';
import TablesRow from '../../../components/table/TablesRow';
import DeleteModal from '../../../utils/DeleteModal';
import ActionButton from '../../../components/button/ActionButton';

const VmSnapshots = ({ vmId }) => {
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

        <ActionButton actionType="default"
          label="생성"
          onClick={() => openModal("create")}
        />
        <ActionButton actionType="default"
          label="미리보기"
          onClick={() => openModal("preview")}
        />
        <ActionButton actionType="default"
          label="삭제"
          onClick={() => openModal("delete")}
        />
        <ActionButton actionType="default"
          label="이동"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        <div className="info-table-outer">
          {isSnapshotsLoading && <div className="no_snapshots">로딩중...</div>}
          {transformedData?.length > 0 && transformedData?.map((snapshot) => (
            <div
              key={snapshot.id}
              className="snapshot-item"
              onClick={() => toggleSnapshotSelection(snapshot)}
              style={{ cursor: 'pointer', padding: '5px', border: selectedSnapshot?.id === snapshot.id ? '1px solid blue' : 'none' }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
              {" " + snapshot?.description + "  /  " + snapshot?.date}
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
          <DeleteModal 
            isOpen
            label={"스냅샷"}
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

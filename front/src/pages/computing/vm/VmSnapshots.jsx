import React, { Suspense, useState } from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmSnapshotModal from '../../../components/modal/vm/VmSnapshotModal';
import { useSnapshotsFromVM } from '../../../api/RQHook';
import { convertBytesToMB } from '../../../util';
import TablesRow from '../../../components/table/TablesRow';
import DeleteModal from '../../../utils/DeleteModal';
import ActionButton from '../../../components/button/ActionButton';
import { RVI16, rvi16ChevronDown, rvi16ChevronRight, RVI24 } from '../../../components/icons/RutilVmIcons';
import Localization from '../../../utils/Localization';

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
          label={Localization.kr.CREATE}
          onClick={() => openModal("create")}
        />
        <ActionButton actionType="default"
          label="미리보기"
          onClick={() => openModal("preview")}
        />
        <ActionButton actionType="default"
          label={Localization.kr.REMOVE}
          onClick={() => openModal("delete")}
        />
        <ActionButton actionType="default"
          label={Localization.kr.MOVE}
          onClick={() => openModal("move")}
        />
      </div>

      <div className='center'>
        <div className=" vm-snap-item">
          {isSnapshotsLoading && <div className="no_snapshots">로딩중...</div>}
          {transformedData?.length > 0 && transformedData?.map((snapshot) => (
            <div
              key={snapshot.id}
              className="snapshot-item f-start"
              onClick={() => toggleSnapshotSelection(snapshot)}
              style={{ cursor: 'pointer', padding: '4px 50px', background: selectedSnapshot?.id === snapshot.id ? '#E2E5EB' : 'none' }}
            >
               {/* 선택된 스냅샷이면 아래, 아니면 오른쪽 화살표 */}
              <RVI16
                iconDef={
                  selectedSnapshot?.id === snapshot.id
                    ? rvi16ChevronDown
                    : rvi16ChevronRight
                }
              />
              <div className='snapshot-label'>{" " + snapshot?.description + "  /  " + snapshot?.date}</div>

          
            </div>
          ))}
        </div>

          {selectedSnapshot ? (
            <div className=" vm-snap-item">
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

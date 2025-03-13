import React, { Suspense, useEffect, useState } from 'react';
import { faCamera, faChevronDown, faChevronRight, faEye, faNewspaper, faServer, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmSnapshotModal from '../../../components/modal/vm/VmSnapshotModal';
import VmSnapshotDeleteModal from '../../../components/modal/vm/VmSnapshotDeleteModal';
import { useSnapshotsFromVM, useVmById } from '../../../api/RQHook';
import { checkZeroSizeToMbps, convertBytesToGB, convertBytesToMB } from '../../../util';
import TablesRow from '../../../components/table/TablesRow';

const SnapshotSection = ({ snapshot, sectionKey, label, icon, activeSection, toggleSection }) => (
  <div onClick={() => toggleSection(snapshot.id, sectionKey)} style={{ color: activeSection?.snapshotId === snapshot.id && activeSection?.section === sectionKey ? '#449bff' : 'inherit' }}>
    <FontAwesomeIcon icon={activeSection?.snapshotId === snapshot.id && activeSection?.section === sectionKey ? faChevronDown : faChevronRight} fixedWidth />
    <span>{label}</span>
    <FontAwesomeIcon icon={icon} fixedWidth />
  </div>
);

/**
 * @name VmSnapshots
 * @description 가상머신에 종속 된 스냅샷 목록
 *
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} VmSnapshots
 */
const VmSnapshots = ({ vmId }) => {
  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
  } = useVmById(vmId);

  const {
    data: snapshots,
    isLoading: isSnapshotsLoading ,
    isError: isSnapshotsError,
    isSuccess: isSnapshotsSuccess,
  } = useSnapshotsFromVM(vmId, (snapshot) => ({
    ...snapshot,
    id: snapshot?.id,
    description: snapshot?.description,
    status: snapshot?.status,
    created: snapshot?.date ?? "현재",
    interface_: snapshot?.interface_,
    persistMemory: snapshot?.persistMemory ? "true" : "false",
    cpuCore: `${snapshot?.vmViewVo?.cpuTopologyCnt} (${snapshot?.vmViewVo?.cpuTopologyCore}:${snapshot?.vmViewVo?.cpuTopologySocket}:${snapshot?.vmViewVo?.cpuTopologyThread})`,
    memorySize: convertBytesToMB(snapshot?.vmViewVo?.memorySize)+ " MB" ?? "",
    memoryActual: convertBytesToMB(snapshot?.vmViewVo?.memoryGuaranteed)+ " MB" ?? "",
  }));
  const [expandedSnapshots, setExpandedSnapshots] = useState({});
  const [selectedSnapshots, setSelectedSnapshots] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  const toggleExpand = (snapshotId) => {
    setExpandedSnapshots((prev) => ({
      ...prev,
      [snapshotId]: !prev[snapshotId],
    }));
  };

  const toggleSnapshotSelection = (snapshot, event) => {
    setSelectedSnapshots((prev) =>
      event.ctrlKey
        ? prev.some((item) => item.id === snapshot.id)
          ? prev.filter((item) => item.id !== snapshot.id)
          : [...prev, snapshot]
        : [snapshot]
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.snapshot_list, .header-right-btns, .snap_create_btn')) {
        setSelectedSnapshots([]);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  
  return (
    <>
      <div className="header-right-btns">
        <button className="snap_create_btn" onClick={() => openModal('create')}>생성</button>
        <button className='snap_create_btn' onClick={() => openModal('preview')} disabled={vm?.status === "UP"}>미리보기</button>
        <button className='snap_create_btn' onClick={() => openModal('commit')}>삭제</button>
        <button className='snap_create_btn' onClick={() => openModal('reset')}>이동</button>
        <button onClick={() => openModal("delete")} disabled={!selectedSnapshots}>스냅샷 삭제</button>
        {/* <button className='snap_create_btn' onClick={() => openModal('clone')}>복제</button> */}
      </div>
      <span>ID: {selectedSnapshots.map((snap) => snap.id).join(', ') || '없음'}</span>

      <div className="snapshot_list " onClick={(e) => e.stopPropagation()}>
        {isSnapshotsLoading && <div className="no_snapshots">로딩중...</div>}
        {snapshots?.length > 0 && snapshots?.map((snapshot) => (
          <div>
            <div
              className="snapshot-item"
              onClick={(event) => toggleSnapshotSelection(snapshot, event)}
              style={{ cursor: 'pointer', padding: '5px', border: selectedSnapshots.includes(snapshot) ? '1px solid blue' : 'none' }}
            >
              <FontAwesomeIcon 
                icon={expandedSnapshots[snapshot.id] ? faChevronDown : faChevronRight} 
                onClick={() => toggleExpand(snapshot.id)} 
              />
              {" "+ snapshot?.description +"  |  " + snapshot?.date}
            </div>

            {expandedSnapshots[snapshot?.id] && (
              <div className="network-content-detail-box" style={{ paddingLeft: '30px' }}>
                <TablesRow
                  columns={TableColumnsInfo.SNAPSHOT_INFO_FROM_VM} 
                  data={snapshot} 
                />
              </div>
            )}
          </div>
        ))}
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
            data={selectedSnapshots}
            vmId={vmId}
            onClose={closeModal}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmSnapshots;
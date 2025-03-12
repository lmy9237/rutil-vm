import React, { Suspense, useEffect, useState } from 'react';
import { faCamera, faChevronDown, faChevronRight, faEye, faNewspaper, faServer, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmSnapshotModal from '../../../components/modal/vm/VmSnapshotModal';
import VmSnapshotDeleteModal from '../../../components/modal/vm/VmSnapshotDeleteModal';
import { useSnapshotsFromVM } from '../../../api/RQHook';
import { convertBytesToGB, convertBytesToMB } from '../../../util';
import TablesRow from '../../../components/table/TablesRow';

/**
 * @name VmSnapshots
 * @description 가상머신에 종속 된 스냅샷 목록
 *
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} VmSnapshots
 */
const SnapshotSection = ({ snapshot, sectionKey, label, icon, activeSection, toggleSection }) => (
  <div onClick={() => toggleSection(snapshot.id, sectionKey)} style={{ color: activeSection?.snapshotId === snapshot.id && activeSection?.section === sectionKey ? '#449bff' : 'inherit' }}>
    <FontAwesomeIcon icon={activeSection?.snapshotId === snapshot.id && activeSection?.section === sectionKey ? faChevronDown : faChevronRight} fixedWidth />
    <span>{label}</span>
    <FontAwesomeIcon icon={icon} fixedWidth />
  </div>
);

const VmSnapshots = ({ vmId }) => {
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
    persistMemory: snapshot?.persistMemory ?? "",
    cpuCore: `${snapshot?.vmVo?.cpuTopologyCnt} (${snapshot?.vmVo?.cpuTopologyCore}:${snapshot?.vmVo?.cpuTopologySocket}:${snapshot?.vmVo?.cpuTopologyThread})`,
    memorySize: convertBytesToMB(snapshot?.vmVo?.memorySize) ?? "",
    memoryActual: convertBytesToMB(snapshot?.vmVo?.actualSize) ?? "",

    snapshotDiskVos: snapshot?.snapshotDiskVos?.map((disk) => ({
      id: disk?.id || '',
      alias: disk?.alias || '',
      description: disk?.description || '',
      provisionedSize: convertBytesToGB(disk?.provisionedSize),
      actualSize: convertBytesToGB(disk?.actualSize),
      sparse: disk?.sparse ? '씬' : '사전 할당',
      format: disk?.format || '',
      status: disk?.status || '',
    })) || [],

    nicVos: snapshot?.nicVos?.map((nic) => ({
      id: nic?.id,
      name: nic?.name,
      networkName: nic?.networkVo?.name,
      profileName: nic?.vnicProfileVo?.name,
    })) || [],

    applicationVos: snapshot?.applicationVos?.map((app) => ({
      name: app?.name,
      version: app?.version,
      description: app?.description
    }))
  }));
  
  const [activePopup, setActivePopup] = useState(null);
  const [modals, setModals] = useState({ create: false, edit: false, delete: false });
  const [activeSection, setActiveSection] = useState(null);
  const [selectedSnapshots, setSelectedSnapshots] = useState([]);

  const toggleModal = (type, isOpen) => setModals((prev) => ({ ...prev, [type]: isOpen }));
  const openPopup = (popupType) => { setActivePopup(popupType) };
  const closePopup = () => { setActivePopup(null) };

  const toggleSnapshotSelection = (snapshot, event) => {
    setSelectedSnapshots((prev) =>
      event.ctrlKey
        ? prev.some((item) => item.id === snapshot.id)
          ? prev.filter((item) => item.id !== snapshot.id)
          : [...prev, snapshot]
        : [snapshot]
    );
  };

  const toggleSection = (snapshotId, section) => {
    setActiveSection((prev) =>
      prev?.snapshotId === snapshotId && prev?.section === section ? null : { snapshotId, section }
    );
  };

  // 외부클릭
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.snapshot_list, .header-right-btns, .snap_create_btn')) {
        setSelectedSnapshots([]);
        setActiveSection(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);
  
  return (
    <>
      <div className="header-right-btns">
        <button className="snap_create_btn" onClick={() => openPopup('new')}>생성</button>
        <button className='disabled'>미리보기</button>
        <button className='disabled'>커밋</button>
        <button className='disabled'>되돌리기</button>
        <button
          className="snap_delete_btn"
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 전파 방지
            if (selectedSnapshots.length) {toggleModal('delete', true); } 
            else {console.error('No snapshots selected for deletion.');}
          }}
          disabled={!selectedSnapshots.length} // 선택된 항목이 없으면 비활성화
        >
          삭제
        </button>
        <button className='disabled'>복제</button>
      </div>
      <span>ID: {selectedSnapshots.map((snap) => snap.id).join(', ') || '없음'}</span>

      <div className="snapshot_list " onClick={(e) => e.stopPropagation()}>
        {isSnapshotsLoading && <div className="no_snapshots">로딩중...</div>}
        {!isSnapshotsLoading && snapshots?.length > 0 && snapshots.map(snapshot => (
          <div>
            <div
              onClick={(event) => toggleSnapshotSelection(snapshot, event)} // snapshot-content의 클릭 이벤트
              className="snapshot-content"
              style={{border: selectedSnapshots.some((item) => item.id === snapshot.id) ? '1px solid #b9b9b9' : 'none',}}
            >
              <div className="snapshot-content-left">
                <div><FontAwesomeIcon icon={faCamera} fixedWidth /></div>
                <span>{snapshot?.description || 'Unnamed'}</span>
              </div>
              <div className="snapshot-content-right">
                {[['general', '일반', faEye], 
                  ['disk', '디스크', faTrash], 
                  ['network', '네트워크 인터페이스', faServer], 
                  ['applications', '설치된 애플리케이션', faNewspaper]].map(([key, label, icon]) => (
                  <SnapshotSection 
                    key={key} 
                    snapshot={snapshot} 
                    sectionKey={key} 
                    label={label} 
                    icon={icon} 
                    activeSection={activeSection} 
                    toggleSection={toggleSection} 
                  />
                ))}
              </div>
            </div>

            {/* General Section */}
            {activeSection?.snapshotId === snapshot.id && activeSection?.section === 'general' && (
              <div className="snap-hidden-content active">
                <TablesRow
                  columns={TableColumnsInfo.SNAPSHOT_INFO_FROM_VM} // 스냅샷 컬럼 정보
                  data={snapshot} // 스냅샷 데이터
                />
              </div>
            )}

            {/* Disk Section */}
            {activeSection?.snapshotId === snapshot.id && activeSection?.section === 'disk' && (
              <div className="snap-hidden-content active">
                <TablesOuter
                  isLoading={isSnapshotsLoading}
                  isError={isSnapshotsError}
                  isSuccess={isSnapshotsSuccess}
                  columns={TableColumnsInfo.SNAPSHOT_DISK_FROM_VM}
                  data={snapshot?.snapshotDiskVos}
                />
              </div>
            )}

            {/* Network Section */}
            {activeSection?.snapshotId === snapshot.id && activeSection?.section === 'network' && (
              <div className="snap-hidden-content active">
                <TablesOuter
                  isLoading={isSnapshotsLoading}
                  isError={isSnapshotsError}
                  isSuccess={isSnapshotsSuccess}
                  columns={TableColumnsInfo.SNAPSHOT_NIC_FROM_VM}
                  data={snapshot?.nicVos}
                />    
              </div>
            )}

            {/* Applications Section */}
            {activeSection?.snapshotId === snapshot.id && activeSection?.section === 'applications' && (
              <div className="snap-hidden-content active">
                <TablesOuter
                  isLoading={isSnapshotsLoading}
                  isError={isSnapshotsError}
                  isSuccess={isSnapshotsSuccess}
                  columns={TableColumnsInfo.SNAPSHOT_APPLICATION_FROM_VM}
                  data={snapshot?.applicationVos}
                />         
              </div>
            )}
          </div>
        ))}
      </div>

      <Suspense>
        <VmSnapshotModal
          isOpen={activePopup === 'new'}
          onClose={closePopup}
          vmId={vmId}
          // diskData={disks}
        />
        {modals.delete && snapshots.length > 0 && (
          <VmSnapshotDeleteModal
            isOpen={modals.delete}
            data={selectedSnapshots}
            vmId={vmId}
            onClose={() => toggleModal('delete', false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmSnapshots;
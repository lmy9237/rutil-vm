import React, { Suspense, useEffect, useState } from 'react';
import { faCamera, faChevronDown, faChevronRight, faExclamationTriangle, faEye, faNewspaper, faServer, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmSnapshotModal from '../../../components/modal/vm/VmSnapshotModal';
import VmSnapshotDeleteModal from '../../../components/modal/vm/VmSnapshotDeleteModal';
import DeleteModal from '../../../utils/DeleteModal';
import { useDisksFromVM, useSnapshotDetailFromVM, useSnapshotFromVM } from '../../../api/RQHook';
import { convertBytesToMB } from '../../../util';

const VmSnapshots = ({ vmId }) => {
  const [activePopup, setActivePopup] = useState(null);
  const [modals, setModals] = useState({ create: false, edit: false, delete: false });
  const [selectedSnapshots, setSelectedSnapshots] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [bootable, setBootable] = useState(true);
  const toggleModal = (type, isOpen) => {
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };
  const openPopup = (popupType) => {
    setActivePopup(popupType);
  };
  const closePopup = () => {
    setActivePopup(null);
  };

  const toggleSnapshotSelection = (snapshot, event) => {
    if (event.ctrlKey) {
      setSelectedSnapshots((prev) =>
        prev.some((item) => item.id === snapshot.id)
          ? prev.filter((item) => item.id !== snapshot.id) // 선택 해제
          : [...prev, snapshot] // 객체 추가
      );
    } else {
      setSelectedSnapshots([snapshot]); // 단일 선택 (객체)
    }
  };


  const toggleSection = (snapshotId, section) => {
    if (activeSection?.snapshotId === snapshotId && activeSection?.section === section) {
      setActiveSection(null); // 현재 열려있다면 닫음
    } else {
      setActiveSection({ snapshotId, section }); // 새로운 섹션 열기
    }
  };


  const {
    data: snapshots,
  } = useSnapshotFromVM(vmId, toTableItemPredicateSnapshots);
  function toTableItemPredicateSnapshots(snapshot) {
    return {
      id: snapshot?.id ?? '',
      vmId: snapshot?.vmVo?.id ?? '',
      name: snapshot?.description ?? '',
      status: snapshot?.status ?? '',
      fqdn: snapshot?.fqdn ?? '',
      created: snapshot?.creationDate ?? 'N/A',
      vmStatus: snapshot?.vmVo?.status ?? 'N/A',

      memorySize: snapshot?.vmVo?.memorySize ?? 'N/A',
      memoryActual: snapshot?.vmVo?.actualSize
        ? `${(snapshot.vmVo?.actualSize / (1024 ** 3)).toFixed(2)} GB`
        : 'N/A', // 크기
      creationDate: snapshot?.date ?? 'N/A', // 생성 일자
      snapshotCreationDate: snapshot?.snapshotDiskVos?.[0]?.createDate ?? 'N/A', // 스냅샷 생성일
      alias: snapshot?.snapshotDiskVos?.[0]?.alias || '없음', // 디스크 별칭
      description: snapshot?.snapshotDiskVos?.[0]?.description || '없음', // 스냅샷 설명
      target: snapshot?.vmVo?.name || '없음', // 연결 대상
      diskSnapshotId: snapshot?.snapshotDiskVos?.[0]?.id || '', // 디스크 스냅샷 ID
    };
  }

  const { data: disks } = useDisksFromVM(vmId, (e) => ({
    ...e,
    snapshot_check: (
      <input
        type="checkbox"
        name="diskSelection"
        onChange={(e) => setBootable(e.target.checked)}
      />
    ),
    alias: e?.diskImageVo?.alias,
    description: e?.diskImageVo?.description,
  }));

  const {
    data: snapshotdetail,
  } = useSnapshotDetailFromVM(vmId, selectedSnapshots[0]?.id, (e) => ({
    ...e,
    id: e?.id ?? '',
    description: e?.description || 'N/A',
    status: e?.status || 'N/A',
    date: e?.date || 'N/A',
    vmName: e?.vmVo?.name || 'N/A',
    memorySize: e?.vmVo?.memorySize
      ? `${convertBytesToMB(e.vmVo.memorySize)} MB` // 바이트를 MB로 변환
      : 'N/A',
    memoryActual: e?.vmVo?.memoryActual
      ? `${convertBytesToMB(e.vmVo.memoryActual)} MB` // 바이트를 MB로 변환
      : 'N/A',
    snapshotDisks: e?.snapshotDiskVos?.map((disk) => ({
      id: disk?.id || 'N/A',
      alias: disk?.alias || 'N/A',
      description: disk?.description || 'N/A',
      provisionedSize: disk?.provisionedSize
        ? `${Math.floor(disk.provisionedSize / (1024 ** 3))} GiB`
        : 'N/A',
      actualSize: disk?.actualSize
        ? `${Math.floor(disk.actualSize / (1024 ** 3))} GiB`
        : 'N/A',
      sparse: disk?.sparse ? 'Yes' : 'No',
      format: disk?.format || 'N/A',
      status: disk?.status || 'N/A',
    })) || [],
  }));
  // 외부클릭
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const snapshotList = document.querySelector('.snapshot_list');
      const excludeElements = document.querySelectorAll('.header-right-btns, .snap_create_btn'); // 제외할 영역들
      const isExcluded = Array.from(excludeElements).some((el) => el.contains(event.target));

      if (!isExcluded && snapshotList && !snapshotList.contains(event.target)) {
        setSelectedSnapshots([]); // 선택 해제
        setActiveSection(null); // 모든 섹션 닫기
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);





  useEffect(() => {
    if (snapshotdetail) {
      console.log(' 유유스냅샷데이터:', snapshotdetail);
    }
  }, [snapshotdetail]);

  return (
    <>
      <div className="header-right-btns">
        <button className="snap_create_btn" onClick={() => openPopup('new')}>
          생성
        </button>
        <button className='disabled'>미리보기</button>
        <button className='disabled'>커밋</button>
        <button className='disabled'>되돌리기</button>
        <button
          className="snap_delete_btn"
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 전파 방지
            if (selectedSnapshots.length) {
              toggleModal('delete', true); // 모달 열기
            } else {
              console.error('No snapshots selected for deletion.');
            }
          }}
          disabled={!selectedSnapshots.length} // 선택된 항목이 없으면 비활성화
        >
          삭제
        </button>
        <button className='disabled'>복제</button>
      </div>
      <span>선택된 ID: {selectedSnapshots.map((snap) => snap.id).join(', ') || '없음'}</span>
      <div className="snapshot_list " onClick={(e) => e.stopPropagation()}>
        {snapshots && snapshots.length > 0 ? (
          snapshots.map((snapshot) => (
            <div>
              <div
                onClick={(event) => toggleSnapshotSelection(snapshot, event)} // snapshot-content의 클릭 이벤트
                className="snapshot-content"
                style={{
                  border: selectedSnapshots.some((item) => item.id === snapshot.id) ? '1px solid #b9b9b9' : 'none',
                }}
              >
                <div className="snapshot-content-left">
                  <div><FontAwesomeIcon icon={faCamera} fixedWidth /></div>
                  <span>{snapshot.name || 'Unnamed Snapshot'}</span>
                </div>

                <div className="snapshot-content-right">
                  {/* 일반 섹션 */}
                  <div
                    onClick={() => toggleSection(snapshot.id, 'general')}
                    style={{
                      color: activeSection?.snapshotId === snapshot.id && activeSection?.section === 'general'
                        ? '#449bff'
                        : 'inherit',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        activeSection?.snapshotId === snapshot.id && activeSection?.section === 'general'
                          ? faChevronDown
                          : faChevronRight
                      }
                      fixedWidth
                    />
                    <span>일반</span>
                    <FontAwesomeIcon icon={faEye} fixedWidth />
                  </div>

                  {/* 디스크 섹션 */}
                  <div
                    onClick={() => toggleSection(snapshot.id, 'disk')}
                    style={{
                      color: activeSection?.snapshotId === snapshot.id && activeSection?.section === 'disk'
                        ? '#449bff'
                        : 'inherit',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        activeSection?.snapshotId === snapshot.id && activeSection?.section === 'disk'
                          ? faChevronDown
                          : faChevronRight
                      }
                      fixedWidth
                    />
                    <span>디스크</span>
                    <FontAwesomeIcon icon={faTrash} fixedWidth />
                  </div>

                  {/* 네트워크 섹션 */}
                  <div
                    onClick={() => toggleSection(snapshot.id, 'network')}
                    style={{
                      color: activeSection?.snapshotId === snapshot.id && activeSection?.section === 'network'
                        ? '#449bff'
                        : 'inherit',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        activeSection?.snapshotId === snapshot.id && activeSection?.section === 'network'
                          ? faChevronDown
                          : faChevronRight
                      }
                      fixedWidth
                    />
                    <span>네트워크 인터페이스</span>
                    <FontAwesomeIcon icon={faServer} fixedWidth />
                  </div>

                  {/* 설치된 애플리케이션 섹션 */}
                  <div
                    onClick={() => toggleSection(snapshot.id, 'applications')}
                    style={{
                      color: activeSection?.snapshotId === snapshot.id && activeSection?.section === 'applications'
                        ? '#449bff'
                        : 'inherit',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        activeSection?.snapshotId === snapshot.id && activeSection?.section === 'applications'
                          ? faChevronDown
                          : faChevronRight
                      }
                      fixedWidth
                    />
                    <span>설치된 애플리케이션</span>
                    <FontAwesomeIcon icon={faNewspaper} fixedWidth />
                  </div>
                </div>
              </div>

              {/* General Section */}
              {activeSection?.snapshotId === snapshot.id && activeSection?.section === 'general' && (
                <div className="snap-hidden-content active">
                  <table className="snap-table">
                    <tbody>
                      <tr>
                        <th>날짜:</th>
                        <td>{snapshotdetail?.date || '정보없음'}</td>
                      </tr>
                      <tr>
                        <th>상태:</th>
                        <td>{snapshotdetail?.status || '정보없음'}</td>
                      </tr>
                      <tr>
                        <th>메모리:</th>
                        <td>{snapshot.memorySize ? 'true' : 'false'}</td>
                      </tr>
                      <tr>
                        <th>설명:</th>
                        <td>{snapshotdetail?.description || 'description'}</td>
                      </tr>
                      <tr>
                        <th>설정된 메모리:</th>
                        <td>{snapshotdetail?.memorySize || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>할당할 실제 메모리:</th>
                        <td>{snapshotdetail?.memoryActual || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>CPU 코어 수:</th>
                        <td>2 (2:1:1)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Disk Section */}
              {activeSection?.snapshotId === snapshot.id && activeSection?.section === 'disk' && (
                <div className="snap-hidden-content active">
                  <TablesOuter
                    columns={TableColumnsInfo.SNAPSHOT_DISK_FROM_VM}
                    data={Array.isArray(snapshotdetail?.snapshotDiskVos) ? snapshotdetail.snapshotDiskVos : []}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                  />
                </div>
              )}

              {/* Network Section */}
              {activeSection?.snapshotId === snapshot.id && activeSection?.section === 'network' && (
                <div className="snap-hidden-content active">
                  {Array.isArray(snapshotdetail?.nicVos) && snapshotdetail.nicVos.length > 0 ? (
                    snapshotdetail.nicVos.map((nic, index) => (
                      <table key={index} className="snap-table">
                        <tbody>
                          <tr>
                            <th>이름:</th>
                            <td>{nic?.name || '정보없음'}</td>
                          </tr>
                          <tr>
                            <th>네트워크 이름:</th>
                            <td>{nic?.networkVo?.name || '정보없음'}</td>
                          </tr>
                          <tr>
                            <th>프로파일 이름:</th>
                            <td>{nic?.vnicProfileVo?.name || '정보없음'}</td>
                          </tr>
                          <tr>
                            <th>유형:</th>
                            <td>{nic?.interface_ || '정보없음'}</td>
                          </tr>
                          <tr>
                            <th>MAC:</th>
                            <td>{nic?.macAddress || '정보없음'}</td>
                          </tr>
                          <tr>
                            <th>Rx 속도 (Mbps):</th>
                            <td>{nic?.rxSpeed || '정보없음'}</td>
                          </tr>
                          <tr>
                            <th>Tx 속도 (Mbps):</th>
                            <td>{nic?.txSpeed || '정보없음'}</td>
                          </tr>
                          <tr>
                            <th>중단 (Pkts):</th>
                            <td>{nic?.rxTotalError || 0}</td>
                          </tr>
                        </tbody>
                      </table>
                    ))
                  ) : (
                    <p>네트워크 데이터가 없습니다.</p>
                  )}
                </div>
              )}

              {/* Applications Section */}
              {activeSection?.snapshotId === snapshot.id && activeSection?.section === 'applications' && (
                <div className="snap-hidden-content active">
                  {selectedSnapshots.map((snapshot, index) => (
                    <div>
                      {selectedSnapshots.map((snapshot, index) => (
                        <div key={index}>
                          {/* <h4>스냅샷 ID: {snapshot.id}</h4> */}
                          {snapshot?.applicationVos && snapshot.applicationVos.length > 0 ? (
                            snapshot.applicationVos.map((app, appIndex) => (
                              <div key={appIndex} className="application-item">
                                <p>애플리케이션 이름: {app.name || '정보 없음'}</p>
                                <p>버전: {app.version || '정보 없음'}</p>
                                <p>설명: {app.description || '정보 없음'}</p>
                              </div>
                            ))
                          ) : (
                            <p>설치된 애플리케이션 데이터가 없습니다.</p>
                          )}
                        </div>
                      ))}
                    </div>

                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no_snapshots">로딩중...</div>
        )}
      </div>

      <Suspense>
        <VmSnapshotModal
          isOpen={activePopup === 'new'}
          onClose={closePopup}
          vmId={vmId}
          diskData={disks}
        />

        {modals.delete && selectedSnapshots.length > 0 && (
          <VmSnapshotDeleteModal
            isOpen={modals.delete}
            onClose={() => toggleModal('delete', false)}
            data={selectedSnapshots}
            vmId={vmId}
          />
        )}

      </Suspense>

    </>
  );
};

export default VmSnapshots;
import React, { Suspense, useState } from 'react'; 
import { useAllDiskSnapshotFromDomain } from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from '../../../components/table/TablesOuter';
import { formatBytesToGBToFixedZero } from '../../../utils/format';

const DeleteModal = React.lazy(() => import('../../../components/DeleteModal'));

const DomainDiskSnapshots = ({ domainId }) => {
  const { 
      data: diskSnapshots = [], 
      isLoading: isDiskSnapshotsLoading 
  } = useAllDiskSnapshotFromDomain(domainId, (e) => ({...e,}));

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedSnapshots, setSelectedSnapshots] = useState([]);

  const selectedIds = selectedSnapshots.map((snapshot) => snapshot.id).join(', ');

  return (
    <>
      <div className="header-right-btns">
        <button 
          onClick={() => setIsModalOpen(true)} 
          disabled={!selectedSnapshots.length} // 선택된 항목이 없으면 비활성화
        >
          제거
        </button>
      </div>

      <span>ID: {selectedIds || '선택된 ID가 없습니다.'}</span>

      <TablesOuter
        columns={TableColumnsInfo.DISK_SNAPSHOT_FROM_STORAGE_DOMAIN}
        data={diskSnapshots.map((e) => ({
          ...e,
          actualSize: formatBytesToGBToFixedZero(e?.actualSize) + ' GB'
        }))}
        onRowClick={(rows) => {
          setSelectedSnapshots(Array.isArray(rows) ? rows : []);
        }}
        multiSelect={true} 
      />

      {/* <Suspense fallback={<div>Loading...</div>}>
        {isModalOpen && (
          <DeleteModal
            isOpen={isModalOpen}
            type="DiskSnapShot"
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="디스크 스냅샷"
            data={selectedSnapshots}
          />
        )}
      </Suspense> */}
    </>
  );
};

export default DomainDiskSnapshots;

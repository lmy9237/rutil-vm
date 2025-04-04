import React, { useState } from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import { convertBytesToGB } from "../../../util";
import { useAllDiskSnapshotsFromDomain } from "../../../api/RQHook";
import ActionButton from "../../../components/button/ActionButton";
import SelectedIdView from "../../../components/common/SelectedIdView";

/**
 * @name DomainDiskSnapshots
 * @description 도메인에 종속 된 스냅샷 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDiskSnapshots
 */
const DomainDiskSnapshots = ({ domainId }) => {
  const { 
    data: diskSnapshots = [], 
    isLoading: isDiskSnapshotsLoading,
    isSuccess: isDiskSnapshotsSuccess,
    isError: isDiskSnapshotsError
  } = useAllDiskSnapshotsFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = diskSnapshots.map((e) => ({
    ...e,
    actualSize: convertBytesToGB(e?.actualSize) + " GB",
  }))

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSnapshots, setSelectedSnapshots] = useState([]);

  return (
    <>
      <div className="header-right-btns no-search-box">
        <ActionButton
          label="제거"
          actionType="default"
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedSnapshots.length}  // 선택된 항목이 없으면 비활성화
        />
      </div>

      <TablesOuter
        isLoading={isDiskSnapshotsLoading} isError={isDiskSnapshotsError} isSuccess={isDiskSnapshotsSuccess}
        columns={TableColumnsInfo.DISK_SNAPSHOT_FROM_STORAGE_DOMAIN}
        data={transformedData}
        onRowClick={(selectedRows) => setSelectedSnapshots(selectedRows)}
      />

      <SelectedIdView items={selectedSnapshots} />

      {/* <Suspense fallback={<Loading/>}>
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

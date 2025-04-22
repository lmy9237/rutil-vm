import React, { useState } from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import { checkZeroSizeToGiB } from "../../../util";
import { useAllDiskSnapshotsFromDomain } from "../../../api/RQHook";
import ActionButton from "../../../components/button/ActionButton";
import SelectedIdView from "../../../components/common/SelectedIdView";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import Localization from "../../../utils/Localization";

/**
 * @name DomainDiskSnapshots
 * @description 도메인에 종속 된 스냅샷 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDiskSnapshots
 */
const DomainDiskSnapshots = ({ 
  domainId
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { snapshotsSelected, setSnapshotSelected } = useGlobal()

  const { 
    data: diskSnapshots = [], 
    isLoading: isDiskSnapshotsLoading,
    isSuccess: isDiskSnapshotsSuccess,
    isError: isDiskSnapshotsError
  } = useAllDiskSnapshotsFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = [...diskSnapshots].map((e) => ({
    ...e,
    actualSize: checkZeroSizeToGiB(e?.actualSize),
    // actualSize: `${convertBytesToGB(e?.actualSize)} GB`,
  }))

  return (
    <>
      <div className="header-right-btns no-search-box">
        <ActionButton
          label={Localization.kr.REMOVE}
          actionType="default"
          onClick={() => setActiveModal(null)}
          disabled={snapshotsSelected.length === 0}  // 선택된 항목이 없으면 비활성화
        />
      </div>

      <TablesOuter
        isLoading={isDiskSnapshotsLoading} isError={isDiskSnapshotsError} isSuccess={isDiskSnapshotsSuccess}
        columns={TableColumnsInfo.DISK_SNAPSHOT_FROM_STORAGE_DOMAIN}
        data={transformedData}
        onRowClick={(selectedRows) => setSnapshotSelected(selectedRows)}
      />

      <SelectedIdView items={snapshotsSelected} />
    </>
  );
};

export default DomainDiskSnapshots;

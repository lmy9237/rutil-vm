import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import SearchBox from "../../../components/button/SearchBox";
import { checkZeroSizeToGiB } from "../../../util";
import { useAllDiskSnapshotsFromDomain } from "../../../api/RQHook";
import ActionButton from "../../../components/button/ActionButton";
import SelectedIdView from "../../../components/common/SelectedIdView";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import DiskSnapshotActionButtons from "../../../components/dupl/DiskSnapshotActionButtons";

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
  const { domainsSelected, snapshotsSelected, setSnapshotsSelected } = useGlobal()

  const { 
    data: diskSnapshots = [], 
    isLoading: isDiskSnapshotsLoading,
    isSuccess: isDiskSnapshotsSuccess,
    isError: isDiskSnapshotsError,
    refetch: refetchDiskSnapshots,
  } = useAllDiskSnapshotsFromDomain(domainId ?? domainsSelected[0]?.id, (e) => ({ ...e }));

  const transformedData = useMemo(() => [...diskSnapshots].map((e) => ({
    ...e,
    actualSize: checkZeroSizeToGiB(e?.actualSize),
    vmSnapshotDescription: e?.vmSnapshot?.description ?? "",
    vmNameConnected: e?.vm?.name ?? "",
    // actualSize: `${convertBytesToGB(e?.actualSize)} GB`,
  })), [diskSnapshots])

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`DomainDiskSnapshots > handleRefresh ... `)
    if (!refetchDiskSnapshots) return;
    refetchDiskSnapshots()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])
  
  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        <DiskSnapshotActionButtons />
      </div>
      <TablesOuter target={"disksnapshot"}
        columns={TableColumnsInfo.DISK_SNAPSHOT_FROM_STORAGE_DOMAIN}
        data={filteredData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setSnapshotsSelected(selectedRows)}
        refetch={refetchDiskSnapshots}
        isLoading={isDiskSnapshotsLoading} isError={isDiskSnapshotsError} isSuccess={isDiskSnapshotsSuccess}
      />
      <SelectedIdView items={snapshotsSelected} />
    </>
  );
};

export default DomainDiskSnapshots;

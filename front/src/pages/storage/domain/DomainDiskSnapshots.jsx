import React, { useCallback, useMemo } from "react";
import useUIState                from "@/hooks/useUIState";
import useGlobal                 from "@/hooks/useGlobal";
import useSearch                 from "@/hooks/useSearch";
import Loading                   from "@/components/common/Loading";
import SelectedIdView            from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink    from "@/components/common/OVirtWebAdminHyperlink";
import { ActionButton }          from "@/components/button/ActionButtons";
import SearchBox                 from "@/components/button/SearchBox";
import TableColumnsInfo          from "@/components/table/TableColumnsInfo";
import TablesOuter               from "@/components/table/TablesOuter";
import TableRowClick             from "@/components/table/TableRowClick";
import DiskSnapshotActionButtons from "@/components/dupl/DiskSnapshotActionButtons";
import { checkZeroSizeToGiB }    from "@/util";
import {
  useAllDiskSnapshotsFromDomain
} from "@/api/RQHook";
import Localization              from "@/utils/Localization";
import Logger                    from "@/utils/Logger";

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
  const { activeModal, setActiveModal } = useUIState();
  const {
    domainsSelected,
    snapshotsSelected, setSnapshotsSelected
  } = useGlobal();

  const { 
    data: diskSnapshots = [], 
    isLoading: isDiskSnapshotsLoading,
    isSuccess: isDiskSnapshotsSuccess,
    isError: isDiskSnapshotsError,
    refetch: refetchDiskSnapshots,
    isRefetching: isDiskSnapshotsRefetching,
  } = useAllDiskSnapshotsFromDomain(domainId ?? domainsSelected[0]?.id, (e) => ({ ...e }));

  const transformedData = useMemo(() => [...diskSnapshots].map((e) => ({
    ...e,
    actualSize: checkZeroSizeToGiB(e?.actualSize),
    vmSnapshotDescription: e?.vmSnapshot?.description ?? "",
    vmNameConnected: e?.vm?.name ?? "",
    // actualSize: `${convertBytesToGB(e?.actualSize)} GB`,
  })), [diskSnapshots])

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchDiskSnapshots} />
        <DiskSnapshotActionButtons />
      </div>
      <TablesOuter target={"disksnapshot"}
        columns={TableColumnsInfo.DISK_SNAPSHOT_FROM_STORAGE_DOMAIN}
        data={filteredData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setSnapshotsSelected(selectedRows)}
        isLoading={isDiskSnapshotsLoading} isRefetching={isDiskSnapshotsRefetching} isError={isDiskSnapshotsError} isSuccess={isDiskSnapshotsSuccess}
      />
      <SelectedIdView items={snapshotsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-snapshots;name=${domainsSelected[0]?.name}`}
      />
    </>
  );
};

export default DomainDiskSnapshots;

import React, { useCallback } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import SelectedIdView from "../../../components/common/SelectedIdView";
import SearchBox from "../../../components/button/SearchBox";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import TablesOuter from "../../../components/table/TablesOuter";
import { useAllVmsFromDisk } from "../../../api/RQHook";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";

/**
 * @name DiskVms
 * @description 디스크에 종속 된 가상머신 목록
 * (/storages/disks/<diskId>/vms)
 *
 * @param {string} diskId 디스크ID
 * @returns
 */
const DiskVms = ({ diskId }) => {
  const { vmsSelected, setVmsSelected } = useGlobal()
  const { 
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
    isRefetching: isVmsRefetching,
  } = useAllVmsFromDisk(diskId, (e) => ({  ...e }));

  const transformedData = [...vms].map((vm) => ({
    ...vm,
    icon: status2Icon(vm?.status),
    _name: (
      <TableRowClick type="vm" id={vm?.id}>
        {vm?.name}
      </TableRowClick>
    ),
    host: (
      <TableRowClick type="host" id={vm?.hostVo?.id}>
        {vm?.hostVo?.name}
      </TableRowClick>
    ),
    ipv4: `${vm?.ipv4} ${vm?.ipv6}`,
  }));

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`DiskVms > handleRefresh ... `)
    if (!refetchVms) return;
    refetchVms()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        {/*  */}
      </div>
      <TablesOuter target={"vm"}
        columns={TableColumnsInfo.VMS_FROM_DISK}
        data={filteredData} // ✅ 검색 필터링된 데이터 사용
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setVmsSelected(selectedRows)}
        isLoading={isVmsLoading} isRefetching={isVmsRefetching} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
    </>
  );
};

export default DiskVms;

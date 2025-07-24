import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import SearchBox              from "@/components/button/SearchBox";
import FilterButtons          from "@/components/button/FilterButtons";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import { status2Icon }        from "@/components/icons/RutilVmIcons";
import { getStatusSortKey }   from "@/components/icons/GetStatusSortkey";
import VmDiskActionButtons    from "@/components/dupl/VmDiskActionButtons";
import { checkZeroSizeToGiB } from "@/util";
import Localization           from "@/utils/Localization";

/**
 * @name VmDiskDupl
 * @description ...
 *
 * @param {Array} vmDisks
 * @returns
 */
const VmDiskDupl = ({ 
  vmDisks = [], showSearchBox=true, 
  refetch, isRefetching, isLoading, isError, isSuccess
}) => {
  const navigate = useNavigate();
  const {
    vmsSelected, setVmsSelected,
    disksSelected, setDisksSelected,
  } = useGlobal(); // 다중 선택된 디스크

  const transformedData = [...vmDisks]
  .sort((a, b) => { return (a?.diskImageVo?.alias?.toLowerCase()).localeCompare(b?.diskImageVo?.alias?.toLowerCase()) })
    .map((d) => {
      const diskImage = d?.diskImageVo;
      return {
        ...d,
        icon: status2Icon(d?.active ? "UP" : "DOWN"),
        iconSortKey: getStatusSortKey(diskImage?.status),
        _alias: (
          <TableRowClick type="disk" id={diskImage?.id}>
            {diskImage?.alias}
          </TableRowClick>
        ),
        description: diskImage?.description,
        bootable: d?.bootable ? Localization.kr.YES: "",
        readOnly: d?.readOnly ? Localization.kr.YES : "",
        sharable: diskImage?.sharable ? Localization.kr.YES : "",
        status: (diskImage?.imageTransferRunning) ? `잠김 (${diskImage?.imageTransferPercent.toFixed(2)}%)`: diskImage?.status.toUpperCase(),
        active: d?.active,
        interface: d?.interface_,
        storageType: diskImage?.storageType,
        sparse: diskImage?.sparse ? Localization.kr.THIN_PROVISIONING : Localization.kr.PREALLOCATED,
        virtualSize: checkZeroSizeToGiB(diskImage?.virtualSize),
        actualSize: checkZeroSizeToGiB(diskImage?.actualSize),
        storageDomain: (
          <TableRowClick type="domain" id={diskImage?.storageDomainVo?.id}>
            {diskImage?.storageDomainVo?.name}
          </TableRowClick>
        ),
        searchText: `${diskImage?.alias} ${diskImage?.storageDomainVo?.name || ""} ${vmsSelected[0]?.name || ""}`.toLowerCase(),
      };
    });

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = useCallback((id) => {
    navigate(`/storages/disks/${id}`);
  }, [navigate])

  const [activeDiskType, setActiveDiskType] = useState("all");
  const diskFilters = [
    { key: "all",   label: "모두" },
    { key: "image", label: "이미지" },
    { key: "lun",   label: "직접 LUN" },
  ];
  const columnMap = {
    all: TableColumnsInfo.DISKS_FROM_VM,
    image: TableColumnsInfo.DISK_IMAGES_FROM_VM,
    lun: TableColumnsInfo.DISK_LUN_FROM_VM,
  };
  const columns = columnMap[activeDiskType];

  return (
    <>
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
        <FilterButtons options={diskFilters} activeOption={activeDiskType} onClick={setActiveDiskType} />
        <VmDiskActionButtons />
      </div>
      <TablesOuter target={"vmdisk"}
        columns={columns}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        multiSelect={true}
        onRowClick={(selectedRows) => {
          setDisksSelected(selectedRows)
        }}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={disksSelected} />
    </>
  );
};

export default VmDiskDupl;
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import VmDiskActionButtons from "./VmDiskActionButtons";
import SearchBox from "../button/SearchBox";
import { status2Icon } from "../icons/RutilVmIcons";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import FilterButtons from "../button/FilterButtons";
import TableColumnsInfo from "../table/TableColumnsInfo";
import SelectedIdView from "../common/SelectedIdView";
import { checkZeroSizeToGiB } from "../../util";
import Logger from "../../utils/Logger";
import { getStatusSortKey } from "../icons/GetStatusSortkey";


/**
 * @name VmDiskDupl
 * @description ...
 *
 * @param {Array} vmDisks
 * @returns
 */
const VmDiskDupl = ({ 
  vmDisks = [], showSearchBox=true, 
  refetch, isLoading, isError, isSuccess,vmId
}) => {
  const navigate = useNavigate();
  const { vmsSelected, setVmsSelected, disksSelected, setDisksSelected } = useGlobal(); // 다중 선택된 디스크

  const transformedData = [...vmDisks].map((d) => {
    const diskImage = d?.diskImageVo;
    const status = d?.active ? "UP" : "DOWN"; 
    return {
      ...d,
      icon: status2Icon(status),
      iconSortKey: getStatusSortKey(status),
      _alias: (
        <TableRowClick type="disk" id={diskImage?.id}>
          {diskImage?.alias}
        </TableRowClick>
      ),
      connectionvm: vmsSelected[0]?.name || "",
      description: diskImage?.description,
      bootable: d?.bootable ? "예" : "",
      readOnly: d?.readOnly ? "예" : "",
      sharable: diskImage?.sharable ? "예" : "",
      status: diskImage?.status,
      interface: d?.interface_,
      storageType: diskImage?.storageType,
      sparse: diskImage?.sparse ? "씬 프로비저닝" : "사전 할당",
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

  const handleRefresh = useCallback(() => {
    Logger.debug(`VmDiskDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  const [activeDiskType, setActiveDiskType] = useState("all");
  const diskFilters = [
    { key: "all", label: "모두" },
    { key: "image", label: "이미지" },
    { key: "lun", label: "직접 LUN" },
  ];
  const columnMap = {
    all: TableColumnsInfo.DISKS_FROM_VM,
    image: TableColumnsInfo.DISK_IMAGES_FROM_VM,
    lun: TableColumnsInfo.DISK_LUN_FROM_VM,
  };
  const columns = columnMap[activeDiskType];

  return (
    <>
      <div className="dupl-header-group f-start gap-4 w-full">
        <FilterButtons options={diskFilters} activeOption={activeDiskType} onClick={setActiveDiskType} />
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        <VmDiskActionButtons />
      </div>
      <TablesOuter target={"vmdisk"}
        columns={columns}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        multiSelect={true}
        onRowClick={(selectedRows) => setDisksSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        /*onContextMenuItems={(row) => [ // 마우스 버튼
          <VmDiskActionButtons actionType="context" />
        ]}*/
      />
      <SelectedIdView items={disksSelected} />
    </>
  );
};

export default VmDiskDupl;
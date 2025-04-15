import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import VmDiskModals from "../modal/vm/VmDiskModals";
import VmDiskActionButtons from "./VmDiskActionButtons";
import SearchBox from "../button/SearchBox";
import { status2Icon } from "../icons/RutilVmIcons";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import FilterButton from "../button/FilterButton";
import TableColumnsInfo from "../table/TableColumnsInfo";
import SelectedIdView from "../common/SelectedIdView";
import { useVm } from "../../api/RQHook";
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
  vmDisks = [], 
  vmId, 
  showSearchBox=true,
  refetch,
  isLoading, isError, isSuccess,
}) => {
  const { data: vm } = useVm(vmId);
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState()
  const { disksSelected, setDisksSelected } = useGlobal(); // 다중 선택된 디스크

  const transformedData = (!Array.isArray(vmDisks) ? [] : vmDisks).map((d) => {
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
      connectionvm: vm?.name || "",
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
      searchText: `${diskImage?.alias} ${diskImage?.storageDomainVo?.name || ""} ${vm?.name || ""}`.toLowerCase(),
    };
  });

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleNameClick = (id) => navigate(`/storages/disks/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`VmDiskDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

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

  Logger.debug(`VmDiskDupl ... `)
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="vm-disk-button center mb-2.5">
        <FilterButton
          options={diskFilters}
          activeOption={activeDiskType}
          onClick={setActiveDiskType}
        />
        <div className="vm-disk-search center">
          {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />)}
          <VmDiskActionButtons
            isEditDisabled={disksSelected?.length !== 1}
            isDeleteDisabled={disksSelected?.length === 0}
            status={disksSelected[0]?.active ? "active" : "deactive"}            
          />
        </div>
      </div>
      
      <TablesOuter
        columns={columns}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setDisksSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [ // 마우스 버튼
          <VmDiskActionButtons actionType="context"
            isEditDisabled={!row}
          />
        ]}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
      />

      <SelectedIdView items={disksSelected} />

      {/* 디스크 모달창 */}
      <Suspense>
        <VmDiskModals disk={disksSelected[0]}
          vmId={vmId}
        />
      </Suspense>
    </div>
  );
};

export default VmDiskDupl;